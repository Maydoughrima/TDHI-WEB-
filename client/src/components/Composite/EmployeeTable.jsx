import { useEffect, useState } from "react";
import EmployeePayrollModal from "../UI/EmployeePayrollModal";
import PayslipModal from "../Composite/PayslipModal";
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
  { label: "Action", key: "__action" },
];

export default function EmployeeTable({
  payroll,
  onExitPayroll,
  onRefreshPayrolls,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Edit Payroll
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openPayrollModal, setOpenPayrollModal] = useState(false);

  // 🔹 View Payslip
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [openPayslipModal, setOpenPayslipModal] = useState(false);

  // 🔹 Finalize
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
            payroll_status: payroll.status,
          }))
        );
      }
    } catch (err) {
      console.error("Fetch employees error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     VIEW PAYSLIP (CORRECT SOURCE)
  ===================================================== */
  const handleViewPayslip = async (employeeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/payroll-files/${payroll.id}/payslips`
      );
      const json = await res.json();

      if (!json.success) {
        alert("Failed to load payslips");
        return;
      }

      const payslip = json.data.find(
        (p) => p.employee_id === employeeId
      );

      if (!payslip) {
        alert("Payslip not found for this employee");
        return;
      }

      setSelectedPayslip(payslip);
      setOpenPayslipModal(true);
    } catch (err) {
      console.error("View payslip error:", err);
      alert("Server error loading payslip");
    }
  };

  /* =====================================================
     FINALIZE PAYROLL
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
            "x-force-finalize": "true",
          },
        }
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
      alert("Finalize error");
    } finally {
      setFinalizing(false);
    }
  };

  const handleFinalizePayroll = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return alert("Unauthenticated");

    try {
      setFinalizing(true);

      const res = await fetch(
        `http://localhost:5000/api/payroll-files/${payroll.id}/check-unprocessed`,
        { headers: { "x-user-id": user.id } }
      );

      const json = await res.json();
      if (!json.success) {
        alert(json.message);
        return;
      }

      if (json.hasUnprocessed) {
        setUnprocessedEmployees(json.employees || []);
        setShowFinalizeWarning(true);
        return;
      }

      await finalizePayrollForce();
    } catch (err) {
      console.error(err);
      alert("Validation error");
    } finally {
      setFinalizing(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <>
      {/* FINALIZE BUTTON */}
      {payroll.status === "pending" && (
        <div className="flex justify-end mb-3">
          <button
            onClick={handleFinalizePayroll}
            disabled={finalizing}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold"
          >
            {finalizing ? "Finalizing..." : "Finalize Payroll"}
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {employeeColumns.map((c) => (
                <th
                  key={c.key}
                  className="px-4 py-3 text-sm font-semibold text-left"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={employeeColumns.length} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{row.employeeNo}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.department}</td>
                  <td className="px-4 py-3">{row.employeeStatus}</td>
                  <td className="px-4 py-3">{row.payroll_status}</td>

                  {/* ACTION */}
                  <td className="px-4 py-3 flex gap-2">
                    {payroll.status === "pending" && (
                      <button
                        className="text-blue-600 text-sm"
                        onClick={() => {
                          setSelectedEmployee(row);
                          setOpenPayrollModal(true);
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {payroll.status === "done" && (
                      <button
                        className="text-green-600 text-sm"
                        onClick={() => handleViewPayslip(row.id)}
                      >
                        View Payslip
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT PAYROLL MODAL */}
      {openPayrollModal && selectedEmployee && (
        <EmployeePayrollModal
          isOpen={openPayrollModal}
          employee={selectedEmployee}
          payroll={payroll}
          onClose={() => {
            setOpenPayrollModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {/* PAYSLIP MODAL */}
      {openPayslipModal && selectedPayslip && (
        <PayslipModal
          isOpen={openPayslipModal}
          payslip={selectedPayslip}
          onClose={() => {
            setOpenPayslipModal(false);
            setSelectedPayslip(null);
          }}
        />
      )}

      {/* FINALIZE WARNING */}
      <WarningModal
        isOpen={showFinalizeWarning}
        title="Finalize Payroll"
        message={
          <>
            <p className="mb-2 font-semibold">
              Unprocessed employees:
            </p>
            <ul className="list-disc list-inside text-sm">
              {unprocessedEmployees.map((e) => (
                <li key={e.id}>{e.full_name}</li>
              ))}
            </ul>
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
