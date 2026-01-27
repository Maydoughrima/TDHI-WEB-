import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* ======================================================
   GET ALL PAYSLIPS FOR A PAYROLL FILE (READ-ONLY)
====================================================== */
router.get("/:payrollFileId/payslips", async (req, res) => {
  const { payrollFileId } = req.params;

  try {
    /* 1️⃣ Ensure payroll is finalized */
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

    /* 2️⃣ Fetch base payslip data */
    const { rows } = await pool.query(
      `
      SELECT
        e.id                       AS employee_id,
        e.employee_no,
        e.full_name,
        e.department,

        pf.paycode,
        pf.period_start,
        pf.period_end,

        pt.transaction_code,
        pt.date_generated,

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

    /* 3️⃣ Attach deductions (GOV + MANUAL) per employee */
    const result = [];

    for (const row of rows) {
      const { rows: deductionRows } = await pool.query(
        `
        SELECT deduction_type, source, amount
        FROM employee_payroll_deductions
        WHERE payroll_file_id = $1
          AND employee_id = $2
        ORDER BY
          CASE
            WHEN source = 'GOV' THEN 1
            WHEN source = 'MANUAL' THEN 2
            ELSE 3
          END
        `,
        [payrollFileId, row.employee_id]
      );

      const govDeductions = deductionRows.filter(d => d.source === "GOV");
      const manualDeductions = deductionRows.filter(d => d.source === "SYSTEM");

      result.push({
        ...row,
        gov_deductions: govDeductions,
        manual_deductions: manualDeductions,
      });
    }

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
