import React from "react";

export default function Dropdown({
  label,
  value,
  onChange,
  options = [],
  className = "",
}) {
    return (
         <div className={`flex items-center gap-4 min-w-0 ${className}`}>
      {label && (
        <label className="w-[90px] text-sm font-medium text-gray-700">{label}</label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
      >
        <option value="">Select Status</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
    );
}
