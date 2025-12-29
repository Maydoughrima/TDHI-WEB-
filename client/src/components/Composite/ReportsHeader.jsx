import { useEffect, useState } from "react";
import { getPaycode } from "../../data/mockAPI/getPaycode";

export default function ReportsHeader({filters, onChange}) {
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
    <div className="bg-white p-4 rounded-md shadow-md flex flex-col md:flex-row gap-4">
      {/* Paycode Dropdown */}
      <select
        className="border rounded-lg p-2 text-sm"
        value={filters.paycode}
        onChange={(e) => update("paycode", e.target.value)}
      >
        <option value="">Select Paycode</option>
        {paycodes.map((pc) => (
          <option key={pc.id} value={pc.code}>
            {pc.code} - {pc.period}
          </option>
        ))}
      </select>

      {/* DD TYPE*/}
      <select
        className="border rounded-lg p-2 text-sm"
        value={filters.type}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="deductions">Deductions</option>
        <option value="expenditures">Expenditures</option>
      </select>
    </div>
  );
}
