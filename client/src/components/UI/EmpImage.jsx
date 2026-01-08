import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function EmpImage({ 
  employeeId, 
  isEditable = false,
  selectedFile,
  setSelectedFile,
  placeholderText = "No image available"
}) {
  const [employee, setEmployee] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= FETCH EMPLOYEE (IMAGE + DATE HIRED) ================= */
  useEffect(() => {
    if (!employeeId) {
      setEmployee(null);
      return;
    }

    async function loadEmployee() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/employees/${employeeId}`
        );
        const json = await res.json();

        if (json.success) {
          setEmployee(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch employee data:", err);
      }
    }

    loadEmployee();
  }, [employeeId]);

  /* ================= PREVIEW SELECTED IMAGE ================= */
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  /* ================= HANDLE FILE SELECT ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ allow first-time selection
    setSelectedFile?.(file);
  };

  /* ================= DAYS EMPLOYED ================= */
  const daysEmployed = employee?.date_hired
    ? Math.floor(
        (new Date() - new Date(employee.date_hired)) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="flex flex-col justify-center gap-2">
      {/* Employee Image */}
      <div className="w-full h-96 bg-gray-100 rounded shadow-md p-4 flex items-center justify-center">
        {preview ? (
          <img
            src={preview}
            className="object-cover w-full h-full"
            alt="preview"
          />
        ) : employee?.image_url ? (
          <img
            src={employee.image_url}
            alt="Employee"
            className="object-cover w-full h-full rounded"
          />
        ) : (
          <span className="text-gray-500">{placeholderText}</span>
        )}
      </div>

      {/* UPLOAD BUTTON FOR EDIT MODE */}
      {isEditable && (
        <label className="cursor-pointer text-sm text-secondary text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="inline-block px-3 py-1 border rounded hover:bg-gray-100">
            Upload Image
          </span>
        </label>
      )}

      {/* VIEW MODE ONLY — DATE HIRED */}
      {!isEditable && employee && (
        <div className="text-center text-gray-600 text-sm">
          <p>
            Date Hired:{" "}
            {employee.date_hired
              ? dayjs(employee.date_hired).format("MMM D, YYYY")
              : "N/A"}
          </p>
          {daysEmployed !== null && (
            <p>({daysEmployed} days employed)</p>
          )}
        </div>
      )}
    </div>
  );
}
