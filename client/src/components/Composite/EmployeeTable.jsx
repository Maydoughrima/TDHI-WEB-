import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { employees as mockEmployee } from "../../data/employee";;

export default function EmployeeTable() {
  const [employee, setEmployee] = useState([]);

  // Fetch payroll data from backend API
  useEffect(() => {
      setEmployee(mockEmployee);
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee No.</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Department</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Payroll Status</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Action</th>
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
                <td className="px-4 py-2 text-sm text-fontc">{employees.id}</td>
                <td className="px-4 py-2 text-sm text-fontc">{employees.Name}</td>
                <td className="px-4 py-2 text-sm text-fontc">{employees.department}</td>
                <td className="px-4 py-2 text-sm text-fontc text-left">{employees.employee_status}</td>
                <td className="px-4 py-2 text-sm text-fontc text-left">{employees.payroll_status}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-accent hover:text-blue-700">
                    <FaRegEdit />
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
