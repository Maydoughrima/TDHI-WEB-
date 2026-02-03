import { useEffect, useState } from "react";

export default function ReportsHeader({ filters, onChange }) {
  const [payrollFiles, setPayrollFiles] = useState([]);
  const [deductions, setDeductions] = useState([]);

  /* ================= FETCH PAYROLL FILES ================= */
  useEffect(() => {
    fetch("/api/ledger/payroll-files")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setPayrollFiles(j.data);
      })
      .catch(() => {});
  }, []);

  /* ================= FETCH DEDUCTION TYPES ================= */
  useEffect(() => {
    if (!filters.payrollFileId || filters.type !== "deductions") {
      setDeductions([]);
      return;
    }

    fetch(
      `/api/reports/deductions/types?payroll_file_id=${filters.payrollFileId}`,
    )
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setDeductions(j.data);
      })
      .catch(() => setDeductions([]));
  }, [filters.payrollFileId, filters.type]);

  const update = (field, value) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatPeriod = (start, end) => {
    const f = (d) =>
      new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

    return `${f(start)} – ${f(end)}`;
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md flex flex-col md:flex-row gap-4 items-center">
      {/* PAYROLL FILE */}
      <select
        className="border rounded-lg p-2 text-sm min-w-[260px]"
        value={filters.payrollFileId || ""}
        onChange={(e) =>
          update("payrollFileId", e.target.value || "")
        }
      >
        <option value="">Select Paycode</option>
        {payrollFiles.map((pf) => (
          <option key={pf.id} value={pf.id}>
            {pf.paycode} ({formatPeriod(pf.period_start, pf.period_end)})
          </option>
        ))}
      </select>

      {/* TYPE */}
      <select
        className="border rounded-lg p-2 text-sm"
        value={filters.type}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="deductions">Deductions</option>
        <option value="expenditures">Expenditures</option>
      </select>

      {/* DEDUCTION TYPE (ONLY WHEN DEDUCTIONS) */}
      {filters.type === "deductions" && (
        <select
          className="border rounded-lg p-2 text-sm min-w-[220px]"
          value={filters.deductionType || ""}
          onChange={(e) =>
            update("deductionType", e.target.value || "")
          }
          disabled={!filters.payrollFileId}
        >
          <option value="">Select Deduction</option>
          {deductions.map((d) => (
            <option key={d} value={d}>
              {d.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      )}

    </div>
  );
}
