import React, { useState, useEffect } from "react";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";
import EmpImage from "../UI/EmpImage";
import Button from "../UI/Button";
import { IoIosArrowForward } from "react-icons/io";

import { getEmployeeById } from "../../data/employeeprofile";

export default function PersonalInformation({
  isEditing,
  selectedEmployeeId,
  goNext,
}) {
  const [form, setForm] = useState({
    employeeNo: "",
    fullName: "",
    address: "",
    placeOfBirth: "",
    dateOfBirth: "",
    dateHired: "",
    department: "",
    position: "",
    emailAddress: "",
    nameOfSpouse: "",
    civilStatus: "",
    citizenship: "",
    spouseAddress: "",
    contactNo: "",
  });

  // Load employee data
  useEffect(() => {
    if (!selectedEmployeeId) return;

    const emp = getEmployeeById(selectedEmployeeId);
    if (!emp) return;

    setForm({
      employeeNo: emp.employeeNo ?? "",
      fullName: emp.name ?? "",
      address: emp.address ?? "",
      placeOfBirth: emp.placeOfBirth ?? "",
      dateOfBirth: emp.dateOfBirth ?? "",
      dateHired: emp.dateHired ?? "",
      department: emp.department ?? "",
      position: emp.position ?? "",
      emailAddress: emp.emailAddress ?? "",
      nameOfSpouse: emp.nameOfSpouse ?? "",
      civilStatus: emp.civilStatus ?? "",
      citizenship: emp.citizenship ?? "",
      spouseAddress: emp.spouseAddress ?? "",
      contactNo: emp.contactNo ?? "",
    });
  }, [selectedEmployeeId]);

  function handleChange(field, value) {
    if (!isEditing) return; // prevents edit when locked
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="bg-bg w-full rounded-md p-4">
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg text-center font-heading">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Employee No."
            value={form.employeeNo}
            disabled
          />

          <TextField
            label="Full Name"
            value={form.fullName}
            disabled={!isEditing}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />

          <TextField
            label="Address"
            value={form.address}
            disabled={!isEditing}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <TextField
            label="Place of Birth"
            value={form.placeOfBirth}
            disabled={!isEditing}
            onChange={(e) => handleChange("placeOfBirth", e.target.value)}
          />

          <TextField
            label="Date of Birth"
            value={form.dateOfBirth}
            disabled={!isEditing}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />

          <Dropdown
            label="Civil Status"
            value={form.civilStatus}
            disabled={!isEditing}
            onChange={(e) => handleChange("civilStatus", e.target.value)}
            options={[
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
              { value: "widowed", label: "Widowed" },
            ]}
          />

          <TextField
            label="Citizenship"
            value={form.citizenship}
            disabled={!isEditing}
            onChange={(e) => handleChange("citizenship", e.target.value)}
          />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Date Hired"
            value={form.dateHired}
            disabled={!isEditing}
            onChange={(e) => handleChange("dateHired", e.target.value)}
          />

          <TextField
            label="Department"
            value={form.department}
            disabled={!isEditing}
            onChange={(e) => handleChange("department", e.target.value)}
          />

          <TextField
            label="Position"
            value={form.position}
            disabled={!isEditing}
            onChange={(e) => handleChange("position", e.target.value)}
          />

          <TextField
            label="Email Address"
            value={form.emailAddress}
            disabled={!isEditing}
            onChange={(e) => handleChange("emailAddress", e.target.value)}
          />

          <TextField
            label="Name of Spouse"
            value={form.nameOfSpouse}
            disabled={!isEditing}
            onChange={(e) => handleChange("nameOfSpouse", e.target.value)}
          />

          <TextField
            label="Contact No."
            value={form.contactNo}
            disabled={!isEditing}
            onChange={(e) => handleChange("contactNo", e.target.value)}
          />

          <TextField
            label="Spouse Address"
            value={form.spouseAddress}
            disabled={!isEditing}
            onChange={(e) => handleChange("spouseAddress", e.target.value)}
          />

          {/* NEXT BUTTON */}
          <div className="flex justify-end">
            <Button className="bg-gray-100 border shadow-sm" onClick={goNext}>
              <IoIosArrowForward className="text-primary" />
            </Button>
          </div>
        </div>

        {/* IMAGE */}
        <EmpImage employeeId={selectedEmployeeId} />
      </div>
    </div>
  );
}
