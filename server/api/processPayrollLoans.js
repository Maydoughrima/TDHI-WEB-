import { shouldDeductLoan } from "./loanCutoffGuard.js";
import { applyLoanDeduction } from "./applyLoanDeduction.js";

export async function processEmployeeLoans({
  employeeId,
  loans,
  payrollCutoff, // "FIRST" | "SECOND"
  actorId,
}) {
  const results = [];

  for (const loan of loans) {
    if (!loan.is_active) continue;
    if (loan.remaining_balance <= 0) continue;

    const shouldDeduct = shouldDeductLoan({
      payrollCutoff,
      cutoffBehavior: loan.cutoff_behavior,
    });

    if (!shouldDeduct) {
      continue; // 🚫 skip silently
    }

    const result = await applyLoanDeduction({
      loanId: loan.id,
      employeeId,
      actorId,
    });

    results.push({
      loan_id: loan.id,
      ...result,
    });
  }

  return results;
}
