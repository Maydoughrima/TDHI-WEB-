/**
 * Determine if a loan should be deducted on this cutoff
 *
 * @param {Object} params
 * @param {"FIRST"|"SECOND"} params.payrollCutoff
 * @param {"FIRST_CUTOFF_ONLY"|"BOTH_CUTOFFS"} params.cutoffBehavior
 */
export function shouldDeductLoan({
  payrollCutoff,
  cutoffBehavior,
}) {
  if (cutoffBehavior === "BOTH_CUTOFFS") {
    return true;
  }

  if (
    cutoffBehavior === "FIRST_CUTOFF_ONLY" &&
    payrollCutoff === "FIRST"
  ) {
    return true;
  }

  return false;
}
