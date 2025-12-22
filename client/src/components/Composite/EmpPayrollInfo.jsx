import React, { useState } from "react";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";
import EmpImage from "../UI/EmpImage";
import EmpDeductions from "../UI/empDeductions";

export default function EmpPayrollInfo({ onClick, isEditing }) {
  const [form, setForm] = useState({
    employeeStatus: "",
    designation: "",
    basicRate: "",
    dailyRate: "",
    hourlyRate: "",
    leaveCredits: "",
    SSSNo: "",
    hdmfNo: "",
    TinNo: "",
  });

  function handleChange(field, value) {
    if (!isEditing) return; // Prevent changes if in editing mode
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="bg-bg w-full flex flex-col rounded-md p-4">
      {/* Header */}
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg font-heading text-center">
          Payroll Information
        </h2>
      </div>

      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Employee Status:"
            value={form.employeeStatus}
            onChange={(e) => handleChange("employeeStatus", e.target.value)}
            disabled={!isEditing}
          />

          <TextField
            label="Designation:"
            value={form.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
            disabled={!isEditing}
          />

          <TextField
            label="Basic Rate:"
            value={form.basicRate}
            onChange={(e) => handleChange("basicRate", e.target.value)}
            disabled={!isEditing}
          />

          <TextField
            label="Daily Rate:"
            value={form.dailyRate}
            onChange={(e) => handleChange("dailyRate", e.target.value)}
            disabled={!isEditing}
          />

          <TextField
            label="Hourly Rate:"
            value={form.hourlyRate}
            onChange={(e) => handleChange("hourlyRate", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Leave Credits:"
            value={form.leaveCredits}
            onChange={(e) => handleChange("leaveCredits", e.target.value)}
            disabled={!isEditing}
          />

          <TextField
            label="SSS No.:"
            value={form.SSSNo}
            onChange={(e) => handleChange("SSSNo", e.target.value)}
            disabled={!isEditing}
          />

          <TextField
            label="HDMF No.:"
            value={form.hdmfNo}
            onChange={(e) => handleChange("hdmfNo", e.target.value)}
            disabled={!isEditing}
          />

          <TextField
            label="Tin No.:"
            value={form.TinNo}
            onChange={(e) => handleChange("TinNo", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        {/* PHOTO COLUMN */}
          <EmpDeductions
          //employeeId={123}
          //onUploadSuccess={(url) => console.log("New image URL:", url)}
          />
      </div>
    </div>
  );
}
