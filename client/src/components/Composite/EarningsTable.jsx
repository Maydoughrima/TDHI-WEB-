import { useEffect, useState } from "react";
import axios from "axios";

/* ================= COLUMN CONFIG ================= */
const earningsColumns = [
  { label: "Department", key: "department", align: "left" },
  { label: "Gross Salary", key: "grossSalary", align: "right", bold: true },
];

export default function EarningsTable({ filters }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const money = (v) => {
    const n = Number(v);
    return Number.isFinite(n)
      ? n.toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!filters?.payrollFileId) return;

    setLoading(true);

    axios
      .get("/api/ledger/earnings", {
        params: {
          payroll_file_id: filters.payrollFileId,
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
    <div className="bg-white rounded-md shadow-sm p-4">
      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {earningsColumns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide ${
                    col.align === "left" ? "text-left" : "text-right"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td
                  colSpan={earningsColumns.length}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  Loading earnings…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={earningsColumns.length}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No earnings records found.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={`${row.department}-${idx}`}
                  className="hover:bg-gray-50"
                >
                  {earningsColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm ${
                        col.align === "left" ? "text-left" : "text-right"
                      } ${col.bold ? "font-semibold text-gray-800" : "text-gray-600"}`}
                    >
                      {col.align === "left"
                        ? row[col.key] ?? "-"
                        : money(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
