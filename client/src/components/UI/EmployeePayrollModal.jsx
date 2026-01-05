import { useEffect, useState } from "react";
import Button from "./Button";
import { employeePayrollData } from "../../data/employeePayrollData";

export default function EmployeePayrollModal({
  isOpen,
  onClose,
  employee,
  payroll,
}) {
  const isReadOnly = payroll?.status === "done";
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);

  /* ================= COMPUTATIONS ================= */
  const computeTotals = (employee, rows = []) => {
    const base = employee.basicRate || 0;
    let earnings = 0;
    let deductions = 0;

    rows.forEach((r) => {
      const amount = Number(r.amount || 0);
      if (r.codeType === "BENEF/AL") earnings += amount;
      if (r.codeType === "DEDUC") deductions += amount;
    });

    return {
      totalEarnings: base + earnings,
      totalDeductions: deductions,
      netPay: base + earnings - deductions,
    };
  };

  /* ================= LOAD SNAPSHOT ================= */
  useEffect(() => {
    if (!employee || !payroll) return;

    const snapshot = employeePayrollData.find(
      (p) => p.paycode === payroll.payCode && p.employeeId === employee.id
    );

    const rows = employee.allowances || [];
    const totals = computeTotals(employee, rows);

    const data = snapshot || {
      employeeId: employee.id,
      paycode: payroll.payCode,
      status: employee.employeeStatus,
      monthlyRate: employee.basicRate,
      dailyRate: employee.dailyRate,
      hourlyRate: employee.hourlyRate,
      quincenaRate: employee.basicRate / 2,
      allowances: rows,
      ...totals,
    };

    setForm(data);
    setOriginalForm(data);
    setIsEditing(false);
  }, [employee, payroll]);

  /* ================= HANDLERS ================= */
  const handleEdit = () => !isReadOnly && setIsEditing(true);

  const handleCancel = () => {
    setForm(originalForm);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!isEditing || isReadOnly) return;
    console.log("SAVE PAYROLL SNAPSHOT", form);
    setOriginalForm(form);
    setIsEditing(false);
  };

  const handleAddAllowance = () => {
    const updated = [
      ...form.allowances,
      {
        codeType: "BENEF/AL",
        description: "",
        unit: "",
        amount: 0,
        lastPay: "N",
      },
    ];

    const totals = computeTotals(employee, updated);
    setForm({ ...form, allowances: updated, ...totals });
  };

  const updateAllowance = (index, field, value) => {
    const updated = [...form.allowances];
    updated[index] = { ...updated[index], [field]: value };
    const totals = computeTotals(employee, updated);
    setForm({ ...form, allowances: updated, ...totals });
  };

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      {/* 🔑 MOBILE FIX IS HERE */}
      <div className="bg-white rounded-md shadow-lg w-full max-w-5xl flex flex-col max-h-[90vh] overflow-y-auto ">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <h2 className="font-semibold text-lg text-secondary">
            EMPLOYEE PAYROLL INFORMATION
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ================= EMPLOYEE INFO ================= */}
        <div className="flex items-center gap-4 px-6 py-3 border-b">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
            {employee.name.split(" ").map((n) => n[0]).slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold">{employee.name}</h3>
            <p className="text-gray-500">{employee.department}</p>
          </div>
        </div>

        {/* ================= RATE STRIP ================= */}
        <div className="px-6 py-3 border-b">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Info label="Status" value={employee.employeeStatus} />
            <Info label="Monthly" value={employee.basicRate} />
            <Info label="Daily Rate" value={employee.dailyRate} />
            <Info label="Quincena" value={employee.basicRate / 2} />
            <Info label="Hourly Rate" value={employee.hourlyRate} />
          </div>
        </div>

        {/* ================= MAIN ================= */}
        <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ===== BENEFITS / ALLOWANCES ===== */}
          <div className="border rounded-md">
            <div className="bg-secondary text-bg px-4 py-2 flex justify-between items-center text-sm font-semibold">
              Benefits / Allowances
              {isEditing && (
                <button
                  onClick={handleAddAllowance}
                  className="bg-white text-secondary px-3 py-1 rounded text-xs"
                >
                  + Add
                </button>
              )}
            </div>

            {/* HEADER */}
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[35%]" />
                <col className="w-[15%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Code</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Unit</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2 text-center">Last Pay</th>
                </tr>
              </thead>
            </table>

            {/* BODY (always scrollable, 5 rows height) */}
            <div className="h-[180px] overflow-y-auto">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[15%]" />
                  <col className="w-[35%]" />
                  <col className="w-[15%]" />
                  <col className="w-[20%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <tbody>
                  {form.allowances.map((a, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <select
                            value={a.codeType}
                            onChange={(e) =>
                              updateAllowance(i, "codeType", e.target.value)
                            }
                            className="w-full border px-2 py-1"
                          >
                            <option value="BENEF/AL">BENEF/AL</option>
                            <option value="DEDUC">DEDUC</option>
                          </select>
                        ) : (
                          a.codeType
                        )}
                      </td>

                      <td className="px-3 py-2">
                        {isEditing ? (
                          <input
                            value={a.description}
                            onChange={(e) =>
                              updateAllowance(i, "description", e.target.value)
                            }
                            className="w-full border px-2 py-1"
                          />
                        ) : (
                          a.description
                        )}
                      </td>

                      <td className="px-3 py-2">
                        {isEditing ? (
                          <input
                            value={a.unit}
                            onChange={(e) =>
                              updateAllowance(i, "unit", e.target.value)
                            }
                            className="w-full border px-2 py-1"
                          />
                        ) : (
                          a.unit
                        )}
                      </td>

                      <td className="px-3 py-2 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={a.amount}
                            onChange={(e) =>
                              updateAllowance(
                                i,
                                "amount",
                                Number(e.target.value)
                              )
                            }
                            className="w-full border px-2 py-1 text-right"
                          />
                        ) : (
                          a.amount
                        )}
                      </td>

                      <td className="px-3 py-2 text-center">
                        {isEditing ? (
                          <select
                            value={a.lastPay}
                            onChange={(e) =>
                              updateAllowance(i, "lastPay", e.target.value)
                            }
                            className="border px-2 py-1"
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        ) : (
                          a.lastPay
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== PAYROLL INFO ===== */}
          <div className="border rounded-md">
            <div className="bg-secondary text-bg px-4 py-2 text-sm font-semibold">
              Payroll Info
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 text-sm">
              <Info label="Month End" value={payroll.monthEnd} />
              <Info label="Payroll Code" value={payroll.payCode} />
              <Info label="Starting Date" value={payroll.periodStart} />
              <Info label="Ending Date" value={payroll.periodEnd} />
              <Info label="No. of Days" value={payroll.numOfDays} />
              <Info label="Last Pay" value={payroll.lastPay} />
            </div>
          </div>
        </div>

        {/* ================= PAYROLL SUMMARY ================= */}
        <div className="px-6 py-3">
          <div className="border rounded-md">
            <div className="bg-secondary text-bg px-4 py-2 text-center font-semibold">
              Payroll Summary
            </div>
            <div className="p-4 flex flex-col md:flex-row justify-center gap-6 text-sm">
              <Info label="Total Earnings" value={form.totalEarnings} />
              <Info label="Total Deductions" value={form.totalDeductions} />
              <Info label="Net Pay" value={form.netPay} />
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} className="bg-secondary text-bg">
                Edit
              </Button>
              <Button disabled className="bg-gray-300 text-gray-500">
                Save
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancel} className="bg-gray-100">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-secondary text-bg">
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= INFO ================= */
function Info({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-primary">{label}:</span>
      <span className="px-3 py-1 bg-gray-200 rounded">
        {value ?? "-"}
      </span>
    </div>
  );
}
