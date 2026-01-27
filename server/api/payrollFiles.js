import express from "express";
import { pool } from "../config/db.js";
import { transactionLog } from "../services/transactionLog.js";
import { applyLoanDeduction } from "../api/applyLoanDeduction.js";

const router = express.Router();

/* ======================================================
   GOV COMPUTATIONS
   - IMPORTANT: employee_payroll.basic_rate is QUINCENA
   - For gov bases, we use MONTHLY = QUINCENA * 2
====================================================== */

const round2 = (v) => Math.round((Number(v) || 0) * 100) / 100;

const SSS_EMPLOYEE_TABLE = [
  { min: 0, max: 5250, employee: 250 },
  { min: 5250, max: 5749.99, employee: 275 },
  { min: 5750, max: 6249.99, employee: 300 },
  { min: 6250, max: 6749.99, employee: 325 },
  { min: 6750, max: 7249.99, employee: 350 },
  { min: 7250, max: 7749.99, employee: 375 },
  { min: 7750, max: 8249.99, employee: 400 },
  { min: 8250, max: 8749.99, employee: 425 },
  { min: 8750, max: 9249.99, employee: 450 },
  { min: 9250, max: 9749.99, employee: 475 },
  { min: 9750, max: 10249.99, employee: 500 },
  { min: 10250, max: 10749.99, employee: 525 },
  { min: 10750, max: 11249.99, employee: 550 },
  { min: 11250, max: 11749.99, employee: 575 },
  { min: 11750, max: 12249.99, employee: 600 },
  { min: 12250, max: 12749.99, employee: 625 },
  { min: 12750, max: 13249.99, employee: 650 },
  { min: 13250, max: 13749.99, employee: 675 },
  { min: 13750, max: 14249.99, employee: 700 },
  { min: 14250, max: 14749.99, employee: 725 },
  { min: 14750, max: 15249.99, employee: 750 },
  { min: 15250, max: 15749.99, employee: 775 },
  { min: 15750, max: 16249.99, employee: 800 },
  { min: 16250, max: 16749.99, employee: 825 },
  { min: 16750, max: 17249.99, employee: 850 },
  { min: 17250, max: 17749.99, employee: 875 },
  { min: 17750, max: 18249.99, employee: 900 },
  { min: 18250, max: 18749.99, employee: 925 },
  { min: 18750, max: 19249.99, employee: 950 },
  { min: 19250, max: 19749.99, employee: 975 },
  { min: 19750, max: 20249, employee: 1000 },
  { min: 20250, max: 20749, employee: 1025 },
  { min: 20750, max: 21249, employee: 1050 },
  { min: 21250, max: 21749, employee: 1075 },
  { min: 21750, max: 22249, employee: 1100 },
  { min: 22250, max: 22749, employee: 1125 },
  { min: 22750, max: 23249, employee: 1150 },
  { min: 23250, max: 23749, employee: 1175 },
  { min: 23750, max: 24249, employee: 1200 },
  { min: 24250, max: 24749, employee: 1225 },
  { min: 24750, max: 25249, employee: 1250 },
  { min: 25250, max: 25749, employee: 1275 },
  { min: 25750, max: 26249, employee: 1300 },
  { min: 26250, max: 26749, employee: 1325 },
  { min: 26750, max: 27249, employee: 1350 },
  { min: 27250, max: 27749, employee: 1375 },
  { min: 27750, max: 28249, employee: 1400 },
  { min: 28250, max: 28749, employee: 1425 },
  { min: 28750, max: 29249, employee: 1450 },
  { min: 29250, max: 29749.99, employee: 1475 },
  { min: 29750, max: 30249.99, employee: 1500 },
  { min: 30250, max: 30749.99, employee: 1525 },
  { min: 30750, max: 31249.99, employee: 1550 },
  { min: 31250, max: 31749.99, employee: 1575 },
  { min: 31750, max: 32249.99, employee: 1600 },
  { min: 32250, max: 32749.99, employee: 1625 },
  { min: 32750, max: 33249.99, employee: 1650 },
  { min: 33250, max: 33749.99, employee: 1675 },
  { min: 33750, max: 34249.99, employee: 1700 },
  { min: 34250, max: 34749.99, employee: 1725 },
  { min: 34750, max: Infinity, employee: 1750 },
];

function computeSSSPremium(monthlyBase) {
  if (!monthlyBase || monthlyBase <= 0) return 0;
  const row = SSS_EMPLOYEE_TABLE.find(
    (b) => monthlyBase >= b.min && monthlyBase <= b.max,
  );
  return row ? row.employee : 0;
}

function computePhilHealthPremium(monthlyBase) {
  if (!monthlyBase || monthlyBase <= 0) return 0;
  const FLOOR = 10000;
  const CEILING = 100000;
  const RATE = 0.025;
  const base = Math.min(Math.max(monthlyBase, FLOOR), CEILING);
  return round2(base * RATE);
}

function computePagIbigPremium(monthlyBase) {
  if (!monthlyBase || monthlyBase <= 0) return 0;

  // Employee share = 2% of monthly salary (NO CAP)
  return round2(monthlyBase * 0.02);
}

/* ======================================================
   NOTE ABOUT TABLE
   This code assumes employee_payroll_deductions has columns:
     - payroll_file_id
     - employee_id
     - deduction_type
     - amount
     - source_type ('GOV'|'LOAN')
     - cutoff ('FIRST'|'SECOND')
====================================================== */

async function insertDeductionRow(client, row) {
  const {
    payrollFileId,
    employeeId,
    deductionType,
    amount,
    sourceType,
    cutoff,
  } = row;

  // skip zero/negative
  const amt = round2(amount);
  if (!amt || amt <= 0) return;

  // map logical sourceType → db source
  const source =
    sourceType === "GOV" ? "GOV" : sourceType === "LOAN" ? "LOAN" : "MANUAL";

  await client.query(
    `
    INSERT INTO employee_payroll_deductions (
      payroll_file_id,
      employee_id,
      deduction_type,
      amount,
      source,
      cutoff
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
    [payrollFileId, employeeId, deductionType, amt, source, cutoff],
  );
}

/* ======================================================
   PATCH /api/payroll-files/:id/finalize
   - Finalize with HR override
====================================================== */
router.patch("/:id/finalize", async (req, res) => {
  const client = await pool.connect();

  try {
    const actorId = req.headers["x-user-id"];
    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });
    }

    const actorRole = "PAYROLL_CHECKER";
    const payrollId = req.params.id;

    await client.query("BEGIN");

    /* ======================================================
       1️⃣ LOCK PAYROLL FILE
    ====================================================== */
    const { rows: pfRows } = await client.query(
      `SELECT * FROM payroll_files WHERE id = $1 FOR UPDATE`,
      [payrollId],
    );

    if (!pfRows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    const payrollFile = pfRows[0];

    if (payrollFile.status === "done") {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Payroll already finalized",
      });
    }

    const isSecondCutoff = !!payrollFile.last_pay;
    const cutoffLabel = isSecondCutoff ? "SECOND" : "FIRST";

    /* ======================================================
       🧹 IDEMPOTENCY — CLEAR SYSTEM DEDUCTIONS
    ====================================================== */
    await client.query(
      `
      DELETE FROM employee_payroll_deductions
      WHERE payroll_file_id = $1
        AND cutoff = $2
        AND source IN ('GOV','LOAN')
      `,
      [payrollId, cutoffLabel],
    );

    /* ======================================================
       2️⃣ FETCH EMPLOYEES
    ====================================================== */
    const { rows: empRows } = await client.query(`
      SELECT id FROM employees
    `);

    const totalEmployees = empRows.length;

    let missingPayrollInfo = 0;
    let appliedGovCount = 0;
    let appliedLoanCount = 0;

    /* ======================================================
       3️⃣ PROCESS EMPLOYEES
    ====================================================== */
    for (const emp of empRows) {
      const { rows: pRows } = await client.query(
        `
        SELECT basic_rate
        FROM employee_payroll
        WHERE employee_id = $1
        `,
        [emp.id],
      );

      const payrollInfo = pRows[0];
      if (!payrollInfo) {
        missingPayrollInfo++;
        continue;
      }

      const quincena = Number(payrollInfo.basic_rate || 0);
      const monthlyBase = quincena * 2;

      /* ---------- GOV DEDUCTIONS ---------- */
      if (!isSecondCutoff) {
        const sss = computeSSSPremium(monthlyBase);
        const ph = computePhilHealthPremium(monthlyBase);

        await insertDeductionRow(client, {
          payrollFileId: payrollId,
          employeeId: emp.id,
          deductionType: "SSS_PREMIUM",
          amount: sss,
          sourceType: "GOV",
          cutoff: cutoffLabel,
        });

        await insertDeductionRow(client, {
          payrollFileId: payrollId,
          employeeId: emp.id,
          deductionType: "PHILHEALTH_PREMIUM",
          amount: ph,
          sourceType: "GOV",
          cutoff: cutoffLabel,
        });

        if (sss > 0 || ph > 0) appliedGovCount++;
      } else {
        const pi = computePagIbigPremium(monthlyBase);

        await insertDeductionRow(client, {
          payrollFileId: payrollId,
          employeeId: emp.id,
          deductionType: "PAGIBIG_CONTRIBUTION",
          amount: pi,
          sourceType: "GOV",
          cutoff: cutoffLabel,
        });

        if (pi > 0) appliedGovCount++;
      }

      /* ---------- LOANS ---------- */
      const { rows: loanRows } = await client.query(
        `
        SELECT id, loan_type, cutoff_behavior
        FROM employee_loans
        WHERE employee_id = $1
          AND is_active = true
        `,
        [emp.id],
      );

      for (const loan of loanRows) {
        const lt = loan.loan_type;

        const shouldApply =
          ((lt === "SSS_LOAN" || lt === "PHILHEALTH_LOAN") &&
            !isSecondCutoff) ||
          (lt === "PAGIBIG_LOAN" && isSecondCutoff) ||
          (lt === "COMPANY_LOAN" &&
            ((loan.cutoff_behavior === "FIRST_CUTOFF_ONLY" &&
              !isSecondCutoff) ||
              (loan.cutoff_behavior === "SECOND_CUTOFF_ONLY" &&
                isSecondCutoff)));

        if (!shouldApply) continue;

        const applied = await applyLoanDeduction({
          loanId: loan.id,
          employeeId: emp.id,
          actorId,
        });

        await insertDeductionRow(client, {
          payrollFileId: payrollId,
          employeeId: emp.id,
          deductionType: lt,
          amount: applied.deducted_amount,
          sourceType: "LOAN",
          cutoff: cutoffLabel,
        });

        if (applied.deducted_amount > 0) appliedLoanCount++;
      }
    }

    /* ======================================================
       4️⃣ FINALIZE PAYROLL FILE
    ====================================================== */
    await client.query(
      `
      UPDATE payroll_files
      SET status = 'done', updated_at = NOW()
      WHERE id = $1
      `,
      [payrollId],
    );

    /* ======================================================
       5️⃣ TRANSACTION HISTORY SNAPSHOT
    ====================================================== */
    const { rows: totals } = await client.query(
      `
      SELECT
        COALESCE(SUM(ep.basic_rate), 0) * 2 AS total_earnings,
        COALESCE(SUM(d.amount), 0)         AS total_deductions
      FROM employee_payroll ep
      LEFT JOIN employee_payroll_deductions d
        ON d.employee_id = ep.employee_id
       AND d.payroll_file_id = $1
      `,
      [payrollId],
    );

    const { rows: codeRows } = await client.query(`
  WITH next_counter AS (
    INSERT INTO payroll_transaction_counters (txn_date, last_number)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (txn_date)
    DO UPDATE SET last_number = payroll_transaction_counters.last_number + 1
    RETURNING txn_date, last_number
  )
  SELECT
    'TXN-' ||
    TO_CHAR(txn_date, 'YYYYMMDD') ||
    '-' ||
    LPAD(last_number::TEXT, 4, '0') AS transaction_code
  FROM next_counter
`);

    const transactionCode = codeRows[0].transaction_code;

    const totalEarnings = Number(totals[0].total_earnings);
    const totalDeductions = Number(totals[0].total_deductions);
    const totalNetPay = totalEarnings - totalDeductions;

    await client.query(
      `
  INSERT INTO payroll_transactions (
    payroll_file_id,
    transaction_code,
    period_start,
    period_end,
    date_generated,
    employee_count,
    total_earnings,
    total_deductions,
    total_net_pay
  )
  VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7, $8)
  `,
      [
        payrollId,
        transactionCode,
        payrollFile.period_start,
        payrollFile.period_end,
        totalEmployees,
        totalEarnings,
        totalDeductions,
        totalNetPay,
      ],
    );

    /* ======================================================
       6️⃣ AUDIT LOG
    ====================================================== */
    await transactionLog({
      actorId,
      actorRole,
      action: "EDIT",
      entity: "PAYROLL_FILE",
      entityId: payrollId,
      status: "COMPLETED",
      description: `Finalized payroll. Cutoff=${cutoffLabel}. Employees=${totalEmployees}. MissingPayrollInfo=${missingPayrollInfo}. GovApplied=${appliedGovCount}. LoanApplied=${appliedLoanCount}.`,
    });

    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Finalize payroll error:", err);
    res.status(500).json({
      success: false,
      message: "Finalize failed",
    });
  } finally {
    client.release();
  }
});

/* ======================================================
   Keep your other routes (POST /, GET /)
====================================================== */
router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const actorId = req.headers["x-user-id"];
    if (!actorId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });
    }

    const actorRole = "PAYROLL_CHECKER";
    const { paycode, period_start, period_end, last_pay } = req.body;

    if (!paycode || !period_start || !period_end) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    await client.query("BEGIN");

    const { rows } = await client.query(
      `
      INSERT INTO payroll_files (
        paycode,
        period_start,
        period_end,
        last_pay,
        status
      )
      VALUES ($1,$2,$3,$4,'pending')
      RETURNING *
      `,
      [paycode, period_start, period_end, last_pay ?? false],
    );

    const payroll = rows[0];

    await transactionLog({
      actorId,
      actorRole,
      action: "ADD",
      entity: "PAYROLL_FILE",
      entityId: payroll.id,
      status: "COMPLETED",
      description: `Created payroll file ${payroll.paycode}`,
    });

    await client.query("COMMIT");
    res.status(201).json({ success: true, data: payroll });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Create payroll error:", err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

router.get("/", async (_, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM payroll_files
      ORDER BY created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Fetch payroll files error:", err);
    res.status(500).json({ success: false });
  }
});

// ======================================================
// GET EMPLOYEE PAYROLL DEDUCTIONS (READ-ONLY)
// ======================================================
router.get(
  "/:payrollFileId/employees/:employeeId/deductions",
  async (req, res) => {
    const { payrollFileId, employeeId } = req.params;

    try {
      const result = await pool.query(
        `
        SELECT
          deduction_type,
          amount,
          cutoff,
          source
        FROM employee_payroll_deductions
        WHERE payroll_file_id = $1
          AND employee_id = $2
        ORDER BY source, deduction_type
        `,
        [payrollFileId, employeeId],
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      console.error("FETCH PAYROLL DEDUCTIONS ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to load payroll deductions",
      });
    }
  },
);

/* ======================================================
   ✅ ADDED: GET EMPLOYEE PAYROLL SNAPSHOT (MANUAL EDITS)
   - FIXED TABLE NAME: payroll_employee_snapshots
====================================================== */
router.get(
  "/:payrollFileId/employees/:employeeId/snapshot",
  async (req, res) => {
    const { payrollFileId, employeeId } = req.params;

    try {
      const { rows } = await pool.query(
        `
        SELECT
          payroll_file_id,
          employee_id,
          manual_adjustments,
          total_earnings,
          total_deductions,
          net_pay,
          edited_at
        FROM payroll_employee_snapshots
        WHERE payroll_file_id = $1
          AND employee_id = $2
        LIMIT 1
        `,
        [payrollFileId, employeeId],
      );

      if (!rows.length) {
        return res.json({ success: true, data: null });
      }

      const r = rows[0];

      // Ensure manual_adjustments is an array
      let manualAdjustments = r.manual_adjustments;
      if (!Array.isArray(manualAdjustments)) manualAdjustments = [];

      return res.json({
        success: true,
        data: {
          payrollFileId: r.payroll_file_id,
          employeeId: r.employee_id,
          manualAdjustments,
          totalEarnings: Number(r.total_earnings || 0),
          totalDeductions: Number(r.total_deductions || 0),
          netPay: Number(r.net_pay || 0),
          updatedAt: r.edited_at ?? r.created_at,
        },
      });
    } catch (err) {
      console.error("GET SNAPSHOT ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to load snapshot",
      });
    }
  },
);

// ======================================================
// SAVE / UPDATE EMPLOYEE PAYROLL SNAPSHOT (MANUAL EDITS)
// ======================================================
router.post(
  "/:payrollFileId/employees/:employeeId/snapshot",
  async (req, res) => {
    const client = await pool.connect();

    try {
      const actorId = req.headers["x-user-id"];
      if (!actorId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const { payrollFileId, employeeId } = req.params;

      // ======================================================
      // 🔒 BLOCK SAVE IF PAYROLL IS FINALIZED
      // ======================================================
      const { rows: pfRows } = await client.query(
        `SELECT status FROM payroll_files WHERE id = $1`,
        [payrollFileId],
      );

      if (!pfRows.length) {
        return res.status(404).json({
          success: false,
          message: "Payroll file not found",
        });
      }

      if (pfRows[0].status === "done") {
        return res.status(403).json({
          success: false,
          message: "Payroll is already finalized and cannot be edited",
        });
      }

      const {
        quincenaRate,
        dailyRate,
        hourlyRate,
        govDeductions,
        loanDeductions,
        manualAdjustments,
        totalEarnings,
        totalDeductions,
        netPay,
        status,
      } = req.body;

      // ======================================================
      // 🔒 HARD GUARDS (PREVENT NULL VIOLATIONS)
      // ======================================================
      const basicRate = Number(quincenaRate);

      if (!basicRate || basicRate <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid quincena rate (basic_rate required)",
        });
      }

      await client.query("BEGIN");

      // ======================================================
      // UPSERT SNAPSHOT (COLUMN ORDER MATCHES TABLE)
      // ======================================================
      await client.query(
        `
        INSERT INTO payroll_employee_snapshots (
          payroll_file_id,
          employee_id,
          basic_rate,
          daily_rate,
          hourly_rate,
          quincena_rate,
          gov_deductions,
          loan_deductions,
          manual_adjustments,
          total_earnings,
          total_deductions,
          net_pay,
          status,
          edited_by,
          edited_at,
          created_at
        )
        VALUES (
          $1, $2,
          $3, $4, $5, $6,
          $7::jsonb, $8::jsonb, $9::jsonb,
          $10, $11, $12,
          $13, $14,
          NOW(), NOW()
        )
        ON CONFLICT (payroll_file_id, employee_id)
        DO UPDATE SET
          basic_rate         = EXCLUDED.basic_rate,
          daily_rate         = EXCLUDED.daily_rate,
          hourly_rate        = EXCLUDED.hourly_rate,
          quincena_rate      = EXCLUDED.quincena_rate,
          gov_deductions     = EXCLUDED.gov_deductions,
          loan_deductions    = EXCLUDED.loan_deductions,
          manual_adjustments = EXCLUDED.manual_adjustments,
          total_earnings     = EXCLUDED.total_earnings,
          total_deductions   = EXCLUDED.total_deductions,
          net_pay            = EXCLUDED.net_pay,
          status             = EXCLUDED.status,
          edited_by          = EXCLUDED.edited_by,
          edited_at          = NOW()
        `,
        [
          payrollFileId,
          employeeId,
          basicRate, // ✅ NOT NULL
          dailyRate ?? null,
          hourlyRate ?? null,
          quincenaRate, // ✅ NOT NULL
          JSON.stringify(govDeductions ?? []),
          JSON.stringify(loanDeductions ?? []),
          JSON.stringify(manualAdjustments ?? []),
          totalEarnings,
          totalDeductions,
          netPay,
          status,
          actorId,
        ],
      );

      // ======================================================
      // AUDIT LOG (SAFE ENUM)
      // ======================================================
      await transactionLog({
        actorId,
        actorRole: "PAYROLL_CHECKER",
        action: "EDIT",
        entity: "PAYROLL_FILE",
        entityId: employeeId,
        status: "COMPLETED",
        description: `Updated payroll snapshot for payroll=${payrollFileId}`,
      });

      await client.query("COMMIT");
      res.json({ success: true });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("SAVE SNAPSHOT ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to save snapshot",
      });
    } finally {
      client.release();
    }
  },
);

// ======================================================
// CHECK UNPROCESSED EMPLOYEES (BEFORE FINALIZE)
// ======================================================
router.get("/:payrollFileId/check-unprocessed", async (req, res) => {
  const { payrollFileId } = req.params;

  try {
    // 1️⃣ Get all employees
    const { rows: employees } = await pool.query(`
        SELECT id, full_name
        FROM employees
        ORDER BY full_name ASC
      `);

    // 2️⃣ Get employees WITH payroll snapshot for this file
    const { rows: snapshots } = await pool.query(
      `
        SELECT employee_id
        FROM payroll_employee_snapshots
        WHERE payroll_file_id = $1
        `,
      [payrollFileId],
    );

    const processedIds = new Set(snapshots.map((s) => s.employee_id));

    // 3️⃣ Find employees WITHOUT snapshot
    const unprocessed = employees.filter((e) => !processedIds.has(e.id));

    return res.json({
      success: true,
      hasUnprocessed: unprocessed.length > 0,
      count: unprocessed.length,
      employees: unprocessed, // used later for modal list
    });
  } catch (err) {
    console.error("CHECK UNPROCESSED ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to check unprocessed employees",
    });
  }
});

export default router;
