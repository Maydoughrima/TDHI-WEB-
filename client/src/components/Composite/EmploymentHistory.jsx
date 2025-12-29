import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import { IoIosArrowBack } from "react-icons/io";
import { getEmployeeById } from "../../data/employeeprofile";
import AddEmploymentHistoryModal from "../UI/AddEmploymentHistoryModal";

export default function EmploymentHistory({ selectedEmployeeId, goBack }) {
  const [empList, setEmpList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedEmployeeId) return;
    const emp = getEmployeeById(selectedEmployeeId);
    setEmpList(emp?.employment || []);
  }, [selectedEmployeeId]);

  return (
    <div className="bg-bg w-full rounded-md p-4 min-h-[600px] flex flex-col justify-start">

      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg text-center font-heading">
          Employment History
        </h2>
      </div>

      <div className="mt-4 flex flex-col gap-4">

        {empList.length > 0 ? (
          empList.map((emp, i) => (
            <div key={i} className="p-4 border rounded-md shadow-sm bg-white">
              <div className="font-semibold">
                {emp.position} | {emp.compname}
              </div>
              <div className="text-xs text-gray-500">{emp.date}</div>

              <button className="text-primary text-sm mt-2">
                + Add new information
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-10">
            No employment history available.
          </p>
        )}

        <button className="p-3 border rounded text-center text-sm text-gray-600 bg-white shadow-sm"
        onClick={() => setIsModalOpen(true)}
        >
          + Add new employment history
        </button>

        {/* Back Button */}
        <div className="flex justify-end mt-3">
          <Button className="bg-gray-100 border shadow-sm" onClick={goBack}>
            <IoIosArrowBack className="text-primary" />
          </Button>
        </div>
      </div>
       <AddEmploymentHistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        /> 
    </div>
  );
}
