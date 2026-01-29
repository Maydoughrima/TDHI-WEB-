import { useEffect, useState } from "react";

/**
 * Payroll-style date range formatter
 */
const formatPayrollRange = (start, end) => {
  if (!start || !end) return "";

  const s = new Date(start);
  const e = new Date(end);

  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  if (sameMonth) {
    return `${s.toLocaleString("en-US", { month: "short" })} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`;
  }

  if (sameYear) {
    return `${s.toLocaleString("en-US", { month: "short" })} ${s.getDate()}–${e.toLocaleString("en-US", { month: "short" })} ${e.getDate()}, ${s.getFullYear()}`;
  }

  return `${s.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} – ${e.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

export default function LedgerHeader({ filters, onChange }) {
  const [payrollFiles, setPayrollFiles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  /**
   * Fetch finalized payroll files (once)
   */
  useEffect(() => {
    const fetchPayrollFiles = async () => {
      setLoadingFiles(true);
      try {
        const res = await fetch("/api/ledger/payroll-files");
        const json = await res.json();

        setPayrollFiles(json.success ? json.data : []);
      } catch (err) {
        console.error("Failed to fetch payroll files:", err);
        setPayrollFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchPayrollFiles();
  }, []);

  /**
   * Fetch departments when payroll file changes
   */
  useEffect(() => {
    if (!filters.payrollFileId) {
      setDepartments([]);
      return;
    }

    const fetchDepartments = async () => {
      setLoadingDepts(true);
      try {
        const res = await fetch(
          `/api/ledger/departments?payroll_file_id=${filters.payrollFileId}`
        );
        const json = await res.json();

        setDepartments(json.success ? json.data : []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setDepartments([]);
      } finally {
        setLoadingDepts(false);
      }
    };

    // reset department when payroll file changes
    onChange((prev) => ({
      ...prev,
      departmentId: "",
    }));

    fetchDepartments();
  }, [filters.payrollFileId, onChange]);

  const update = (field, value) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md flex flex-col md:flex-row gap-4 print:hidden">
      {/* Payroll File */}
      <select
        className="border rounded-lg p-2 bg-white text-sm"
        value={filters.payrollFileId}
        onChange={(e) => update("payrollFileId", e.target.value)}
      >
        <option value="">
          {loadingFiles ? "Loading payroll files..." : "Select Payroll File"}
        </option>

        {payrollFiles.map((pf) => (
          <option key={pf.id} value={pf.id}>
            {pf.paycode} ({formatPayrollRange(pf.period_start, pf.period_end)})
          </option>
        ))}
      </select>

      {/* Department (dynamic) */}
      <select
        className="border rounded-lg p-2 bg-white text-sm"
        value={filters.departmentId}
        onChange={(e) => update("departmentId", e.target.value)}
        disabled={!filters.payrollFileId || loadingDepts}
      >
        <option value="">
          {loadingDepts ? "Loading departments..." : "Select Department"}
        </option>

        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* Type */}
      <select
        className="border rounded-lg p-2 text-sm"
        value={filters.type}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="deductions">Deductions</option>
        <option value="earnings">Earnings</option>
      </select>
    </div>
  );
}
