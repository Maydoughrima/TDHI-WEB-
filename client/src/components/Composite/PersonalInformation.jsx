import React, { useState } from "react";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";
import EmpImage from "../UI/EmpImage";
import Button from "../UI/Button";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

export default function PersonalInformation({ onClick }) {
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

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="bg-bg w-full flex flex-col rounded-md p-4">
      {/* Header */}
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg font-heading text-center">
          Personal Information
        </h2>
      </div>

      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Employee No."
            value={form.employeeNo}
            onChange={(e) => handleChange("employeeNo", e.target.value)}
          />

          <TextField
            label="Full Name:"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />

          <TextField
            label="Address:"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <TextField
            label="Place of Birth:"
            value={form.placeOfBirth}
            onChange={(e) => handleChange("placeOfBirth", e.target.value)}
          />

          <TextField
            label="Date of Birth:"
            value={form.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />

          {/* Civil Status + Citizenship */}
          <div className="flex flex-col gap-4">
            <Dropdown
              label="Civil Status:"
              value={form.civilStatus}
              onChange={(e) => handleChange("civilStatus", e.target.value)}
              options={[
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "widowed", label: "Widowed" },
              ]}
            />

            <TextField
              label="Citizenship:"
              value={form.citizenship}
              onChange={(e) => handleChange("citizenship", e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Date Hired:"
            value={form.dateHired}
            onChange={(e) => handleChange("dateHired", e.target.value)}
          />

          <TextField
            label="Department:"
            value={form.department}
            onChange={(e) => handleChange("department", e.target.value)}
          />

          <TextField
            label="Position:"
            value={form.position}
            onChange={(e) => handleChange("position", e.target.value)}
          />

          <TextField
            label="Email Address:"
            value={form.emailAddress}
            onChange={(e) => handleChange("emailAddress", e.target.value)}
          />

          <TextField
            label="Name of Spouse:"
            value={form.nameOfSpouse}
            onChange={(e) => handleChange("nameOfSpouse", e.target.value)}
          />

          <TextField
            label="Contact No."
            value={form.contactNo}
            onChange={(e) => handleChange("contactNo", e.target.value)}
          />

          <TextField
            label="Spouse Address:"
            value={form.spouseAddress}
            onChange={(e) => handleChange("spouseAddress", e.target.value)}
          />

          <div className=" flex justify-end gap-2">
            <Button onClick={onClick} //previous button
              className="bg-gray-100 border border-gray-300 shadow-sm"
              >
              <IoIosArrowBack
              className="text-fontc"
              />
            </Button>  

            <Button onClick={onClick} //next button
              className="bg-gray-100 border border-gray-300 shadow-sm"
              >
              <IoIosArrowForward
              className="text-fontc"
              />
            </Button>
          </div>
        </div>

        {/* PHOTO COLUMN */}
          <EmpImage
          //employeeId={123}
          //onUploadSuccess={(url) => console.log("New image URL:", url)}
          />
      </div>
    </div>
  );
}
