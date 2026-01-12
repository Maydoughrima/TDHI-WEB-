import React, { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
import AddEmployeeModal from "../UI/AddEmployeeModal";
import Button from "../UI/Button";

export default function EmployeeProfCard({
  onEdit,
  onSave,
  onCancel,
  isEditing,
  onSelectEmployee,
}) {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔒 Track previous selection to avoid killing Save
  const prevEmployeeRef = useRef(null);
  const prevDeptRef = useRef(null);

  /* ================= FETCH DEPARTMENTS ================= */
  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await fetch("http://localhost:5000/api/departments");
        const json = await res.json();
        setDepartments(json.data || []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    }
    loadDepartments();
  }, []);

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    if (!selectedDept) {
      setEmployees([]);
      return;
    }

    async function loadEmployees() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/employees?department=${selectedDept}`
        );
        const json = await res.json();
        setEmployees(json.data || []);
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    }

    loadEmployees();
  }, [selectedDept]);

  /* ================= CANCEL EDIT ONLY ON ACTUAL CHANGE ================= */
  useEffect(() => {
    const employeeChanged =
      prevEmployeeRef.current &&
      prevEmployeeRef.current !== selectedEmployee;

    const deptChanged =
      prevDeptRef.current && prevDeptRef.current !== selectedDept;

    if (isEditing && (employeeChanged || deptChanged)) {
      onCancel();
    }

    prevEmployeeRef.current = selectedEmployee;
    prevDeptRef.current = selectedDept;
  }, [selectedEmployee, selectedDept, isEditing, onCancel]);

  return (
    <div className="cta-card flex flex-col md:flex-row justify-between bg-bg p-4 rounded-md shadow-md gap-4">
      {/* ================= DROPDOWNS ================= */}
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
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Employee Dropdown */}
        <select
          className="border rounded-lg p-2 bg-white text-sm"
          value={selectedEmployee}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedEmployee(id);
            onSelectEmployee(id);
          }}
          disabled={!selectedDept}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-2">
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
