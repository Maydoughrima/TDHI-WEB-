import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* ======================================================
   GET EMPLOYEE PAYSLIP FOR A PAYROLL FILE (FINALIZED)
====================================================== */
router.get(
  "/:payrollFileId/employees/:employeeId/payslip",
  async (req, res) => {
    const { payrollFileId, employeeId } = req.params;

    try {
      /* 1️⃣ Ensure payroll file is finalized */
      const { rows: fileRows } = await pool.query(
        `
        SELECT status
        FROM payroll_files
        WHERE id = $1
        `,
        [payrollFileId]
      );

      if (!fileRows.length || fileRows[0].status !== "done") {
        return res.status(400).json({
          success: false,
          message: "Payslip is only available for finalized payroll files",
        });
      }

      /* 2️⃣ Fetch snapshot (SOURCE OF TRUTH) */
      const { rows: snapRows } = await pool.query(
        `
        SELECT
          pes.quincena_rate,
          pes.manual_adjustments,
          pes.total_earnings,
          pes.total_deductions,
          pes.net_pay,

          pf.paycode,
          pf.period_start,
          pf.period_end,

          pt.transaction_code,
          pt.date_generated,

          e.employee_no,
          e.full_name,
          e.department

        FROM payroll_employee_snapshots pes
        JOIN payroll_files pf
          ON pf.id = pes.payroll_file_id
        JOIN payroll_transactions pt
          ON pt.payroll_file_id = pf.id
        JOIN employees e
          ON e.id = pes.employee_id

        WHERE pes.payroll_file_id = $1
          AND pes.employee_id = $2
        `,
        [payrollFileId, employeeId]
      );

      if (!snapRows.length) {
        return res.status(404).json({
          success: false,
          message: "Payslip snapshot not found",
        });
      }

      const snapshot = snapRows[0];

      /* 3️⃣ Fetch deductions (GOV + LOAN only) */
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
        [payrollFileId, employeeId]
      );

      /* 4️⃣ Final response */
      res.json({
        success: true,
        data: {
          ...snapshot,
          manual_adjustments: snapshot.manual_adjustments || [],
          deductions,
        },
      });
    } catch (err) {
      console.error("FETCH PAYSLIP ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to load payslip",
      });
    }
  }
);

export default router;
