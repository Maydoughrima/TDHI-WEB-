import { useEffect, useState } from "react";

const deductionColumns = [
  { label: "Department", key: "department", align: "left" },

  { label: "Late", key: "LATE" },
  { label: "SSS", key: "SSS" },
  { label: "PHILHEALTH", key: "PHILHEALTH" },
  { label: "HDMF_PREM", key: "HDMF_PREM" },
  { label: "HDMF_LOAN", key: "HDMF_LOAN" },
  { label: "SSS_LOAN", key: "SSS_LOAN" },
  { label: "SSS_CAL", key: "SSS_CAL" },
  { label: "Hospital Accounts", key: "HOSPITAL_ACCOUNTS" },
  { label: "CANTEEN", key: "CANTEEN" },
  { label: "HSBC", key: "HSBC" },
  { label: "COOP", key: "COOP" },
  { label: "LEAVE", key: "LEAVE" },
  { label: "OTHERS", key: "OTHERS" },

  { label: "TOTAL", key: "TOTAL", bold: true },
];

export default function DeductionsTable({ filters }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const money = (v) =>
    Number(v || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    if (!filters.payrollFileId) {
      setRows([]);
      return;
    }

    const fetchLedger = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          payroll_file_id: filters.payrollFileId,
          entry_type: "DEDUCTION",
        });

        if (filters.departmentId) {
          params.append("department", filters.departmentId);
        }

        const res = await fetch(`/api/ledger?${params.toString()}`);
        const json = await res.json();

        if (!json.success) {
          setRows([]);
          return;
        }

        // 🔑 Backend already returns correct table shape
        setRows(json.data);
      } catch (err) {
        console.error("Ledger fetch failed:", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [filters.payrollFileId, filters.departmentId]);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm max-w-full">
      <table className="min-w-[1400px] divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {deductionColumns.map((col) => (
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

        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={deductionColumns.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                Loading ledger…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={deductionColumns.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                No ledger records found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.department} className="hover:bg-gray-50">
                {deductionColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm ${
                      col.align === "left" ? "text-left" : "text-right"
                    } ${col.bold ? "font-semibold" : ""}`}
                  >
                    {col.align === "left"
                      ? row[col.key]
                      : money(row[col.key])}
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
