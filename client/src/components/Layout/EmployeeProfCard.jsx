import React, { useState, useEffect, use } from "react";
import { FaRegEdit } from "react-icons/fa";

export default function EmployeeProfCard({ onClick }) {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  //placeholder, fill with backend api later
  useEffect(() => {
    // Example placeholder data
    setDepartments([
      { id: 1, name: "Human Resources" },
      { id: 2, name: "Finance" },
      { id: 3, name: "IT Department" },
    ]);
  }, []);
  // Load employees when department changes
  useEffect(() => {
    if (!selectedDept) return;

    // Placeholder employees — replace with backend call later
    const dummyEmployees = {
      1: [
        { id: 11, name: "Maria Santos" },
        { id: 12, name: "Carlos Cruz" },
      ],
      2: [
        { id: 21, name: "Jenna Lopez" },
        { id: 22, name: "Mark Reyes" },
      ],
      3: [
        { id: 31, name: "John Dela Cruz" },
        { id: 32, name: "Luis Mercado" },
      ],
    };

    setEmployees(dummyEmployees[selectedDept] || []);
  }, [selectedDept]);

  return (
    <div className="cta-card flex justify-between bg-bg p-4 rounded-md shadow-md">
      <div className="flex gap-4">
        {/* Department Dropdown */}
        <div className="flex">
          <select
            className="border rounded-lg p-2 bg-white text-sm"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Employee Name Dropdown */}
        <div className="flex">
          <select
            className="border rounded-lg p-2 bg-white text-sm"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            disabled={!selectedDept}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex">
        <button onClick={onClick}>
          <FaRegEdit className="text-base text-accent text-xl" />
        </button>
      </div>
    </div>
  );
}
