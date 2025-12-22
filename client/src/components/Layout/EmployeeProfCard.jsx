import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
import AddEmployeeModal from "../UI/AddEmployeeModal";

export default function EmployeeProfCard({ onClick, onEdit, onSelectEmployee }) {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Placeholder departments
  useEffect(() => {
    setDepartments([
      { id: 1, name: "Human Resources" },
      { id: 2, name: "Finance" },
      { id: 3, name: "IT Department" },
    ]);
  }, []);

  // Load employees when department changes
  useEffect(() => {
    if (!selectedDept) return;

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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddEmployee = (employeeData) => {
    console.log("Add Employee clicked:", employeeData);
  }

  return (
    <div className="cta-card flex flex-col md:flex-row justify-between bg-bg p-4 rounded-md shadow-md gap-4">
      {/* Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
        <select
          className="border rounded-lg p-2 bg-white text-sm w-full sm:w-auto"
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

        <select
          className="border rounded-lg p-2 bg-white text-sm w-full sm:w-auto"
          value={selectedEmployee}
          onChange={(e) => {
            setSelectedEmployee(e.target.value);
            onSelectEmployee(e.target.value); //sendId to parent
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

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-2 w-full sm:w-auto">
        <button
          onClick={handleOpenModal}
          className="bg-secondary px-4 py-2 flex gap-2 items-center justify-center text-bg rounded-md w-full sm:w-auto"
        >
          Add Employee <RiUserAddLine 
           className="text-base text-bg" />
        </button>

        <button
          onClick={onEdit}
          className="border border-gray-300 px-4 py-2 flex gap-2 items-center justify-center text-secondary rounded-md w-full sm:w-auto"
        >
          Edit Details <FaRegEdit className="text-base text-secondary" />
        </button>
      </div>

       {/* AddEmployeeModal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddEmployee}
      />
    </div>
  );
}
