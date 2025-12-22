import React from "react";

export default function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  disabled = false,
}) {
  return (
    <div className={`flex items-center gap-4 min-w-0 ${className}`}>
        {label && (
        <label className="w-[90px] text-sm font-medium text-gray-700">{label}</label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none m-w-[200px]"
      />
    </div>
  );
}
