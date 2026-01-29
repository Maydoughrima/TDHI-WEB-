import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* ======================================================
   GET ALL PAYSLIPS FOR A PAYROLL FILE (FINAL / READ-ONLY)
   SOURCE OF TRUTH:
   - Earnings + Manual Adjustments → payroll_employee_snapshots
   - GOV + LOAN Deductions         → employee_payroll_deductions
====================================================== */
router.get("/:payrollFileId/payslips", async (req, res) => {
  const { payrollFileId } = req.params;

  try {
    /* ======================================================
       1️⃣ Ensure payroll file is FINALIZED
    ====================================================== */
    const { rows: fileRows } = await pool.query(
      `
      SELECT id, status
      FROM payroll_files
      WHERE id = $1
      `,
      [payrollFileId]
    );

    if (!fileRows.length || fileRows[0].status !== "done") {
      return res.status(400).json({
        success: false,
        message: "Payslips can only be generated for finalized payrolls",
      });
    }

    /* ======================================================
       2️⃣ Fetch PAYSLIP SNAPSHOTS (PRIMARY DATA)
    ====================================================== */
    const { rows: snapshots } = await pool.query(
      `
      SELECT
        e.id               AS employee_id,
        e.employee_no,
        e.full_name,
        e.department,

        pf.paycode,
        pf.period_start,
        pf.period_end,

        pt.transaction_code,
        pt.date_generated,

        -- SNAPSHOT VALUES (FINAL)
        pes.quincena_rate,
        pes.manual_adjustments,
        pes.total_earnings,
        pes.total_deductions,
        pes.net_pay

      FROM payroll_employee_snapshots pes
      JOIN employees e
        ON e.id = pes.employee_id
      JOIN payroll_files pf
        ON pf.id = pes.payroll_file_id
      JOIN payroll_transactions pt
        ON pt.payroll_file_id = pf.id

      WHERE pes.payroll_file_id = $1
      ORDER BY e.full_name
      `,
      [payrollFileId]
    );

    /* ======================================================
       3️⃣ Attach GOV + LOAN DEDUCTIONS per employee
    ====================================================== */
    const result = [];

    for (const snap of snapshots) {
      const { rows: deductions } = await pool.query(
        `
        SELECT
          deduction_type,
          source,
          amount
        FROM employee_payroll_deductions
        WHERE payroll_file_id = $1
          AND employee_id = $2
          AND source IN ('GOV', 'LOAN')
        ORDER BY source, deduction_type
        `,
        [payrollFileId, snap.employee_id]
      );

      result.push({
        employee_id: snap.employee_id,
        employee_no: snap.employee_no,
        full_name: snap.full_name,
        department: snap.department,

        paycode: snap.paycode,
        period_start: snap.period_start,
        period_end: snap.period_end,

        transaction_code: snap.transaction_code,
        date_generated: snap.date_generated,

        quincena_rate: snap.quincena_rate,
        manual_adjustments: snap.manual_adjustments || [],
        deductions, // GOV + LOAN only

        total_earnings: snap.total_earnings,
        total_deductions: snap.total_deductions,
        net_pay: snap.net_pay,
      });
    }

    /* ======================================================
       4️⃣ RESPONSE
    ====================================================== */
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("FETCH PAYSLIPS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load payslips",
    });
  }
});

export default router;
