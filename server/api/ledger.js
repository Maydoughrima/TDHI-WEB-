import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * GET /api/ledger
 * PURPOSE:
 * - ONE row per department
 * - FINALIZED payroll only
 * - Source of truth: employee_payroll_deductions
 * ======================================================
 */
router.get("/ledger", async (req, res) => {
  const { payroll_file_id, department } = req.query;

  if (!payroll_file_id) {
    return res.status(400).json({
      success: false,
      message: "Missing payroll_file_id",
    });
  }

  try {
    const params = [payroll_file_id];
    let deptFilter = "";

    if (department) {
      params.push(department);
      deptFilter = `AND e.department = $2`;
    }

    const { rows } = await pool.query(
      `
      SELECT
        e.department,

        /* GOVERNMENT */
        SUM(CASE WHEN epd.deduction_type = 'SSS_PREMIUM' THEN epd.amount ELSE 0 END) AS "SSS",
        SUM(CASE WHEN epd.deduction_type = 'PHILHEALTH_PREMIUM' THEN epd.amount ELSE 0 END) AS "PHILHEALTH",
        SUM(CASE WHEN epd.deduction_type = 'PAGIBIG_PREMIUM' THEN epd.amount ELSE 0 END) AS "HDMF_PREM",

        /* LOANS */
        SUM(CASE WHEN epd.deduction_type = 'SSS_LOAN' THEN epd.amount ELSE 0 END) AS "SSS_LOAN",
        SUM(CASE WHEN epd.deduction_type = 'PHILHEALTH_LOAN' THEN epd.amount ELSE 0 END) AS "PHILHEALTH_LOAN",
        SUM(CASE WHEN epd.deduction_type = 'PAGIBIG_LOAN' THEN epd.amount ELSE 0 END) AS "HDMF_LOAN",

        /* COMPANY / MANUAL */
        SUM(CASE WHEN epd.deduction_type = 'LATE_/_UNDERTIME' THEN epd.amount ELSE 0 END) AS "LATE",
        SUM(CASE WHEN epd.deduction_type = 'HOSPITAL_ACCOUNTS' THEN epd.amount ELSE 0 END) AS "HOSPITAL_ACCOUNTS",
        SUM(CASE WHEN epd.deduction_type = 'CANTEEN' THEN epd.amount ELSE 0 END) AS "CANTEEN",
        SUM(CASE WHEN epd.deduction_type = 'HSBC' THEN epd.amount ELSE 0 END) AS "HSBC",
        SUM(CASE WHEN epd.deduction_type = 'COOP' THEN epd.amount ELSE 0 END) AS "COOP",
        SUM(CASE WHEN epd.deduction_type = 'LEAVE_W/O_PAY' THEN epd.amount ELSE 0 END) AS "LEAVE",
        SUM(CASE WHEN epd.deduction_type = 'OTHER_DED_(NSO_/_ADJUSTMENT)' THEN epd.amount ELSE 0 END) AS "OTHERS",

        /* TOTAL */
        SUM(epd.amount) AS "TOTAL"

      FROM employee_payroll_deductions epd
      JOIN employees e ON e.id = epd.employee_id
      JOIN payroll_files pf ON pf.id = epd.payroll_file_id

      WHERE pf.id = $1
        AND pf.status = 'done'
        ${deptFilter}

      GROUP BY e.department
      ORDER BY e.department
      `,
      params
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Ledger API error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ledger data",
    });
  }
});

/**
 * ======================================================
 * GET /api/ledger/payroll-files
 * ======================================================
 */
router.get("/ledger/payroll-files", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, paycode, period_start, period_end
      FROM payroll_files
      WHERE status = 'done'
      ORDER BY created_at DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/**
 * ======================================================
 * GET /api/ledger/departments
 * ======================================================
 */
router.get("/ledger/departments", async (req, res) => {
  const { payroll_file_id } = req.query;

  if (!payroll_file_id) {
    return res.status(400).json({ success: false });
  }

  const { rows } = await pool.query(
    `
    SELECT DISTINCT e.department
    FROM employee_payroll_deductions epd
    JOIN employees e ON e.id = epd.employee_id
    JOIN payroll_files pf ON pf.id = epd.payroll_file_id
    WHERE pf.id = $1
      AND pf.status = 'done'
      AND e.department IS NOT NULL
    ORDER BY e.department
    `,
    [payroll_file_id]
  );

  res.json({ success: true, data: rows.map(r => r.department) });
});

export default router;
