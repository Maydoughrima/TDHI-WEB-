import React, { useState, useEffect, useRef } from "react";
import TextField from "../UI/Textfield";
import Dropdown from "../UI/Dropdown";
import EmpImage from "../UI/EmpImage";
import Button from "../UI/Button";
import { IoIosArrowForward } from "react-icons/io";

import { fetchEmployeeById } from "../../../../server/api/employeeAPI";

export default function PersonalInformation({
  isEditing,
  selectedEmployeeId,
  selectedFile,
  setSelectedFile,
  setPersonalDraft,
  goNext,
}) {
  /* ================= LOCAL FORM STATE ================= */
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

  const [imageUrl, setImageUrl] = useState(null);

  // 🔒 prevent first-load from triggering draft
  const didInitRef = useRef(false);

  /* ================= LOAD EMPLOYEE ================= */
  useEffect(() => {
    if (!selectedEmployeeId) return;

    async function loadEmployee() {
      try {
        const emp = await fetchEmployeeById(selectedEmployeeId);

        const loaded = {
          employeeNo: emp.employee_no ?? "",
          fullName: emp.full_name ?? "",
          address: emp.address ?? "",
          placeOfBirth: emp.place_of_birth ?? "",
          dateOfBirth: emp.date_of_birth ?? "",
          dateHired: emp.date_hired ?? "",
          department: emp.department ?? "",
          position: emp.position ?? "",
          emailAddress: emp.email ?? "",
          nameOfSpouse: emp.spouse_name ?? "",
          civilStatus: emp.civil_status ?? "",
          citizenship: emp.citizenship ?? "",
          spouseAddress: emp.spouse_address ?? "",
          contactNo: emp.contact_no ?? "",
        };

        setForm(loaded);
        setImageUrl(emp.image_url || null);

        // reset draft init guard
        didInitRef.current = false;
      } catch (err) {
        console.error("Failed to load employee:", err);
      }
    }

    loadEmployee();
  }, [selectedEmployeeId]);

  /* ================= SYNC DRAFT (EDIT ONLY) ================= */
  useEffect(() => {
    if (!isEditing) return;

    // 🚫 skip initial load
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }

    setPersonalDraft?.({
      full_name: form.fullName || null,
      address: form.address || null,
      place_of_birth: form.placeOfBirth || null,
      date_of_birth: form.dateOfBirth || null,
      date_hired: form.dateHired || null,
      civil_status: form.civilStatus || null,
      citizenship: form.citizenship || null,
      spouse_name: form.nameOfSpouse || null,
      spouse_address: form.spouseAddress || null,
      contact_no: form.contactNo || null,
      email: form.emailAddress || null,
      position: form.position || null,
    });
  }, [form, isEditing, setPersonalDraft]);

  /* ================= FIELD HANDLER ================= */
  function handleChange(field, value) {
    if (!isEditing) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /* ================= UI ================= */
  return (
    <div className="bg-bg w-full rounded-md p-4">
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg text-center font-heading">
          Personal Information
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <TextField label="Employee No." value={form.employeeNo} disabled />

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
            onChange={(e) =>
              handleChange("placeOfBirth", e.target.value)
            }
          />

          <TextField
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("dateOfBirth", e.target.value)
            }
          />

          <Dropdown
            label="Civil Status"
            value={form.civilStatus}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("civilStatus", e.target.value)
            }
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
            onChange={(e) =>
              handleChange("citizenship", e.target.value)
            }
          />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Date Hired"
            type="date"
            value={form.dateHired}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("dateHired", e.target.value)
            }
          />

          <TextField label="Department" value={form.department} disabled />

          <TextField
            label="Position"
            value={form.position}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("position", e.target.value)
            }
          />

          <TextField
            label="Email Address"
            value={form.emailAddress}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("emailAddress", e.target.value)
            }
          />

          <TextField
            label="Name of Spouse"
            value={form.nameOfSpouse}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("nameOfSpouse", e.target.value)
            }
          />

          <TextField
            label="Contact No."
            value={form.contactNo}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("contactNo", e.target.value)
            }
          />

          <TextField
            label="Spouse Address"
            value={form.spouseAddress}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("spouseAddress", e.target.value)
            }
          />

          <div className="flex justify-end">
            <Button className="bg-gray-100 border shadow-sm" onClick={goNext}>
              <IoIosArrowForward className="text-primary" />
            </Button>
          </div>
        </div>

        {/* IMAGE */}
        <EmpImage
          employeeId={selectedEmployeeId}
          imageUrl={imageUrl}
          isEditable={isEditing}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </div>
    </div>
  );
}
