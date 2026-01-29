import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * GET /api/ledger
 * PURPOSE:
 * - Ledger table data
 * - ONE row per department
 * - Columns = deduction codes
 * - FINALIZED payroll files only
 *
 * REQUIRED QUERY PARAMS:
 * - payroll_file_id (UUID)
 * - entry_type (EARNING | DEDUCTION)
 *
 * OPTIONAL QUERY PARAMS:
 * - department
 * ======================================================
 */
router.get("/ledger", async (req, res) => {
  const { payroll_file_id, entry_type, department } = req.query;

  if (!payroll_file_id || !entry_type) {
    return res.status(400).json({
      success: false,
      message: "Missing payroll_file_id or entry_type",
    });
  }

  if (!["EARNING", "DEDUCTION"].includes(entry_type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid entry_type",
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

        SUM(CASE WHEN pli.deduction_code = 'LATE' THEN pli.amount ELSE 0 END) AS "LATE",
        SUM(CASE WHEN pli.deduction_code = 'SSS' THEN pli.amount ELSE 0 END) AS "SSS",
        SUM(CASE WHEN pli.deduction_code = 'PHILHEALTH' THEN pli.amount ELSE 0 END) AS "PHILHEALTH",
        SUM(CASE WHEN pli.deduction_code = 'HDMF_PREM' THEN pli.amount ELSE 0 END) AS "HDMF_PREM",
        SUM(CASE WHEN pli.deduction_code = 'HDMF_LOAN' THEN pli.amount ELSE 0 END) AS "HDMF_LOAN",
        SUM(CASE WHEN pli.deduction_code = 'SSS_LOAN' THEN pli.amount ELSE 0 END) AS "SSS_LOAN",
        SUM(CASE WHEN pli.deduction_code = 'SSS_CAL' THEN pli.amount ELSE 0 END) AS "SSS_CAL",
        SUM(CASE WHEN pli.deduction_code = 'HOSPT_ACT' THEN pli.amount ELSE 0 END) AS "HOSPT_ACT",
        SUM(CASE WHEN pli.deduction_code = 'CANTEEN' THEN pli.amount ELSE 0 END) AS "CANTEEN",
        SUM(CASE WHEN pli.deduction_code = 'HSBC' THEN pli.amount ELSE 0 END) AS "HSBC",
        SUM(CASE WHEN pli.deduction_code = 'COOP' THEN pli.amount ELSE 0 END) AS "COOP",
        SUM(CASE WHEN pli.deduction_code = 'LEAVE' THEN pli.amount ELSE 0 END) AS "LEAVE",
        SUM(CASE WHEN pli.deduction_code = 'OTHERS' THEN pli.amount ELSE 0 END) AS "OTHERS",

        SUM(pli.amount) AS "TOTAL"

      FROM payroll_line_items pli
      JOIN employees e ON e.id = pli.employee_id
      JOIN payroll_files pf ON pf.id = pli.payroll_file_id

      WHERE pf.id = $1
        AND pf.status = 'done'
        AND pli.entry_type = 'DEDUCTION'
        AND pli.deduction_code IS NOT NULL
        ${deptFilter}

      GROUP BY e.department
      ORDER BY e.department
      `,
      params,
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
 * PURPOSE:
 * - Populate Payroll File dropdown
 * - FINALIZED payroll files only
 * ======================================================
 */
router.get("/ledger/payroll-files", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        paycode,
        period_start,
        period_end
      FROM payroll_files
      WHERE status = 'done'
      ORDER BY created_at DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Ledger payroll files fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payroll files",
    });
  }
});

/**
 * ======================================================
 * GET /api/ledger/departments
 * PURPOSE:
 * - Populate Department dropdown
 * - Scoped to selected payroll file
 * ======================================================
 */
router.get("/ledger/departments", async (req, res) => {
  const { payroll_file_id } = req.query;

  if (!payroll_file_id) {
    return res.status(400).json({
      success: false,
      message: "Missing payroll_file_id",
    });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT DISTINCT e.department
      FROM payroll_line_items pli
      JOIN employees e ON e.id = pli.employee_id
      JOIN payroll_files pf ON pf.id = pli.payroll_file_id
      WHERE pf.id = $1
        AND pf.status = 'done'
        AND e.department IS NOT NULL
      ORDER BY e.department
      `,
      [payroll_file_id],
    );

    res.json({
      success: true,
      data: rows.map((r) => r.department),
    });
  } catch (err) {
    console.error("Ledger departments fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
});

export default router;
