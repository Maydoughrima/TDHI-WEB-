import React, { useEffect, useState } from "react";
import dayjs from "dayjs"; // optional, for easier date formatting

export default function EmpImage({ 
  employeeId, 
  isEditable = false,
  selectedFile,
  setSelectedFile,
  placeholderText = "No image available"
}) {

  const [employee, setEmployee] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!employeeId) return;
    // TEMP: Fetch employee info from backend (commented for now)
    /*
    fetch(`/api/employees/${employeeId}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.error("Failed to fetch employee data:", err));
    */
  }, [employeeId]);

  //preview selected image (modal only)
  useEffect (() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectUrl(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e) => {
    const file =e.target.files[0];
    if (file && selectedFile){
      setSelectedFile(file);
    }
  };

  // Compute days employed
  const daysEmployed = employee?.date_hired
    ? Math.floor((new Date() - new Date(employee.date_hired)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="flex flex-col justify-center gap-2">
      {/* Employee Image */}
      <div className="w-full h-96 bg-gray-100 rounded shadow-md p-4 flex items-center justify-center">
        {preview ? (
          <img src={preview}
          className="object-cover w-full h-full"
          alt="preview" />
        ) : employee?.photo_url ? (
          <img
            src={employee.photo_url}
            alt="Employee"
            className="object-cover w-full h-full rounded"
          />
        ) : (
          <span className="text-gray-500">{placeholderText}</span>
        )}
      </div>

      {/* UPLOAD BUTTON FOR MODAL */}
       {isEditable &&(
        <label className="cursor-pointer text-sm text-secondary text-center">
          <input type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          />
          <span className="inline-block px-3 py-1 border rounded hover:bg-gray-100">
            Upload Image
          </span>
        </label>
       )} 



      {/* VIEW MODE ONLYE ??? Date Hired & Days Employed */}
       {!isEditable && employee && (
        <div className="text-center text-gray-600 text-sm">
          <p>
            Date Hired:{" "}
            {employee.date_hired
              ? dayjs(employee.date_hired).format("MMM D, YYYY")
              : "N/A"}
          </p>
          {daysEmployed !== null && <p>({daysEmployed} days employed)</p>}
        </div>
      )}
    </div>
  );
}
