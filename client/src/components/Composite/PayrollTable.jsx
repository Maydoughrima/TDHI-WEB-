import { LuClock } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";

/* =====================================================
   DATE FORMATTER (SINGLE SOURCE)
===================================================== */
const formatDate = (dateString) => {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

/* =====================================================
   COLUMN CONFIG
===================================================== */
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

export default function PayrollTable({
  data = [],
  loading,
  onOpenPayroll,
  search = "",
}) {
  /* =====================================================
     NORMALIZE BACKEND DATA → TABLE ROWS
  ===================================================== */
  const rows = data.map((p) => {
    const start = p.period_start ? new Date(p.period_start) : null;
    const end = p.period_end ? new Date(p.period_end) : null;

    const numOfDays =
      start && end
        ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
        : "-";

    return {
      id: p.id,
      payCode: p.paycode,
      dateGenerated: p.date_generated,
      monthEnd: p.last_pay ? "Yes" : "No",
      periodStart: p.period_start,
      periodEnd: p.period_end,
      numOfDays,
      lastPay: p.last_pay,
      status: p.status,
    };
  });

  /* =====================================================
     GLOBAL SEARCH (AFTER NORMALIZATION)
  ===================================================== */
  const filteredRows = rows.filter((row) => {
    if (!search) return true;

    const q = search.toLowerCase();

    return (
      row.payCode?.toLowerCase().includes(q) ||
      row.status?.toLowerCase().includes(q) ||
      formatDate(row.periodStart).toLowerCase().includes(q) ||
      formatDate(row.periodEnd).toLowerCase().includes(q) ||
      String(row.numOfDays).includes(q) ||
      row.monthEnd?.toLowerCase().includes(q)
    );
  });

  /* =====================================================
     CELL RENDERER
  ===================================================== */
  const renderCellValue = (row, col) => {
    if (
      col.key === "dateGenerated" ||
      col.key === "periodStart" ||
      col.key === "periodEnd"
    ) {
      return formatDate(row[col.key]);
    }

    if (col.key === "lastPay") {
      return row.lastPay ? "Yes" : "No";
    }

    return row[col.key] ?? "-";
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
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

        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={payrollColumns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                Loading payroll files...
              </td>
            </tr>
          ) : filteredRows.length === 0 ? (
            <tr>
              <td
                colSpan={payrollColumns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No payroll files found.
              </td>
            </tr>
          ) : (
            filteredRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onOpenPayroll(row)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {payrollColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm text-fontc ${
                      col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.key === "status" ? (
                      <div className="flex justify-center items-center">
                        {row.status === "done" ? (
                          <FaCheckCircle className="text-green-600 text-lg" />
                        ) : (
                          <LuClock className="text-orange-500 text-lg" />
                        )}
                      </div>
                    ) : (
                      renderCellValue(row, col)
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
