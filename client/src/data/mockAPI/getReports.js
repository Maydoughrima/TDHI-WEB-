

/**
 * REPORTS HANDLER (MOCK BACKEND)
 * -----------------------------
 * Filters reports data by:
 * - paycode
 * - type (deductions | expenditures)
 *
 * Later this becomes:
 * GET /api/reports?paycode=&type=
 */
import { reportsData } from "./reportsData";

export function getReports({ paycode, type }) {
  console.log("📦 RAW reportsData:", reportsData);
  console.log("🎯 FILTER:", paycode, type);

  const rows = reportsData.filter(
    (r) => r.paycode === paycode && r.type === type
  );

  console.log("📊 FILTERED ROWS:", rows);

  return Promise.resolve(rows);
}

  /*
  REAL BACKEND (later)
  return fetch(
    `/api/reports?paycode=${paycode}&type=${type}`
  ).then(res => res.json());
  */

