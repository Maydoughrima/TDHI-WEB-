import React, { useState, useEffect } from "react";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";
import EmpDeductions from "../UI/empDeductions";

import { fetchPayrollByEmployeeId } from "../../../../server/api/employeeAPI";

export default function EmpPayrollInfo({
  isEditing,
  selectedEmployeeId,
  onChangePayroll,
}) {
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

  /* ================= LOAD PAYROLL (🔥 FIX) ================= */
  useEffect(() => {
    if (!selectedEmployeeId) return;

    async function loadPayroll() {
      const payroll = await fetchPayrollByEmployeeId(selectedEmployeeId);

      if (!payroll) {
        setForm({
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
        return;
      }

      setForm({
        employeeStatus: payroll.employment_status ?? "",
        designation: payroll.designation ?? "",
        basicRate: payroll.basic_rate ?? "",
        dailyRate: payroll.daily_rate ?? "",
        hourlyRate: payroll.hourly_rate ?? "",
        leaveCredits: payroll.leave_credits ?? "",
        sssNo: payroll.sss_no ?? "",
        hdmfNo: payroll.hdmf_no ?? "",
        tinNo: payroll.tin_no ?? "",
      });
    }

    loadPayroll();
  }, [selectedEmployeeId]);

  /* ================= HANDLE CHANGE ================= */
  function handleChange(field, value) {
    if (!isEditing) return;

    const updated = { ...form, [field]: value };
    setForm(updated);

    // 🔥 push ONLY user edits to parent
    onChangePayroll?.(updated);
  }

  return (
    <div className="bg-bg w-full flex flex-col rounded-md p-4">
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg font-heading text-center">
          Payroll Information
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <Dropdown
            label="Employee Status"
            value={form.employeeStatus}
            disabled={!isEditing}
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
            value={form.designation}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("designation", e.target.value)
            }
          />

          <TextField
            label="Basic Rate"
            value={form.basicRate}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("basicRate", e.target.value)
            }
          />

          <TextField
            label="Daily Rate"
            value={form.dailyRate}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("dailyRate", e.target.value)
            }
          />

          <TextField
            label="Hourly Rate"
            value={form.hourlyRate}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("hourlyRate", e.target.value)
            }
          />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Leave Credits"
            value={form.leaveCredits}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("leaveCredits", e.target.value)
            }
          />

          <TextField
            label="SSS No."
            value={form.sssNo}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("sssNo", e.target.value)
            }
          />

          <TextField
            label="HDMF No."
            value={form.hdmfNo}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("hdmfNo", e.target.value)
            }
          />

          <TextField
            label="TIN No."
            value={form.tinNo}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("tinNo", e.target.value)
            }
          />
        </div>

        <EmpDeductions employeeId={selectedEmployeeId} />
      </div>
    </div>
  );
}
