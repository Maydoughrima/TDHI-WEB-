import React from "react";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";

export default function PersonalDetailsModal ({form, handleChange}){
    return (
        <div className="grid grid-cols-1  md:grid-cols-2 gap-x-10 gap-y-5">

      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-4">
        <TextField
          label="Employee No."
          value={form.employeeNo}
          onChange={(e) => handleChange("employeeNo", e.target.value)}
        />

        <TextField
          label="Full Name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />

        <TextField
          label="Address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <TextField
          label="Place of Birth"
          value={form.placeOfBirth}
          onChange={(e) => handleChange("placeOfBirth", e.target.value)}
        />

        <TextField
          label="Date of Birth"
          value={form.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
        />

        <Dropdown
          label="Civil Status"
          value={form.civilStatus}
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
          onChange={(e) => handleChange("citizenship", e.target.value)}
        />
      </div>

      {/* MIDDLE COLUMN */}
      <div className="flex flex-col gap-4">
        <TextField
          label="Date Hired"
          value={form.dateHired}
          onChange={(e) => handleChange("dateHired", e.target.value)}
        />

        <TextField
          label="Department"
          value={form.department}
          onChange={(e) => handleChange("department", e.target.value)}
        />

        <TextField
          label="Position"
          value={form.position}
          onChange={(e) => handleChange("position", e.target.value)}
        />

        <TextField
          label="Email Address"
          value={form.emailAddress}
          onChange={(e) => handleChange("emailAddress", e.target.value)}
        />

        <TextField
          label="Name of Spouse"
          value={form.nameOfSpouse}
          onChange={(e) => handleChange("nameOfSpouse", e.target.value)}
        />

        <TextField
          label="Contact No."
          value={form.contactNo}
          onChange={(e) => handleChange("contactNo", e.target.value)}
        />

        <TextField
          label="Spouse Address"
          value={form.spouseAddress}
          onChange={(e) => handleChange("spouseAddress", e.target.value)}
        />
      </div>

    </div>
    )
}
