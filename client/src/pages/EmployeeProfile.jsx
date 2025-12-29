import React, { useEffect, useState } from "react";
import TopCard from "../components/Layout/TopCard";
import Sidebar from "../components/Layout/SideBar";
import EmployeeProfCard from "../components/Layout/EmployeeProfCard";

import PersonalInformation from "../components/Composite/PersonalInformation";
import EducationalSummary from "../components/Composite/EducationalSummary";
import EmpPayrollInfo from "../components/Composite/EmpPayrollInfo";
import EmploymentHistory from "../components/Composite/EmploymentHistory";

export default function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // "personal" | "education"
  const [page, setPage] = useState("personal");

  useEffect(() => {
    setIsEditing(false);
  }, [selectedEmployeeId]);

  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:px-0 overflow-hidden">
      <Sidebar />

      <div className="bg-bgshade min-h-screen w-full md:px-4 overflow-hidden">
        <div className="container flex flex-col gap-6 overflow-hidden">
          <TopCard title="EMPLOYEE PROFILE" />

          <EmployeeProfCard
            onEdit={() => setIsEditing(true)}
            onSave={() => {
              console.log("SAVE TO BACKEND HERE");
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
            isEditing={isEditing}
            onSelectEmployee={(id) => {
              setSelectedEmployeeId(id);
              setIsEditing(false); // lock when changing employees
            }}
          />

          {/* =========================== */}
          {/* PAGE 1 — PERSONAL INFO PAGE */}
          {/* =========================== */}

          {page === "personal" && (
            <div
              className="animate-fadeSlideIn"
              style={{ animationDuration: "0.45s" }}
            >
              <PersonalInformation
                isEditing={isEditing}
                selectedEmployeeId={selectedEmployeeId}
                goNext={() => setPage("education")}
              />

              {/* ➜ Added top margin between Personal Info + Payroll */}
              <div className="mt-6">
                <EmpPayrollInfo
                  selectedEmployeeId={selectedEmployeeId}
                  isEditing={isEditing}
                />
              </div>
            </div>
          )}

          {/* =============================== */}
          {/* PAGE 2 — EDUCATIONAL SUMMARY    */}
          {/* =============================== */}

          {page === "education" && (
            <div
              className="animate-fadeSlideIn"
              style={{ animationDuration: "0.45s" }}
            >
              <EducationalSummary
                selectedEmployeeId={selectedEmployeeId}
                isEditing={isEditing}
                goBack={() => setPage("personal")}
                goNext={() => setPage("employment")}
              />
            </div>
          )}

          {/* =============================== */}
          {/* PAGE 3 — EMPLOYMENT SUMMARY    */}
          {/* =============================== */}

          {page === "employment" && (
            <div
              className="animate-fadeSlideIn"
              style={{ animationDuration: "0.45s" }}
            >
              <EmploymentHistory
                selectedEmployeeId={selectedEmployeeId}
                goBack={() => setPage("education")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
