import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * SAVE / UPDATE EMPLOYEE PAYROLL SNAPSHOT
 * ======================================================
 */
router.post(
  "/payroll-files/:payrollFileId/employees/:employeeId/snapshot",
  async (req, res) => {
    const { payrollFileId, employeeId } = req.params;
    const userId = req.headers["x-user-id"];

    const {
      basic_rate,
      daily_rate,
      hourly_rate,
      quincena_rate,
      gov_deductions,
      loan_deductions,
      manual_adjustments,
      total_earnings,
      total_deductions,
      net_pay,
      activeCutoff, // 👈 ADD THIS FROM CLIENT
    } = req.body;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      /* ================= SAVE SNAPSHOT ================= */
      const result = await client.query(
        `
        INSERT INTO payroll_employee_snapshots (
          payroll_file_id,
          employee_id,
          basic_rate,
          daily_rate,
          hourly_rate,
          quincena_rate,
          gov_deductions,
          loan_deductions,
          manual_adjustments,
          total_earnings,
          total_deductions,
          net_pay,
          edited_by
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,
          $7::jsonb,$8::jsonb,$9::jsonb,
          $10,$11,$12,$13
        )
        ON CONFLICT (payroll_file_id, employee_id)
        DO UPDATE SET
          basic_rate = EXCLUDED.basic_rate,
          daily_rate = EXCLUDED.daily_rate,
          hourly_rate = EXCLUDED.hourly_rate,
          quincena_rate = EXCLUDED.quincena_rate,
          gov_deductions = EXCLUDED.gov_deductions,
          loan_deductions = EXCLUDED.loan_deductions,
          manual_adjustments = EXCLUDED.manual_adjustments,
          total_earnings = EXCLUDED.total_earnings,
          total_deductions = EXCLUDED.total_deductions,
          net_pay = EXCLUDED.net_pay,
          edited_by = EXCLUDED.edited_by,
          edited_at = NOW()
        RETURNING *;
        `,
        [
          payrollFileId,
          employeeId,
          basic_rate,
          daily_rate,
          hourly_rate,
          quincena_rate,
          JSON.stringify(gov_deductions),
          JSON.stringify(loan_deductions),
          JSON.stringify(manual_adjustments),
          total_earnings,
          total_deductions,
          net_pay,
          userId,
        ]
      );

      /* ======================================================
         🔥 NEW PART — SNAPSHOT MANUAL DEDUCTIONS
      ====================================================== */

      // 1️⃣ Clear old SYSTEM deductions
      await client.query(
        `
        DELETE FROM employee_payroll_deductions
        WHERE payroll_file_id = $1
          AND employee_id = $2
          AND source = 'SYSTEM'
        `,
        [payrollFileId, employeeId]
      );

      // 2️⃣ Insert MANUAL (DEDUCT only)
      const manual = Array.isArray(manual_adjustments)
        ? manual_adjustments
        : [];

      const manualDeducts = manual.filter(
        (m) => m.effect === "DEDUCT" && Number(m.amount || 0) !== 0
      );

      for (const m of manualDeducts) {
        await client.query(
          `
          INSERT INTO employee_payroll_deductions (
            employee_id,
            payroll_file_id,
            deduction_type,
            source,
            amount,
            cutoff,
            created_at
          )
          VALUES ($1, $2, $3, 'SYSTEM', $4, $5, NOW())
          `,
          [
            employeeId,
            payrollFileId,
            m.label.toUpperCase().replace(/\s+/g, "_"),
            Number(m.amount),
            activeCutoff || "FIRST",
          ]
        );
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("SAVE SNAPSHOT ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to save payroll snapshot",
      });
    } finally {
      client.release();
    }
  }
);

/**
 * ======================================================
 * GET EMPLOYEE PAYROLL SNAPSHOT
 * ======================================================
 */
router.get(
  "/payroll-files/:payrollFileId/employees/:employeeId/snapshot",
  async (req, res) => {
    const { payrollFileId, employeeId } = req.params;

    try {
      const result = await pool.query(
        `
        SELECT *
        FROM payroll_employee_snapshots
        WHERE payroll_file_id = $1
          AND employee_id = $2
        `,
        [payrollFileId, employeeId]
      );

      res.json({
        success: true,
        data: result.rows[0] || null,
      });
    } catch (err) {
      console.error("FETCH SNAPSHOT ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch payroll snapshot",
      });
    }
  }
);

export default router;
