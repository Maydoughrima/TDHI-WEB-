import PrintableReport from "../UI/PrintableReport";
import { useEffect, useState } from "react";
import { getReportsDeductions } from "../../data/mockAPI/getReportsDeductions";

export default function ReportsDeductions({ filters }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deductionType, setDeductionType] = useState("");

  useEffect(() => {
    if (!filters.paycode || !deductionType) return;

    setLoading(true);
    getReportsDeductions({ paycode: filters.paycode, deductionType })
      .then(setRows)
      .finally(() => setLoading(false));
  }, [filters.paycode, deductionType]);

  const money = (v) =>
    typeof v === "number" ? v.toFixed(2) : "0.00";

  const total = rows.reduce((s, r) => s + (r.amount || 0), 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-between items-center">
        <select
          className="border rounded-lg p-2 text-sm"
          value={deductionType}
          onChange={(e) => setDeductionType(e.target.value)}
        >
          <option value="">Select Deduction</option>
          <option value="SSS - Premium">SSS - Premium</option>
          <option value="PhilHealth">PhilHealth</option>
          <option value="HDMF - Premium">HDMF - Premium</option>
        </select>

        <button
          onClick={() => window.print()}
          className="bg-secondary text-white px-4 py-2 rounded-md text-sm"
        >
          Print Report
        </button>
      </div>

      <PrintableReport
        title="DEDUCTIONS REPORT"
        subtitle={`Paycode: ${filters.paycode} | ${deductionType}`}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Employee No.</th>
              <th className="text-left py-2">Employee Name</th>
              <th className="text-left py-2">Department</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  No records
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2">#{r.employeeNo}</td>
                  <td className="py-2">{r.employeeName}</td>
                  <td className="py-2">{r.department}</td>
                  <td className="py-2 text-right">
                    ₱{money(r.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t font-semibold">
                <td colSpan={3} className="py-2 text-right">
                  TOTAL
                </td>
                <td className="py-2 text-right">
                  ₱{money(total)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </PrintableReport>
    </div>
  );
}
