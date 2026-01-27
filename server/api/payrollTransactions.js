import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* ======================================================
   GET PAYROLL SUMMARY (READ-ONLY, ACCURATE)
   Used for print / detailed view if needed
====================================================== */
router.get("/:payrollFileId/summary", async (req, res) => {
  const { payrollFileId } = req.params;

  try {
    /* 1️⃣ FETCH TRANSACTION + PAYROLL METADATA */
    const { rows: metaRows } = await pool.query(
      `
      SELECT
        pt.transaction_code,
        pt.date_generated,
        pf.paycode,
        pf.period_start,
        pf.period_end
      FROM payroll_transactions pt
      JOIN payroll_files pf
        ON pf.id = pt.payroll_file_id
      WHERE pf.id = $1
      `,
      [payrollFileId]
    );

    if (!metaRows.length) {
      return res.status(404).json({
        success: false,
        message: "Payroll transaction not found",
      });
    }

    /* 2️⃣ ACCURATE TOTALS FROM SNAPSHOTS */
    const { rows: summaryRows } = await pool.query(
      `
      SELECT
        COUNT(DISTINCT employee_id)        AS employee_count,
        COALESCE(SUM(total_earnings), 0)   AS total_earnings,
        COALESCE(SUM(total_deductions), 0) AS total_deductions,
        COALESCE(SUM(net_pay), 0)          AS total_net_pay
      FROM payroll_employee_snapshots
      WHERE payroll_file_id = $1
      `,
      [payrollFileId]
    );

    res.json({
      success: true,
      data: {
        ...metaRows[0],
        ...summaryRows[0],
      },
    });
  } catch (err) {
    console.error("FETCH PAYROLL SUMMARY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load payroll summary",
    });
  }
});

/* ======================================================
   GET PAYROLL TRANSACTION HISTORY (ACCURATE TABLE DATA)
   This powers the Transactions table directly
====================================================== */
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        pt.id                     AS transaction_id,
        pt.transaction_code,
        pf.id                     AS payroll_file_id,
        pf.paycode,
        pf.period_start,
        pf.period_end,
        pt.date_generated,

        /* ✅ ACCURATE TOTALS FROM SNAPSHOTS */
        COUNT(DISTINCT pes.employee_id)              AS employee_count,
        COALESCE(SUM(pes.total_earnings), 0)         AS total_earnings,
        COALESCE(SUM(pes.total_deductions), 0)       AS total_deductions,
        COALESCE(SUM(pes.net_pay), 0)                AS total_net_pay

      FROM payroll_transactions pt
      JOIN payroll_files pf
        ON pf.id = pt.payroll_file_id
      LEFT JOIN payroll_employee_snapshots pes
        ON pes.payroll_file_id = pf.id

      GROUP BY
        pt.id,
        pt.transaction_code,
        pf.id,
        pf.paycode,
        pf.period_start,
        pf.period_end,
        pt.date_generated

      ORDER BY pt.date_generated DESC
      `
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("FETCH TRANSACTION HISTORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load transaction history",
    });
  }
});

export default router;
