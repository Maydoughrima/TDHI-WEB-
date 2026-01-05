import { useEffect, useState } from "react";
import { allEmployees } from "../../data/mockAPI/allemployee";
import EmployeePayrollModal from "../UI/EmployeePayrollModal";

/**
 * COLUMN CONFIG
 * (UNCHANGED – consistent with your other tables)
 */
const employeeColumns = [
  { label: "Employee No.", key: "employeeNo", align: "left" },
  { label: "Employee Name", key: "name", align: "left" },
  { label: "Department", key: "department", align: "left" },
  { label: "Employee Status", key: "employeeStatus", align: "left" },
  { label: "Payroll Status", key: "payroll_status", align: "left" },
];

export default function EmployeeTable({ payroll }) {
  const [rows, setRows] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);

  /* =====================================================
     FETCH EMPLOYEES (MOCK → API LATER)
     ===================================================== */
  useEffect(() => {
    /**
     * BACKEND READY
     * GET /api/employees
     */
    setRows(allEmployees);
  }, []);

  /* =====================================================
     OPEN MODAL
     ===================================================== */
  const handleOpenEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  console.log("PAYROLL PROP:", payroll);

  /* =====================================================
     CLOSE MODAL
     ===================================================== */
  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <>
      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          {/* HEADER */}
          <thead className="bg-gray-50">
            <tr>
              {employeeColumns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-2 text-sm font-semibold text-gray-700 ${
                    col.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-200">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={employeeColumns.length}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleOpenEmployee(row)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  {employeeColumns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-2 text-sm text-fontc"
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
      

      {/* ================= MODAL ================= */}
      {open && selectedEmployee && (
        <EmployeePayrollModal
          isOpen={open}
          onClose={handleClose}
          employee={selectedEmployee}
          payroll={payroll}
        />  
      )}
      
    </>
  );
}
