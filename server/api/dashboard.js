import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * DASHBOARD — PAYROLL COST OVERVIEW
 * MODEL:
 * - ONE payroll file at a time
 * - Earnings vs Deductions
 * - payroll_file_id = source of truth
 * - paycode = display only
 * - status used: 'done'
 * ======================================================
 */

/**
 * ------------------------------------------------------
 * GET /api/dashboard/payroll-files
 * PURPOSE:
 * - Populate "Last Payroll" dropdown
 * - Returns FINALIZED payrolls (status = 'done')
 * ------------------------------------------------------
 */
router.get("/dashboard/payroll-files", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id AS payroll_file_id,
        paycode,
        period_start,
        period_end
      FROM payroll_files
      WHERE status = 'done'
      ORDER BY period_end DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Dashboard payroll files error:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * ------------------------------------------------------
 * GET /api/dashboard/payroll-cost-overview
 * PURPOSE:
 * - Donut / radial chart data
 * - Summarizes Earnings vs Deductions
 * - ONE payroll file only
 * ------------------------------------------------------
 */
router.get("/dashboard/payroll-cost-overview", async (req, res) => {
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
      SELECT
        pf.paycode,
        pf.period_start,
        pf.period_end,
        COALESCE(SUM(pt.total_earnings), 0)   AS earnings,
        COALESCE(SUM(pt.total_deductions), 0) AS deductions
      FROM payroll_transactions pt
      JOIN payroll_files pf
        ON pf.id = pt.payroll_file_id
      WHERE pf.id = $1
        AND pf.status = 'done'
      GROUP BY
        pf.paycode,
        pf.period_start,
        pf.period_end
      `,
      [payroll_file_id]
    );

    res.json({
      success: true,
      data: rows[0] || {
        paycode: null,
        period_start: null,
        period_end: null,
        earnings: 0,
        deductions: 0,
      },
    });
  } catch (error) {
    console.error("Payroll cost overview error:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * ======================================================
 * DASHBOARD — ENCODING SUMMARY (AUTO PAYROLL)
 * ======================================================
 * GET /api/dashboard/encoding-summary
 * PURPOSE:
 * - Show encoding progress for the CURRENT payroll
 * - Priority:
 *   1) Latest PENDING payroll
 *   2) Latest DONE payroll (fallback)
 * - No query params (backend decides)
 */
router.get("/dashboard/encoding-summary", async (req, res) => {
  try {
    // 1️⃣ Find latest PENDING payroll
    let payrollResult = await pool.query(`
      SELECT id
      FROM payroll_files
      WHERE status = 'pending'
      ORDER BY created_at DESC
      LIMIT 1
    `);

    // 2️⃣ Fallback to latest DONE payroll if no pending
    if (payrollResult.rows.length === 0) {
      payrollResult = await pool.query(`
        SELECT id
        FROM payroll_files
        WHERE status = 'done'
        ORDER BY created_at DESC
        LIMIT 1
      `);
    }

    // 3️⃣ If no payroll files exist at all
    if (payrollResult.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          payroll_file_id: null,
          total_employees: 0,
          completed: 0,
          pending: 0,
          in_progress: 0,
        },
      });
    }

    const payrollFileId = payrollResult.rows[0].id;

    // 4️⃣ TOTAL employees (entire company)
    const totalResult = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM employees
    `);

    // 5️⃣ COMPLETED employees (processed snapshots)
    const completedResult = await pool.query(
      `
      SELECT COUNT(DISTINCT employee_id)::int AS completed
      FROM payroll_employee_snapshots
      WHERE payroll_file_id = $1
      `,
      [payrollFileId]
    );

    const total = totalResult.rows[0].total;
    const completed = completedResult.rows[0].completed;
    const pending = Math.max(total - completed, 0);

    res.json({
      success: true,
      data: {
        payroll_file_id: payrollFileId,
        total_employees: total,
        completed,
        pending,
        in_progress: 0, // intentionally ignored for now
      },
    });
  } catch (error) {
    console.error("Encoding summary error:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * ======================================================
 * DASHBOARD — TRANSACTION SUMMARY
 * ======================================================
 * GET /api/dashboard/transaction-summary
 * PURPOSE:
 * - Count audit transactions
 * - Group by action enum
 * - Show last activity timestamp
 * - Backend decides everything
 */
router.get("/dashboard/transaction-summary", async (req, res) => {
  try {
    // 1️⃣ TOTAL TRANSACTIONS
    const totalResult = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM transactions
    `);

    // 2️⃣ COUNTS BY ACTION
    const actionResult = await pool.query(`
      SELECT action, COUNT(*)::int AS count
      FROM transactions
      GROUP BY action
    `);

    // 3️⃣ LAST ACTIVITY
    const lastActivityResult = await pool.query(`
      SELECT MAX(created_at) AS last_activity
      FROM transactions
    `);

    // Normalize action counts
    let created = 0;
    let edited = 0;
    let approved = 0; // not present in DB yet

    actionResult.rows.forEach((row) => {
      if (row.action === "ADD") created = row.count;
      if (row.action === "EDIT") edited = row.count;
    });

    res.json({
      success: true,
      data: {
        total: totalResult.rows[0].total,
        created,
        edited,
        approved,
        last_activity: lastActivityResult.rows[0].last_activity,
      },
    });
  } catch (error) {
    console.error("Transaction summary error:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * ======================================================
 * GET /api/dashboard/recent-transactions
 * PURPOSE:
 * - Dashboard preview (latest actions)
 * ======================================================
 */
router.get("/dashboard/recent-transactions", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        t.id,
        t.action,
        t.entity,
        t.reference_code,
        t.created_at,
        u.fullname AS actor_name,
        u.role AS actor_role
      FROM transactions t
      LEFT JOIN users u ON u.id = t.actor_id
      ORDER BY t.created_at DESC
      LIMIT 6
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Recent transactions error:", error);
    res.status(500).json({ success: false });
  }
});


export default router;
