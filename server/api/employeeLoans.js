import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* ======================================================
   ADD EMPLOYEE LOAN (AUDITED + HR-SAFE)
====================================================== */
router.post("/:employeeId/loans", async (req, res) => {
  const { employeeId } = req.params;
  const actorId = req.headers["x-user-id"];

  const {
    loan_type,
    principal_amount,
    monthly_amortization,
    cutoff_behavior,
    start_date,
  } = req.body;

  if (!actorId) {
    return res.status(401).json({ message: "Missing actor identity" });
  }

  if (!loan_type || !monthly_amortization || !cutoff_behavior || !start_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  /* ================= HR-SAFE CUTOFF VALIDATION ================= */
  const FIRST = "FIRST_CUTOFF_ONLY";
  const SECOND = "SECOND_CUTOFF_ONLY";

  // normalize legacy value
  let normalizedCutoff = cutoff_behavior;
  if (cutoff_behavior === "BOTH_CUTOFFS") {
    normalizedCutoff = SECOND;
  }

  const cutoffRules = {
    SSS_LOAN: [FIRST],
    PHILHEALTH_LOAN: [FIRST],
    PAGIBIG_LOAN: [SECOND],
    COMPANY_LOAN: [FIRST, SECOND],
  };

  if (!cutoffRules[loan_type]) {
    return res.status(400).json({ message: "Invalid loan type" });
  }

  if (!cutoffRules[loan_type].includes(normalizedCutoff)) {
    return res.status(400).json({
      message: `Invalid cutoff for ${loan_type}. Allowed: ${cutoffRules[
        loan_type
      ].join(", ")}`,
    });
  }

  const principal = Number(principal_amount || monthly_amortization);
  const amortization = Number(monthly_amortization);

  if (isNaN(principal) || isNaN(amortization)) {
    return res.status(400).json({ message: "Invalid loan amounts" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* 1️⃣ INSERT LOAN */
    const loanResult = await client.query(
      `
      INSERT INTO employee_loans (
        employee_id,
        loan_type,
        principal_amount,
        monthly_amortization,
        remaining_balance,
        cutoff_behavior,
        start_date,
        is_active
      )
      VALUES ($1, $2, $3, $4, $3, $5, $6, true)
      RETURNING id
      `,
      [
        employeeId,
        loan_type,
        principal,
        amortization,
        normalizedCutoff,
        start_date,
      ]
    );

    const loanId = loanResult.rows[0].id;

    /* 2️⃣ AUDIT LOG */
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
      VALUES (
        $1,
        'USER',
        'ADD',
        'EMPLOYEE_LOAN',
        $2,
        'COMPLETED',
        $3
      )
      `,
      [
        actorId,
        employeeId,
        `Added ${loan_type} loan (Loan ID: ${loanId})`,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Loan added successfully",
      loan_id: loanId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ADD LOAN ERROR:", err);
    res.status(500).json({ message: "Failed to add loan" });
  } finally {
    client.release();
  }
});

/* ======================================================
   EDIT EMPLOYEE LOAN (AUDITED)
====================================================== */
router.put("/:employeeId/loans/:loanId", async (req, res) => {
  const { employeeId, loanId } = req.params;
  const actorId = req.headers["x-user-id"];

  const { monthly_amortization, cutoff_behavior, start_date } = req.body;

  if (!actorId) {
    return res.status(401).json({ message: "Missing actor identity" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateResult = await client.query(
      `
      UPDATE employee_loans
      SET
        monthly_amortization = COALESCE($1, monthly_amortization),
        cutoff_behavior = COALESCE($2, cutoff_behavior),
        start_date = COALESCE($3, start_date),
        updated_at = NOW()
      WHERE id = $4
        AND is_active = true
      RETURNING loan_type
      `,
      [monthly_amortization, cutoff_behavior, start_date, loanId]
    );

    if (updateResult.rowCount === 0) {
      throw new Error("Loan not found or inactive");
    }

    const loanType = updateResult.rows[0].loan_type;

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
      VALUES (
        $1,
        'USER',
        'EDIT',
        'EMPLOYEE_LOAN',
        $2,
        'COMPLETED',
        $3
      )
      `,
      [
        actorId,
        employeeId,
        `Edited ${loanType} loan (Loan ID: ${loanId})`,
      ]
    );

    await client.query("COMMIT");

    res.json({ message: "Loan updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("EDIT LOAN ERROR:", err);
    res.status(500).json({ message: "Failed to edit loan" });
  } finally {
    client.release();
  }
});

/* ======================================================
   DELETE (DEACTIVATE) EMPLOYEE LOAN (AUDITED)
====================================================== */
router.delete("/:employeeId/loans/:loanId", async (req, res) => {
  const { employeeId, loanId } = req.params;
  const actorId = req.headers["x-user-id"];

  if (!actorId) {
    return res.status(401).json({ message: "Missing actor identity" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const loanResult = await client.query(
      `
      UPDATE employee_loans
      SET
        is_active = false,
        remaining_balance = 0,
        end_date = NOW()
      WHERE id = $1
        AND employee_id = $2
        AND is_active = true
      RETURNING loan_type
      `,
      [loanId, employeeId]
    );

    if (loanResult.rowCount === 0) {
      throw new Error("Loan not found or already inactive");
    }

    const loanType = loanResult.rows[0].loan_type;

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
      VALUES (
        $1,
        'USER',
        'DELETE',
        'EMPLOYEE_LOAN',
        $2,
        'COMPLETED',
        $3
      )
      `,
      [
        actorId,
        employeeId,
        `Deleted ${loanType} loan (Loan ID: ${loanId})`,
      ]
    );

    await client.query("COMMIT");

    res.json({ message: "Loan deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("DELETE LOAN ERROR:", err);
    res.status(500).json({ message: "Failed to delete loan" });
  } finally {
    client.release();
  }
});

/* ======================================================
   GET ACTIVE EMPLOYEE LOANS
====================================================== */
router.get("/:employeeId/loans", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        loan_type,
        monthly_amortization,
        remaining_balance,
        cutoff_behavior,
        start_date,
        end_date
      FROM employee_loans
      WHERE employee_id = $1
        AND is_active = true
      ORDER BY start_date ASC
      `,
      [employeeId]
    );

    res.json({ loans: result.rows });
  } catch (err) {
    console.error("GET LOANS ERROR:", err);
    res.status(500).json({ message: "Failed to load loans" });
  }
});

export default router;
