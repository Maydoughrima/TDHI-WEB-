import { pool } from "../config/db.js";

/**
 * Auto-close loan if remaining_balance <= 0
 */
export async function autoCloseLoanIfPaid({
  loanId,
  actorId,
  client = pool,
}) {
  // 1️⃣ Check remaining balance
  const loanResult = await client.query(
    `
    SELECT
      id,
      loan_type,
      remaining_balance,
      is_active
    FROM employee_loans
    WHERE id = $1
    `,
    [loanId]
  );

  if (loanResult.rowCount === 0) return;

  const loan = loanResult.rows[0];

  // 🔒 Guard
  if (!loan.is_active) return;
  if (Number(loan.remaining_balance) > 0) return;

  // 2️⃣ Deactivate loan
  await client.query(
    `
    UPDATE employee_loans
    SET
      is_active = false,
      remaining_balance = 0,
      end_date = NOW()
    WHERE id = $1
    `,
    [loanId]
  );

  // 3️⃣ Audit auto-close
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
      'AUTO_CLOSE',
      'EMPLOYEE_LOAN',
      $2,
      'COMPLETED',
      $3
    )
    `,
    [
      actorId,
      loanId,
      `Loan auto-closed (fully paid)`
    ]
  );
}
