import React from "react";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";

export default function PayrollInfoModal({ form, handleChange }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-4">
        <Dropdown
          label="Employee Status"
          value={form.employeeStatus || ""}
          onChange={(e) => handleChange("employeeStatus", e.target.value)}
          options={[
              {value: "Regular", label: "Regular"},
              {value: "Probitionary", label: "Probitionary"},
              {value: "Reliever", label: "Reliever"},
              {value: "Consultancy", label: "Consultancy"},
            ]}
        />

        <TextField
          label="Designation"
          value={form.designation || ""}
          onChange={(e) => handleChange("designation", e.target.value)}
        />

        <TextField
          label="Basic Rate"
          value={form.basicRate || ""}
          onChange={(e) => handleChange("basicRate", e.target.value)}
        />

        <TextField
          label="Daily Rate"
          value={form.dailyRate || ""}
          onChange={(e) => handleChange("dailyRate", e.target.value)}
        />

        <TextField
          label="Hourly Rate"
          value={form.hourlyRate || ""}
          onChange={(e) => handleChange("hourlyRate", e.target.value)}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-4">
        <TextField
          label="Leave Credits"
          value={form.leaveCredits || ""}
          onChange={(e) => handleChange("leaveCredits", e.target.value)}
        />

        <TextField
          label="SSS No."
          value={form.sssNo || ""}
          onChange={(e) => handleChange("sssNo", e.target.value)}
        />

        <TextField
          label="HDMF No."
          value={form.hdmfNo || ""}
          onChange={(e) => handleChange("hdmfNo", e.target.value)}
        />

        <TextField
          label="TIN No."
          value={form.tinNo || ""}
          onChange={(e) => handleChange("tinNo", e.target.value)}
        />
      </div>
    </div>
  );
}
