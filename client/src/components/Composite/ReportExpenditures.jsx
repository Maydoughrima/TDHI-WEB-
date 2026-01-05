import PrintableReport from "../UI/PrintableReport";
import { useEffect, useState } from "react";
import { getReports } from "../../data/mockAPI/getReports";

const reportExpenditures = [
  { label: "Paycode", key: "paycode", align: "left" },
  { label: "Salaries and Wages", key: "salariesandwages", align: "left" },
  { label: "Radiology Supplies", key: "radiologysupplies", align: "left" },
  { label: "Nursing Supplies", key: "nursingsupplies", align: "left" },
  { label: "Affiliation Fee", key: "affiliationfee", align: "left" },
  { label: "Food Allowance", key: "foodallowance", align: "left" },
  { label: "AP SSS", key: "ap_sss", align: "left" },
  { label: "AP PHIC", key: "ap_phic", align: "left" },
  { label: "SSS Salary Loan", key: "ap_sss_salary_loan", align: "left" },
  { label: "SSS Calamity Loan", key: "ap_sss_calam_loan", align: "left" },
  { label: "Withholding Tax", key: "witholdingtax", align: "left" },
  { label: "Hospital Account", key: "ap_hosp_acc", align: "left" },
  { label: "Canteen", key: "ap_canteen_bel", align: "left" },
  { label: "Other NSO", key: "ap_oth_nso", align: "left" },
  { label: "Accrued Expenses", key: "accuredexpenses", align: "left" },
  { label: "Cash in Bank (DBP)", key: "cash_in_bank_dbp", align: "left" },
  { label: "Total", key: "total", bold: true, align: "left" },
];

export default function ReportExpenditures({ filters }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const money = (v) =>
    typeof v === "number" ? v.toFixed(2) : "0.00";

  useEffect(() => {
    if (!filters?.paycode) return;

    setLoading(true);
    getReports({ paycode: filters.paycode, type: "expenditures" })
      .then(setRows)
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <button
          onClick={() => window.print()}
          className="bg-secondary text-white px-4 py-2 rounded-md text-sm"
        >
          Print Report
        </button>
      </div>

      <PrintableReport
        title="EXPENDITURES REPORT"
        subtitle={`Paycode: ${filters.paycode}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-[2200px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {reportExpenditures.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-2 text-sm font-semibold ${
                      col.align === "left" ? "text-left" : "text-right"
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={reportExpenditures.length} className="py-4 text-center">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={reportExpenditures.length} className="py-4 text-center">
                    No records
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    {reportExpenditures.map((col) => (
                      <td key={col.key} className="px-4 py-2">
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
      </PrintableReport>
    </div>
  );
}
