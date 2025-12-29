import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getEmployeeById } from "../../data/employeeprofile";

// IMPORT MODAL HERE ⬇️
import AddEducationalSummaryModal from "../UI/AddEducationalSummaryModal";
import AddTradCourseWork from "../UI/AddTradCourseWork";

export default function EducationalSummary({ selectedEmployeeId, goBack, goNext }) {
  const [educList, setEducList] = useState([]);

  // Modal Open State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTradModalOpen, setIsTradModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedEmployeeId) return;
    const emp = getEmployeeById(selectedEmployeeId);
    setEducList(emp?.education || []);
  }, [selectedEmployeeId]);

  return (
    <div className="bg-bg w-full rounded-md p-4 min-h-[600px] flex flex-col justify-start">
      
      {/* Header */}
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg text-center font-heading">Educational Summary</h2>
      </div>

      <div className="mt-4 flex flex-col gap-4">

        {/* *** EDUCATION LIST *** */}
        {educList.length > 0 ? (
          educList.map((edu, i) => (
            <div key={i} className="p-4 border rounded-md shadow-sm bg-white">
              <div className="font-semibold">
                {edu.school} | {edu.degree}
              </div>
              <div className="text-xs text-gray-500">{edu.batch}</div>

              <button
                className="text-primary text-sm mt-2"
                onClick={() => setIsTradModalOpen(true)}
              >
                + Add new additional coursework
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-10">
            No educational background available.
          </p>
        )}

        {/* ADD NEW EDUCATION BUTTON */}
        <button
          className="p-3 border rounded text-center text-sm text-gray-600 bg-white shadow-sm"
          onClick={() => setIsModalOpen(true)}
        >
          + Add new education
        </button>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-3 gap-2">
          <Button className="bg-gray-100 border shadow-sm" onClick={goBack}>
            <IoIosArrowBack className="text-primary" />
          </Button>

          <Button className="bg-gray-100 border shadow-sm" onClick={goNext}>
            <IoIosArrowForward className="text-primary" />
          </Button>
        </div>
      </div>

      {/* MODAL — now connected */}
      <AddEducationalSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <AddTradCourseWork
        isOpen={isTradModalOpen}
        onClose={() => setIsTradModalOpen(false)}
      />
    </div>
  );
}
