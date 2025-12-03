import React from "react";

export default function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
}) {
  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
      />
    </div>
  );
}
