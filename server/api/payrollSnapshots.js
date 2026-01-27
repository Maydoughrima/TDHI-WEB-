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
    const userId = req.headers["x-user-id"]; // payroll checker

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
    } = req.body;

    try {
      const result = await pool.query(
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

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (err) {
      console.error("SAVE SNAPSHOT ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to save payroll snapshot",
      });
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

      if (result.rows.length === 0) {
        return res.json({
          success: true,
          data: null, // 👈 IMPORTANT
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
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

// ======================================================
// SAVE / UPDATE EMPLOYEE PAYROLL SNAPSHOT (MANUAL EDITS)
// ======================================================
export default router;
