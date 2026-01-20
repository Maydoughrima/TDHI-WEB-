import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * ======================================================
 * ADD EMPLOYEE LOAN (WITH AUDIT)
 * POST /api/employees/:employeeId/loans
 * ======================================================
 */
router.post("/:employeeId/loans", async (req, res) => {
  const { employeeId } = req.params;
  const actorId = req.headers["x-user-id"]; // REQUIRED

  const {
    loan_type,
    principal_amount,
    monthly_amortization,
    cutoff_behavior,
    start_date,
  } = req.body;

  /* ================= VALIDATION ================= */

  if (!actorId) {
    return res.status(401).json({
      message: "Missing actor identity (x-user-id)",
    });
  }

  if (
    !loan_type ||
    !monthly_amortization ||
    !cutoff_behavior ||
    !start_date
  ) {
    return res.status(400).json({
      message: "Missing required loan fields",
    });
  }

  const principal = Number(principal_amount || monthly_amortization);
  const amortization = Number(monthly_amortization);

  if (isNaN(principal) || isNaN(amortization)) {
    return res.status(400).json({
      message: "Invalid loan amounts",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ================= INSERT LOAN ================= */

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
        cutoff_behavior,
        start_date,
      ]
    );

    const loanId = loanResult.rows[0].id;

    /* ================= AUDIT TRANSACTION ================= */

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

    return res.status(201).json({
      success: true,
      message: "Loan added successfully",
      loan_id: loanId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ADD LOAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add loan",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

/**
 * ======================================================
 * GET EMPLOYEE LOANS
 * GET /api/employees/:employeeId/loans
 * ======================================================
 */
router.get("/:employeeId/loans", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        loan_type,
        principal_amount,
        monthly_amortization,
        remaining_balance,
        cutoff_behavior,
        start_date,
        is_active
      FROM employee_loans
      WHERE employee_id = $1
      ORDER BY created_at ASC
      `,
      [employeeId]
    );

    return res.json({
      success: true,
      loans: result.rows,
    });
  } catch (error) {
    console.error("GET LOANS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee loans",
    });
  }
});

export default router;
