import { useEffect, useState } from "react";
import { getLedger } from "../../data/mockAPI/getLedger";

const earningsColumns = [
  { label: "Employee No.", key: "employeeNo", align: "left" },
  { label: "Employee Name", key: "employeeName", align: "left", avatar: true },
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

  const money = (v) =>
    typeof v === "number" ? v.toFixed(2) : "0.00";

  useEffect(() => {
    if (!filters.departmentId || !filters.paycode) return;

    setLoading(true);
    getLedger({ ...filters, type: "earnings" })
      .then(setRows)
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
              <td colSpan={earningsColumns.length} className="px-4 py-4 text-center text-gray-500">
                Loading earnings...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={earningsColumns.length} className="px-4 py-4 text-center text-gray-500">
                No earnings records found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {earningsColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm ${
                      col.align === "left" ? "text-left" : "text-right"
                    } ${col.bold ? "font-semibold" : ""}`}
                  >
                    {col.avatar ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={row.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        {row[col.key]}
                      </div>
                    ) : col.align === "left" ? (
                      row[col.key]
                    ) : (
                      money(row[col.key])
                    )}
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
