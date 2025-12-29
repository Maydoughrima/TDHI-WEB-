import { ledgerData } from "./ledgerData";

export function getLedger({ departmentId, type, paycode }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = ledgerData ?? [];

      console.log("FILTER:", departmentId);
      console.log("DATA:", rows.map(r => r.departmentId));

      if (departmentId) {
        rows = rows.filter(
          (r) => r.departmentId === departmentId
        );
      }

      if (paycode) {
        rows = rows.filter(
          (r) => r.paycode === paycode
        );
      }

      resolve(rows);
    }, 500);
  });
}
