import React, {useState} from "react";
import TextField from "../UI/Textfield";

export default function PersonalInformation() {
  const [form, setForm] = useState({
    employeeNo: "",
    fullName: "",
    address: "",
    placeOfBirth: "",
    dateOfBirth: "",
    citizenship: "",
    spouseName: "",
    spouseAddress: "",
    spouseContact: "",
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="bg-bg flex flex-col max-w-[500px] w-full rounded-md">
      <div className="card-header bg-secondary rounded-md">
        <h2 className="text-bg font-heading text-center p-2">
          Personal Information
        </h2>
      </div>

      <div>
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
      </div>
    </div>
  );
}
