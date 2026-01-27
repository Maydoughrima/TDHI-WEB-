import { pool } from "../config/db.js";

/**
 * Apply loan deduction during payroll
 *
 * @param {Object} params
 * @param {string} params.loanId
 * @param {string} params.employeeId
 * @param {string} params.actorId
 */
export async function applyLoanDeduction({
  loanId,
  employeeId,
  actorId,
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ======================================================
       1️⃣ LOCK + FETCH LOAN
    ====================================================== */
    const loanRes = await client.query(
      `
      SELECT
        loan_type,
        remaining_balance,
        monthly_amortization
      FROM employee_loans
      WHERE id = $1
        AND employee_id = $2
        AND is_active = true
      FOR UPDATE
      `,
      [loanId, employeeId]
    );

    if (loanRes.rowCount === 0) {
      throw new Error("Loan not found or inactive");
    }

    const loan = loanRes.rows[0];

    /* ======================================================
       2️⃣ COMPUTE DEDUCTION (NUMERIC-SAFE)
    ====================================================== */
    const remainingBalance = Number(loan.remaining_balance);
    const monthlyAmort = Number(loan.monthly_amortization);

    const deduction = Math.min(monthlyAmort, remainingBalance);
    const newBalance = remainingBalance - deduction;

    /* ======================================================
       3️⃣ UPDATE LOAN (EXPLICIT CASTING FIX)
    ====================================================== */
    await client.query(
      `
      UPDATE employee_loans
      SET
        remaining_balance = $1::numeric,
        is_active = $2,
        end_date = CASE
          WHEN $1::numeric = 0 THEN NOW()
          ELSE end_date
        END,
        updated_at = NOW()
      WHERE id = $3
      `,
      [
        newBalance,                     // numeric
        newBalance === 0 ? false : true,
        loanId                          // uuid
      ]
    );

    /* ======================================================
       4️⃣ AUDIT LOG
    ====================================================== */
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
        'SYSTEM',
        $2,
        'EMPLOYEE_LOAN',
        $3,
        'COMPLETED',
        $4
      )
      `,
      [
        actorId,
        newBalance === 0 ? "DELETE" : "EDIT",
        loanId,
        newBalance === 0
          ? `Auto-closed ${loan.loan_type} loan (Loan ID: ${loanId})`
          : `Applied loan deduction ₱${deduction} (Loan ID: ${loanId})`,
      ]
    );

    await client.query("COMMIT");

    return {
      deducted_amount: deduction,
      remaining_balance: newBalance,
      closed: newBalance === 0,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
