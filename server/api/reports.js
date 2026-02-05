// routes/reports.js
import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * GET /api/reports/deductions
 * PURPOSE:
 * - Per-employee deduction report
 * - FINALIZED payroll only
 * - Source: employee_payroll_deductions
 * - HSBC is EXCLUDED
 * ======================================================
 */
router.get("/reports/deductions", async (req, res) => {
  const { payroll_file_id, deduction_type } = req.query;

  if (!payroll_file_id || !deduction_type) {
    return res.status(400).json({
      success: false,
      message: "Missing payroll_file_id or deduction_type",
    });
  }

  // ❌ Explicitly block HSBC
  if (deduction_type === "HSBC") {
    return res.json({ success: true, data: [] });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT
        pf.paycode,
        e.employee_no,
        e.full_name AS employee_name,
        e.department,
        epd.amount
      FROM employee_payroll_deductions epd
      JOIN employees e
        ON e.id = epd.employee_id
      JOIN payroll_files pf
        ON pf.id = epd.payroll_file_id
      WHERE pf.id = $1
        AND pf.status = 'done'
        AND epd.deduction_type = $2
      ORDER BY e.department, e.full_name
      `,
      [payroll_file_id, deduction_type],
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("DEDUCTIONS REPORT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load deductions report",
    });
  }
});

/**
 * ======================================================
 * GET /api/reports/deductions/types
 * PURPOSE:
 * - Populate deduction dropdown
 * - HSBC is EXCLUDED
 * ======================================================
 */
router.get("/reports/deductions/types", async (req, res) => {
  const { payroll_file_id } = req.query;

  if (!payroll_file_id) {
    return res.status(400).json({ success: false });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT DISTINCT deduction_type
      FROM employee_payroll_deductions
      WHERE payroll_file_id = $1
        AND deduction_type <> 'HSBC'
      ORDER BY deduction_type
      `,
      [payroll_file_id],
    );

    res.json({
      success: true,
      data: rows.map((r) => r.deduction_type),
    });
  } catch (err) {
    console.error("Fetch deduction types error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   GET /api/reports/expenditures
   PURPOSE:
   - Paycode-level expenditures summary
   - FINALIZED payroll only
   - SINGLE ROW result
====================================================== */
router.get("/reports/expenditures", async (req, res) => {
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

        /* ================= SALARIES ================= */
        COALESCE(salaries.total_earnings, 0) AS salaries_and_wages,

        /* ================= FOOD ALLOWANCE ================= */
        COALESCE(food.food_allowance, 0) AS food_allowance,

        /* ================= GOVERNMENT AP ================= */
        COALESCE(deductions.ap_sss, 0) AS ap_sss,
        COALESCE(deductions.ap_phic, 0) AS ap_phic,

        /* ================= LOANS ================= */
        COALESCE(deductions.sss_salary_loan, 0) AS sss_salary_loan,
        COALESCE(deductions.sss_calamity_loan, 0) AS sss_calamity_loan,

        /* ================= TAX & COMPANY ================= */
        COALESCE(deductions.withholding_tax, 0) AS withholding_tax,
        COALESCE(deductions.hospital_account, 0) AS hospital_account,
        COALESCE(deductions.canteen, 0) AS canteen,
        COALESCE(deductions.other_nso, 0) AS other_nso,

        /* ================= MANUAL EXPENSES ================= */
        COALESCE(manual.radiology_supplies, 0) AS radiology_supplies,
        COALESCE(manual.nursing_supplies, 0) AS nursing_supplies,
        COALESCE(manual.affiliation_fee, 0) AS affiliation_fee,
        COALESCE(manual.accured_expenses, 0) AS accured_expenses,

        /* ================= CASH ================= */
        COALESCE(salaries.cash_in_bank_dbp, 0) AS cash_in_bank_dbp

      FROM payroll_files pf

      /* ===== EMPLOYEE TOTALS (SAFE AGGREGATION) ===== */
      LEFT JOIN (
        SELECT
          payroll_file_id,
          SUM(total_earnings) AS total_earnings,
          SUM(net_pay) AS cash_in_bank_dbp
        FROM payroll_employee_snapshots
        GROUP BY payroll_file_id
      ) salaries
        ON salaries.payroll_file_id = pf.id

      /* ===== FOOD ALLOWANCE FROM SNAPSHOT JSON ===== */
      LEFT JOIN (
        SELECT
          ps.payroll_file_id,
          SUM((adj->>'amount')::numeric) AS food_allowance
        FROM payroll_employee_snapshots ps
        JOIN LATERAL jsonb_array_elements(ps.manual_adjustments) adj ON true
        WHERE adj->>'label' = 'Food Allow / Others'
          AND adj->>'effect' = 'ADD'
        GROUP BY ps.payroll_file_id
      ) food
        ON food.payroll_file_id = pf.id

      /* ===== DEDUCTIONS (SAFE GROUPED) ===== */
      LEFT JOIN (
        SELECT
          payroll_file_id,
          SUM(CASE WHEN deduction_type = 'SSS_PREMIUM' THEN amount ELSE 0 END) AS ap_sss,
          SUM(CASE WHEN deduction_type = 'PHILHEALTH_PREMIUM' THEN amount ELSE 0 END) AS ap_phic,
          SUM(CASE WHEN deduction_type = 'SSS_SALARY_LOAN' THEN amount ELSE 0 END) AS sss_salary_loan,
          SUM(CASE WHEN deduction_type = 'SSS_CALAMITY_LOAN' THEN amount ELSE 0 END) AS sss_calamity_loan,
          SUM(CASE WHEN deduction_type = 'W/HOLDING_TAX' THEN amount ELSE 0 END) AS withholding_tax,
          SUM(CASE WHEN deduction_type = 'HOSPITAL_ACCOUNTS' THEN amount ELSE 0 END) AS hospital_account,
          SUM(CASE WHEN deduction_type = 'CANTEEN' THEN amount ELSE 0 END) AS canteen,
          SUM(CASE WHEN deduction_type = 'OTHER_DED_(NSO_/_ADJUSTMENT)' THEN amount ELSE 0 END) AS other_nso
        FROM employee_payroll_deductions
        GROUP BY payroll_file_id
      ) deductions
        ON deductions.payroll_file_id = pf.id

      /* ===== MANUAL EXPENSES (NO MULTIPLICATION) ===== */
      LEFT JOIN (
        SELECT
          payroll_file_id,
          SUM(CASE WHEN expense_type = 'RADIOLOGY_SUPPLIES' THEN amount ELSE 0 END) AS radiology_supplies,
          SUM(CASE WHEN expense_type = 'NURSING_SUPPLIES' THEN amount ELSE 0 END) AS nursing_supplies,
          SUM(CASE WHEN expense_type = 'AFFILIATION_FEE' THEN amount ELSE 0 END) AS affiliation_fee,
           SUM(CASE WHEN expense_type = 'ACCURED_EXPENSES' THEN amount ELSE 0 END) AS accured_expenses
        FROM payroll_expenditure_adjustments
        GROUP BY payroll_file_id
      ) manual
        ON manual.payroll_file_id = pf.id

      WHERE pf.id = $1
        AND pf.status = 'done'
      `,
      [payroll_file_id]
    );

    res.json({
      success: true,
      data: rows.length ? rows[0] : null,
    });
  } catch (err) {
    console.error("EXPENDITURES REPORT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load expenditures report",
    });
  }
});


// POST or UPDATE (UPSERT)
// POST /api/reports/expenditures/manual
/**
 * ======================================================
 * POST /api/reports/expenditures/manual
 * PURPOSE:
 * - Save MANUAL expenditures per payroll file
 * - Idempotent (safe to resave)
 * - Source of truth: payroll_expenditure_adjustments
 * ======================================================
 */
router.post("/reports/expenditures/manual", async (req, res) => {
  const actorId = req.headers["x-user-id"];
  const { payroll_file_id, items } = req.body;

  if (!actorId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!payroll_file_id || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "Invalid payload" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("▶ MANUAL EXP EDIT REQUEST");
    console.log("Payroll:", payroll_file_id);
    console.log("Items:", items);

    for (const item of items) {
      const amount = Number(item.amount);

      if (!item.type || isNaN(amount)) continue;

      await client.query(
        `
        INSERT INTO payroll_expenditure_adjustments (
          payroll_file_id,
          expense_type,
          amount,
          updated_at
        )
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (payroll_file_id, expense_type)
        DO UPDATE SET
          amount = EXCLUDED.amount,
          updated_at = NOW()
        `,
        [payroll_file_id, item.type, amount]
      );
    }

    await client.query(
      `
      INSERT INTO transactions (
        actor_id,
        actor_role,
        action,
        entity,
        entity_id,
        status,
        description
      )
      VALUES ($1,'PAYROLL_CHECKER','EDIT','PAYROLL_EXPENDITURES',$2,'COMPLETED',
              'Edited manual expenditures')
      `,
      [actorId, payroll_file_id]
    );

    await client.query("COMMIT");

    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("MANUAL EXP SAVE FAILED:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});


export default router;
