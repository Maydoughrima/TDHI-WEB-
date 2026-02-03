import PrintableReport from "../UI/PrintableReport";
import { useEffect, useState } from "react";

export default function ReportsDeductions({ filters }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paycode, setPaycode] = useState(""); // ✅ ADD

  useEffect(() => {
    if (!filters.payrollFileId || !filters.deductionType) {
      setRows([]);
      setPaycode(""); // ✅ RESET
      return;
    }

    const fetchReport = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          payroll_file_id: filters.payrollFileId,
          deduction_type: filters.deductionType,
        });

        const res = await fetch(`/api/reports/deductions?${params.toString()}`);
        const json = await res.json();

        if (!json.success) {
          setRows([]);
          setPaycode("");
          return;
        }

        const list = Array.isArray(json.data) ? json.data : [];
        setRows(list);

        // ✅ paycode now comes from backend (same for every row)
        setPaycode(list[0]?.paycode || "");
      } catch (err) {
        console.error("Failed to fetch deductions report:", err);
        setRows([]);
        setPaycode("");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filters.payrollFileId, filters.deductionType]);

  const money = (v) =>
    Number(v || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const total = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <div className="flex flex-col gap-4">
      {/* ACTION BAR */}
      <div className="no-print flex justify-end">
        <button
          onClick={() => window.print()}
          className="bg-secondary text-white px-4 py-2 rounded-md text-sm"
        >
          Print Report
        </button>
      </div>

      <PrintableReport
        title="DEDUCTIONS REPORT"
        subtitle={`Paycode: ${paycode || "-"} | ${filters.deductionType || "-"}`}
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
              rows.map((r, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{r.employee_no}</td>
                  <td className="py-2">{r.employee_name}</td>
                  <td className="py-2">{r.department}</td>
                  <td className="py-2 text-right">₱{money(r.amount)}</td>
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
                <td className="py-2 text-right">₱{money(total)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </PrintableReport>
    </div>
  );
}
