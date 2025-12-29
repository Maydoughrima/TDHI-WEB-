import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
import AddEmployeeModal from "../UI/AddEmployeeModal";
import Button from "../UI/Button";

import {
  departments,
  employeesByDepartment,
} from "../../data/employeeprofile";

export default function EmployeeProfCard({
  onEdit,
  onSave,
  onCancel,
  isEditing,
  onSelectEmployee,
}) {
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load employees when department changes
  useEffect(() => {
    if (!selectedDept) return;
    setEmployees(employeesByDepartment[selectedDept] || []);
  }, [selectedDept]);

  // When employee changes → lock editing again
  useEffect(() => {
    if (isEditing) onCancel(); // Reset editing state
  }, [selectedEmployee, selectedDept]);

  return (
    <div className="cta-card flex flex-col md:flex-row justify-between bg-bg p-4 rounded-md shadow-md gap-4">

      {/* DROPDOWNS */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">

        {/* Department Dropdown */}
        <select
          className="border rounded-lg p-2 bg-white text-sm"
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setSelectedEmployee("");
          }}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Employees dropdown */}
        <select
          className="border rounded-lg p-2 bg-white text-sm"
          value={selectedEmployee}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedEmployee(id);
            onSelectEmployee(id); // Sends ID only
          }}
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

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-2">

        {/* ============ VIEW MODE ============ */}
        {!isEditing && (
          <>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-secondary px-4 py-2 flex gap-2 items-center justify-center text-bg shadow-sm"
            >
              Add Employee <RiUserAddLine className="text-base text-bg" />
            </Button>

            <Button
              onClick={onEdit}
              className="border border-gray-300 px-4 py-2 flex gap-2 items-center justify-center text-secondary shadow-sm"
            >
              Edit Details <FaRegEdit className="text-base text-secondary" />
            </Button>
          </>
        )}

        {/* ============ EDIT MODE ============ */}
        {isEditing && (
          <>
            <Button
              onClick={onSave}
              className="bg-secondary px-4 py-2 text-bg rounded-md shadow-sm"
            >
              Save Edit
            </Button>

            <Button
              onClick={onCancel}
              className="border border-gray-300 px-4 py-2 text-secondary rounded-md shadow-sm"
            >
              Cancel Edit
            </Button>
          </>
        )}
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
