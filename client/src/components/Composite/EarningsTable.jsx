import { useEffect, useState } from "react";
import axios from "axios";

const earningsColumns = [
  { label: "Department", key: "department", align: "left" },
  { label: "Basic Pay", key: "basicPay" },
  { label: "Overtime", key: "overtime" },
  { label: "N-Prem", key: "n_prem" },
  { label: "Reg Holiday", key: "regHoliday" },
  { label: "Food Allowance", key: "foodAllowance" },
  { label: "Other Allowance", key: "otherAllowance" },
  { label: "On Call", key: "onCall" },
  { label: "Other Farn", key: "otherFarn" },
  { label: "Allowance, Adj", key: "allowance_adj" },
  { label: "Gross Salary", key: "grossSalary", bold: true },
];

export default function EarningsTable({ filters }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const money = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : "0.00";
  };

  useEffect(() => {
    console.log("🔥 EarningsTable filters:", filters);

    // ✅ only require payrollFileId
    if (!filters?.payrollFileId) return;

    setLoading(true);

    axios
      .get("/api/ledger/earnings", {
        params: {
          payroll_file_id: filters.payrollFileId, // camel → snake
          department: filters.departmentId || "ALL",
        },
      })
      .then((res) => {
        setRows(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Earnings ledger fetch error:", err);
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm max-w-full">
      <table className="min-w-[1600px] divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {earningsColumns.map((col) => (
              <th
                key={col.label}
                className={`px-4 py-2 text-sm font-semibold text-gray-700 ${
                  col.align === "left" ? "text-left" : "text-right"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={earningsColumns.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                Loading earnings...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={earningsColumns.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                No earnings records found.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={`${row.department}-${idx}`} className="hover:bg-gray-50">
                {earningsColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm ${
                      col.align === "left" ? "text-left" : "text-right"
                    } ${col.bold ? "font-semibold" : ""}`}
                  >
                    {col.align === "left" ? row[col.key] : money(row[col.key])}
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
