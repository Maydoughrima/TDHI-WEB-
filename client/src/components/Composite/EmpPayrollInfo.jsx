import React, { useState, useEffect } from "react";
import TextField from "../UI/Textfield";
import EmpDeductions from "../UI/empDeductions";
import Dropdown from "../UI/Dropdown";

// import mock data helper
import { getEmployeeById } from "../../data/employeeprofile";

export default function EmpPayrollInfo({ isEditing, selectedEmployeeId }) {
  const [form, setForm] = useState({
    employeeStatus: "",
    designation: "",
    basicRate: "",
    dailyRate: "",
    hourlyRate: "",
    leaveCredits: "",
    sssNo: "",
    hdmfNo: "",
    tinNo: "",
  });

  // 🔥 load payroll info when employee changes
  useEffect(() => {
    if (!selectedEmployeeId) return;

    const emp = getEmployeeById(selectedEmployeeId);
    if (!emp) return;

    setForm({
      employeeStatus: emp.employeeStatus || "",
      designation: emp.designation || "",
      basicRate: emp.basicRate || "",
      dailyRate: emp.dailyRate || "",
      hourlyRate: emp.hourlyRate || "",
      leaveCredits: emp.leaveCredits || "",
      sssNo: emp.sssNo || "",
      hdmfNo: emp.hdmfNo || "",
      tinNo: emp.tinNo || "",
    });
  }, [selectedEmployeeId]);

  function handleChange(field, value) {
    if (!isEditing) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="bg-bg w-full flex flex-col rounded-md p-4">
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg font-heading text-center">Payroll Information</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <Dropdown 
            label="Employee Status" 
            value={form.employeeStatus}
            disabled={!isEditing}
            onChange={(e) => handleChange("employeeStatus", e.target.value)}
            options={[
              {value: "Regular", label: "Regular"},
              {value: "Probitionary", label: "Probitionary"},
              {value: "Reliever", label: "Reliever"},
              {value: "Consultancy", label: "Consultancy"},
            ]}
          />

          <TextField label="Designation" value={form.designation}
            disabled={!isEditing}
            onChange={(e) => handleChange("designation", e.target.value)}
          />

          <TextField label="Basic Rate" value={form.basicRate}
            disabled={!isEditing}
            onChange={(e) => handleChange("basicRate", e.target.value)}
          />

          <TextField label="Daily Rate" value={form.dailyRate}
            disabled={!isEditing}
            onChange={(e) => handleChange("dailyRate", e.target.value)}
          />

          <TextField label="Hourly Rate" value={form.hourlyRate}
            disabled={!isEditing}
            onChange={(e) => handleChange("hourlyRate", e.target.value)}
          />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <TextField label="Leave Credits" value={form.leaveCredits}
            disabled={!isEditing}
            onChange={(e) => handleChange("leaveCredits", e.target.value)}
          />

          <TextField label="SSS No." value={form.sssNo}
            disabled={!isEditing}
            onChange={(e) => handleChange("sssNo", e.target.value)}
          />

          <TextField label="HDMF No." value={form.hdmfNo}
            disabled={!isEditing}
            onChange={(e) => handleChange("hdmfNo", e.target.value)}
          />

          <TextField label="TIN No." value={form.tinNo}
            disabled={!isEditing}
            onChange={(e) => handleChange("tinNo", e.target.value)}
          />
        </div>

        {/* DEDUCTIONS */}
        <EmpDeductions 
        employeeId={selectedEmployeeId}
        />
      </div>
    </div>
  );
}
