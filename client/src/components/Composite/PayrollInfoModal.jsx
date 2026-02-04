import React from "react";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";

export default function PayrollInfoModal({ form, handleChange }) {
  /* ================= HELPERS ================= */
  const round2 = (value) =>
    Math.round((Number(value) || 0) * 100) / 100;

  /**
   * PAYROLL FORMULA (QUINCENA-BASED)
   *
   * Basic Rate = 13 working days
   * Daily Rate = Basic Rate / 13
   * Hourly Rate = (Basic Rate / 13) / 8
   *
   * IMPORTANT:
   * - Keep basicRate as STRING while typing (to allow centavos)
   * - Convert to number ONLY for calculations
   */
  const handleBasicRateChange = (value) => {
    // ✅ keep raw input
    handleChange("basicRate", value);

    const numeric = Number(value);

    if (isNaN(numeric)) {
      handleChange("dailyRate", "");
      handleChange("hourlyRate", "");
      return;
    }

    // ✅ EXPLICIT FORMULA
    const daily = numeric / 13;
    const hourly = numeric / 13 / 8;

    // 🔒 round derived values only
    handleChange("dailyRate", round2(daily));
    handleChange("hourlyRate", round2(hourly));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-4">
        <Dropdown
          label="Employee Status"
          value={form.employeeStatus || ""}
          onChange={(e) =>
            handleChange("employeeStatus", e.target.value)
          }
          options={[
            { value: "Regular", label: "Regular" },
            { value: "Probitionary", label: "Probitionary" },
            { value: "Reliever", label: "Reliever" },
            { value: "Consultancy", label: "Consultancy" },
          ]}
        />

        <TextField
          label="Designation"
          value={form.designation || ""}
          onChange={(e) =>
            handleChange("designation", e.target.value)
          }
        />

        {/* 🔑 SOURCE OF TRUTH */}
        <TextField
          label="Basic Rate (Quincena – 15 days)"
          type="number"
          step="0.01"
          value={form.basicRate || ""}
          onChange={(e) =>
            handleBasicRateChange(e.target.value)
          }
        />

        {/* 🔒 AUTO-COMPUTED */}
        <TextField
          label="Daily Rate"
          value={form.dailyRate || ""}
          disabled
        />

        <TextField
          label="Hourly Rate"
          value={form.hourlyRate || ""}
          disabled
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-4">
        <TextField
          label="Leave Credits"
          value={form.leaveCredits || ""}
          onChange={(e) =>
            handleChange("leaveCredits", e.target.value)
          }
        />

        <TextField
          label="SSS No."
          value={form.sssNo || ""}
          onChange={(e) =>
            handleChange("sssNo", e.target.value)
          }
        />

        <TextField
          label="HDMF No."
          value={form.hdmfNo || ""}
          onChange={(e) =>
            handleChange("hdmfNo", e.target.value)
          }
        />

        <TextField
          label="TIN No."
          value={form.tinNo || ""}
          onChange={(e) =>
            handleChange("tinNo", e.target.value)
          }
        />
      </div>
    </div>
  );
}
