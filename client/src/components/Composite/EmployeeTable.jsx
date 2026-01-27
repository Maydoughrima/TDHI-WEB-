import { useEffect, useState } from "react";
import EmployeePayrollModal from "../UI/EmployeePayrollModal";
import WarningModal from "../UI/WarningModal";

/**
 * COLUMN CONFIG
 */
const employeeColumns = [
  { label: "Employee No.", key: "employeeNo" },
  { label: "Employee Name", key: "name" },
  { label: "Department", key: "department" },
  { label: "Employee Status", key: "employeeStatus" },
  { label: "Payroll Status", key: "payroll_status" },
];

export default function EmployeeTable({
  payroll,
  onExitPayroll,
  onRefreshPayrolls,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [showFinalizeWarning, setShowFinalizeWarning] = useState(false);
  const [unprocessedEmployees, setUnprocessedEmployees] = useState([]);

  /* =====================================================
     FETCH EMPLOYEES
     ===================================================== */
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/employees/all");
      const json = await res.json();

      if (json.success) {
        setRows(
          json.data.map((e) => ({
            id: e.id,
            employeeNo: e.employee_no,
            name: e.full_name,
            department: e.department,
            employeeStatus: e.employment_status ?? "-",
            payroll_status: "-",
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FORCE FINALIZE (NO CHECKS)
     ===================================================== */
  const finalizePayrollForce = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return alert("Unauthenticated");

    try {
      setFinalizing(true);

      const res = await fetch(
        `http://localhost:5000/api/payroll-files/${payroll.id}/finalize`,
        {
          method: "PATCH",
          headers: {
            "x-user-id": user.id,
            "x-force-finalize": "true", // 🔥 important
          },
        },
      );

      const json = await res.json();
      if (!json.success) {
        alert(json.message || "Failed to finalize payroll");
        return;
      }

      onRefreshPayrolls();
      onExitPayroll();
    } catch (err) {
      console.error(err);
      alert("Server error while finalizing payroll");
    } finally {
      setFinalizing(false);
    }
  };

  /* =====================================================
     CHECK BEFORE FINALIZE
     ===================================================== */
  const handleFinalizePayroll = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      alert("Unauthenticated");
      return;
    }

    try {
      setFinalizing(true);

      // 1️⃣ CHECK UNPROCESSED EMPLOYEES
      const res = await fetch(
        `http://localhost:5000/api/payroll-files/${payroll.id}/check-unprocessed`,
        {
          headers: { "x-user-id": user.id },
        },
      );

      const json = await res.json();

      if (!json.success) {
        alert(json.message || "Failed to validate payroll");
        return;
      }

      // 2️⃣ IF THERE ARE UNPROCESSED → SHOW WARNING MODAL
      if (json.hasUnprocessed) {
        setUnprocessedEmployees(json.employees || []);
        setShowFinalizeWarning(true);
        return;
      }

      // 3️⃣ NO ISSUES → FINALIZE DIRECTLY
      await finalizePayrollForce();
    } catch (err) {
      console.error(err);
      alert("Server error while checking payroll");
    } finally {
      setFinalizing(false);
    }
  };

  /* =====================================================
     RENDER
     ===================================================== */
  return (
    <>
      {/* ===== FINALIZE BUTTON ===== */}
      {payroll.status === "pending" && (
        <div className="flex justify-end mb-3">
          <button
            onClick={handleFinalizePayroll}
            disabled={finalizing}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {finalizing ? "Finalizing..." : "Finalize Payroll"}
          </button>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        <table className="min-w-full table-fixed border-collapse">
          {/* HEADER */}
          <thead className="bg-gray-50">
            <tr>
              {employeeColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-sm font-semibold text-gray-700 text-left align-middle whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={employeeColumns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Loading employees...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={employeeColumns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    setSelectedEmployee(row);
                    setOpen(true);
                  }}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  {employeeColumns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-fontc text-left align-middle whitespace-nowrap"
                    >
                      {row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS ================= */}
      {open && selectedEmployee && (
        <EmployeePayrollModal
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          payroll={payroll}
        />
      )}

      <WarningModal
        isOpen={showFinalizeWarning}
        title="Finalize Payroll"
        message={
          <>
            <p className="mb-2 font-semibold">
              The following {unprocessedEmployees.length} employee(s) are not
              yet processed:
            </p>

            <ul className="mb-3 list-disc list-inside text-sm text-gray-700">
              {unprocessedEmployees.map((e) => (
                <li key={e.id}>{e.full_name}</li>
              ))}
            </ul>

            <p className="text-sm text-red-600 font-semibold">
              Do you still want to finalize this payroll? This action cannot be
              undone.
            </p>
          </>
        }
        confirmText="Finalize"
        onCancel={() => setShowFinalizeWarning(false)}
        onConfirm={async () => {
          setShowFinalizeWarning(false);
          await finalizePayrollForce();
        }}
      />
    </>
  );
}
