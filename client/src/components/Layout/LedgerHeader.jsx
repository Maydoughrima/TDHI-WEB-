import { useEffect, useState } from "react";
import { departments } from "../../data/employeeprofile";
import { getPaycode } from "../../data/mockAPI/getPaycode";

export default function LedgerHeader({ filters, onChange }) {
  const [paycodes, setPaycodes] = useState([]);

  useEffect(() => {
    getPaycode().then(setPaycodes);
  }, []);

  const update = (field, value) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md flex flex-col md:flex-row gap-4 print:hidden">
      
      {/* ✅ Department */}
      <select
        className="border rounded-lg p-2 bg-white text-sm"
        value={filters.departmentId}
        onChange={(e) => update("departmentId", e.target.value)}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept.id} value={String(dept.id)}>
            {dept.name}
          </option>
        ))}
      </select>

      {/* ✅ Type */}
      <select
        className="border rounded-lg p-2 text-sm"
        value={filters.type}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="deductions">Deductions</option>
        <option value="earnings">Earnings</option>
      </select>

      {/* ✅ Paycode */}
      <select
        className="border rounded-lg p-2 text-sm"
        value={filters.paycode}
        onChange={(e) => update("paycode", e.target.value)}
      >
        <option value="">Select Paycode</option>
        {paycodes.map((pc) => (
          <option key={pc.id} value={pc.code}>
            {pc.code} — {pc.period}
          </option>
        ))}
      </select>
    </div>
  );
}
