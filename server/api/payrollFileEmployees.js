import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * GET EMPLOYEE PAYSLIP (FINALIZED PAYROLL ONLY)
 * ======================================================
 */
router.get(
  "/:payrollFileId/employees/:employeeId/payslip",
  async (req, res) => {
    const { payrollFileId, employeeId } = req.params;

    try {
      // 1️⃣ Ensure payroll is finalized
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
          message: "Payslip available only for finalized payroll",
        });
      }

      // 2️⃣ Fetch snapshot (SOURCE OF TRUTH)
      const { rows: snapshotRows } = await pool.query(
        `
        SELECT *
        FROM payroll_employee_snapshots
        WHERE payroll_file_id = $1
          AND employee_id = $2
        `,
        [payrollFileId, employeeId]
      );

      if (!snapshotRows.length) {
        return res.status(404).json({
          success: false,
          message: "Payslip snapshot not found",
        });
      }

      // 3️⃣ Fetch employee + payroll meta
      const { rows: metaRows } = await pool.query(
        `
        SELECT
          e.employee_no,
          e.full_name,
          e.department,
          pf.paycode,
          pf.period_start,
          pf.period_end,
          pt.transaction_code
        FROM employees e
        JOIN payroll_employee_snapshots pes
          ON pes.employee_id = e.id
        JOIN payroll_files pf
          ON pf.id = pes.payroll_file_id
        JOIN payroll_transactions pt
          ON pt.payroll_file_id = pf.id
        WHERE pes.payroll_file_id = $1
          AND pes.employee_id = $2
        `,
        [payrollFileId, employeeId]
      );

      res.json({
        success: true,
        data: {
          ...metaRows[0],
          ...snapshotRows[0],
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
