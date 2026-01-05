import { useEffect, useState } from "react";
import { LuClock } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { payrolls as mockPayrolls } from "../../data/payroll";

/**
 * COLUMN CONFIG
 * Status is DISPLAY-ONLY (icons)
 */
const payrollColumns = [
  { label: "Paycode", key: "payCode", align: "left" },
  { label: "Date Generated", key: "dateGenerated", align: "left" },
  { label: "Month End", key: "monthEnd", align: "left" },
  { label: "Period Start", key: "periodStart", align: "left" },
  { label: "Period End", key: "periodEnd", align: "left" },
  { label: "No. of Days", key: "numOfDays", align: "left" },
  { label: "Last Pay", key: "lastPay", align: "left" },
  { label: "Status", key: "status", align: "center" },
];

export default function PayrollTable({ onOpenPayroll }) {
  const [rows, setRows] = useState([]);

  // Mock fetch → backend API later
  useEffect(() => {
    setRows(mockPayrolls);
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        {/* TABLE HEADER */}
        <thead className="bg-gray-50">
          <tr>
            {payrollColumns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2 text-sm font-semibold text-gray-700 ${
                  col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody className="divide-y divide-gray-200">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={payrollColumns.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                No payrolls found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.payCode}
                onClick={() => onOpenPayroll(row)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {payrollColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm text-fontc ${
                      col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {/* STATUS ICON */}
                    {col.key === "status" ? (
                      <div className="flex justify-center items-center">
                        {row.status === "done" ? (
                          <FaCheckCircle
                            className="text-green-600 text-lg"
                            title="Done"
                          />
                        ) : (
                          <LuClock
                            className="text-orange-500 text-lg"
                            title="Ongoing"
                          />
                        )}
                      </div>
                    ) : (
                      row[col.key] ?? "-"
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
