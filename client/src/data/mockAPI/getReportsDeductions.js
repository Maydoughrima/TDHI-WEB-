import { reportsDeductionsData } from "./reportsDeductionData";

export function getReportsDeductions({ paycode, deductionType }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = reportsDeductionsData;

      if (paycode) {
        rows = rows.filter((r) => r.paycode === paycode);
      }

      if (deductionType) {
        rows = rows.filter((r) => r.deductionType === deductionType);
      }

      resolve(rows);
    }, 400);
  });

  /*
  REAL BACKEND (later)
  GET /api/reports/deductions?paycode=0607&deductionType=SSS-Premium
  */
}
