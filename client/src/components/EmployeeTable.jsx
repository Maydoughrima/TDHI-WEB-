import { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";

export default function EmployeeTable() {
  const [employee, setEmployee] = useState([]);

  // Fetch payroll data from backend API
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await fetch("/api/employee"); // replace with your API endpoint
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    }

    fetchEmployee();
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee No.</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Department</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Employee Status</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Payroll Status</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employee.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                No Employees found.
              </td>
            </tr>
          ) : (
            employee.map((employees) => (
              <tr key={employees.employeeNum} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{employees.employeeNum}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{employees.employeeName}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{employees.department}</td>
                <td className="px-4 py-2 text-sm text-gray-700 text-right">{employees.employeeStatus}</td>
                <td className="px-4 py-2 text-sm text-gray-700 text-right">{employees.payrollStatus}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaPrint />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
