import { useEffect, useState } from "react";
import { getReports } from "../../data/mockAPI/getReports";

/**
 * COLUMN CONFIG
 * -------------
 * `key` MUST match reportsData exactly
 * `align` is ONLY for styling (not formatting)
 */
const reportExpenditures = [
  { label: "Paycode", key: "paycode", align: "left" },
  { label: "Salaries and Wages", key: "salariesandwages" },
  { label: "Radiology Supplies", key: "radiologysupplies" },
  { label: "Nursing Supplies", key: "nursingsupplies" },
  { label: "Affiliation Fee", key: "affiliationfee" },
  { label: "Food Allowance", key: "foodallowance" },
  { label: "AP SSS", key: "ap_sss" },
  { label: "AP PHIC", key: "ap_phic" },
  { label: "SSS Salary Loan", key: "ap_sss_salary_loan" },
  { label: "SSS Calamity Loan", key: "ap_sss_calam_loan" },
  { label: "Withholding Tax", key: "witholdingtax" },
  { label: "Hospital Account", key: "ap_hosp_acc" },
  { label: "Canteen", key: "ap_canteen_bel" },
  { label: "Other NSO", key: "ap_oth_nso" },
  { label: "Accrued Expenses", key: "accuredexpenses" },
  { label: "Cash in Bank (DBP)", key: "cash_in_bank_dbp" },
  { label: "Total", key: "total", bold: true },
];

export default function ReportExpendituresTable({ filters }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /** Safe money formatter */
  const money = (v) =>
    typeof v === "number" ? v.toFixed(2) : "0.00";

  /** Fetch reports */
  useEffect(() => {
    if (!filters || !filters.paycode) return;

    setLoading(true);

    getReports({
      paycode: filters.paycode,
      type: "expenditures",
    })
      .then((data) => {
        console.log("✅ TABLE ROWS:", data);
        setRows(data);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm max-w-full">
      <table className="min-w-[2200px] divide-y divide-gray-200">
        {/* TABLE HEADER */}
        <thead className="bg-gray-50">
          <tr>
            {reportExpenditures.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2 text-sm font-semibold text-gray-700 ${
                  col.align === "left" ? "text-left" : "text-right"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={reportExpenditures.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                Loading Expenditures...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={reportExpenditures.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                No Expenditures records found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {reportExpenditures.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm ${
                      col.align === "left" ? "text-left" : "text-right"
                    } ${col.bold ? "font-semibold" : ""}`}
                  >
                    {typeof row[col.key] === "number"
                      ? money(row[col.key])
                      : row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
          
        </tbody>
      </table>
    </div>
  );
}
