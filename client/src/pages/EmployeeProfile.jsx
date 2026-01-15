import React, { useEffect, useState } from "react";
import TopCard from "../components/Layout/TopCard";
import Sidebar from "../components/Layout/SideBar";
import EmployeeProfCard from "../components/Layout/EmployeeProfCard";

import PersonalInformation from "../components/Composite/PersonalInformation";
import EducationalSummary from "../components/Composite/EducationalSummary";
import EmpPayrollInfo from "../components/Composite/EmpPayrollInfo";
import EmploymentHistory from "../components/Composite/EmploymentHistory";

/* ================= AUTH CONTEXT (SAFE) ================= */
const storedUser = JSON.parse(localStorage.getItem("user") || "null");

export default function EmployeeProfile() {
  /* ================= STATE ================= */
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [payrollDraft, setPayrollDraft] = useState(null);
  const [personalDraft, setPersonalDraft] = useState(null);

  const [page, setPage] = useState("personal");

  /* ================= RESET ON EMPLOYEE CHANGE ================= */
  useEffect(() => {
    setIsEditing(false);
    setSelectedFile(null);
    setPayrollDraft(null);
    setPersonalDraft(null);
  }, [selectedEmployeeId]);

  /* ================= SAVE HANDLER ================= */
  const handleSave = async () => {
    // 🔒 HARD GUARDS (PREVENT CRASHES)
    if (!isEditing) return;
    if (!selectedEmployeeId) return;
    if (!storedUser?.id) {
      console.error("No logged-in user found");
      return;
    }

    try {
      console.log("SAVE CLICKED");
      console.log("personalDraft:", personalDraft);
      console.log("payrollDraft:", payrollDraft);

      const authHeaders = {
        "x-user-id": storedUser.id,
      };

      /* ============ 1) IMAGE SAVE ============ */
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const res = await fetch(
          `http://localhost:5000/api/employees/${selectedEmployeeId}/image`,
          {
            method: "PATCH",
            headers: authHeaders,
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error(await res.text());
        }
      }

      /* ============ 2) PERSONAL INFO SAVE ============ */
      if (personalDraft && Object.keys(personalDraft).length > 0) {
        const res = await fetch(
          `http://localhost:5000/api/employees/${selectedEmployeeId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify(personalDraft),
          }
        );

        if (!res.ok) {
          throw new Error(await res.text());
        }
      }

      /* ============ 3) PAYROLL SAVE ============ */
      if (payrollDraft && Object.keys(payrollDraft).length > 0) {
        const res = await fetch(
          `http://localhost:5000/api/employees/${selectedEmployeeId}/payroll`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify(payrollDraft), // ✅ send raw draft
          }
        );

        if (!res.ok) {
          throw new Error(await res.text());
        }
      }

      /* ============ CLEANUP ============ */
      setIsEditing(false);
      setSelectedFile(null);
      setPayrollDraft(null);
      setPersonalDraft(null);

      console.log("SAVE DONE ✅");
    } catch (err) {
      console.error("SAVE FAILED ❌", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:px-0 overflow-hidden">
      <Sidebar />

      <div className="bg-bgshade min-h-screen w-full md:px-4 overflow-hidden">
        <div className="container flex flex-col gap-6 overflow-hidden">
          <TopCard title="EMPLOYEE PROFILE" />

          <EmployeeProfCard
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setPayrollDraft(null);
              setPersonalDraft(null);
            }}
            onSelectEmployee={(id) => setSelectedEmployeeId(id)}
          />

          {/* ================= PAGE: PERSONAL ================= */}
          {page === "personal" && (
            <div className="animate-fadeSlideIn" style={{ animationDuration: "0.45s" }}>
              <PersonalInformation
                isEditing={isEditing}
                selectedEmployeeId={selectedEmployeeId}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setPersonalDraft={setPersonalDraft}
                goNext={() => setPage("education")}
              />

              <div className="mt-6">
                <EmpPayrollInfo
                  selectedEmployeeId={selectedEmployeeId}
                  isEditing={isEditing}
                  onChangePayroll={setPayrollDraft}
                />
              </div>
            </div>
          )}

          {/* ================= PAGE: EDUCATION ================= */}
          {page === "education" && (
            <div className="animate-fadeSlideIn" style={{ animationDuration: "0.45s" }}>
              <EducationalSummary
                selectedEmployeeId={selectedEmployeeId}
                isEditing={isEditing}
                goBack={() => setPage("personal")}
                goNext={() => setPage("employment")}
              />
            </div>
          )}

          {/* ================= PAGE: EMPLOYMENT ================= */}
          {page === "employment" && (
            <div className="animate-fadeSlideIn" style={{ animationDuration: "0.45s" }}>
              <EmploymentHistory
                selectedEmployeeId={selectedEmployeeId}
                goBack={() => setPage("education")}
                isEditing={isEditing}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
