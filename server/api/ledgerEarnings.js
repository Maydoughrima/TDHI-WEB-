import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * GET /api/ledger/earnings
 *
 * - One row per department
 * - Source of truth: payroll_employee_snapshots
 * - UI-compatible (placeholders for now)
 * ======================================================
 *
 * Query params:
 * - payroll_file_id (required)
 * - department (optional | "ALL")
 */
router.get("/ledger/earnings", async (req, res) => {
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

    if (department && department !== "ALL") {
      params.push(department);
      deptFilter = `AND e.department = $2`;
    }

    const { rows } = await pool.query(
      `
      SELECT
        e.department,

        /* =====================
           PLACEHOLDER EARNINGS
           (UI stays unchanged)
        ====================== */
        0::numeric AS "basicPay",
        0::numeric AS "overtime",
        0::numeric AS "n_prem",
        0::numeric AS "regHoliday",
        0::numeric AS "foodAllowance",
        0::numeric AS "otherAllowance",
        0::numeric AS "onCall",
        0::numeric AS "otherFarn",
        0::numeric AS "allowance_adj",

        /* =====================
           SOURCE OF TRUTH
        ====================== */
        COALESCE(SUM(ps.total_earnings), 0) AS "grossSalary"

      FROM payroll_employee_snapshots ps
      JOIN employees e
        ON e.id = ps.employee_id

      WHERE ps.payroll_file_id = $1
        ${deptFilter}

      GROUP BY e.department
      ORDER BY e.department
      `,
      params
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Earnings Ledger API error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch earnings ledger",
    });
  }
});

export default router;
