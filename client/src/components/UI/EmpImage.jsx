import React, { useEffect, useState } from "react";
import dayjs from "dayjs"; // optional, for easier date formatting

export default function EmpImage({ employeeId, placeholderText = "No image available" }) {
  const [employee, setEmployee] = useState(null);

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

  // Compute days employed
  const daysEmployed = employee?.date_hired
    ? Math.floor((new Date() - new Date(employee.date_hired)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="flex flex-col justify-center gap-2">
      {/* Employee Image */}
      <div className="w-full h-96 bg-gray-100 rounded shadow-md p-4 flex items-center justify-center">
        {employee?.photo_url ? (
          <img
            src={employee.photo_url}
            alt="Employee"
            className="object-cover w-full h-full rounded"
          />
        ) : (
          <span className="text-gray-500">{placeholderText}</span>
        )}
      </div>

      {/* Date Hired & Days Employed */}
      <div className="flex flex-col text-center  text-gray-700 mt-2">
        <p className="text-gray-500">
          Date Hired:{" "}
          {employee?.date_hired ? dayjs(employee.date_hired).format("MMM D, YYYY") : "N/A"}
        </p>
        {daysEmployed !== null && <p>({daysEmployed} days employed)</p>}
      </div>
    </div>
  );
}
