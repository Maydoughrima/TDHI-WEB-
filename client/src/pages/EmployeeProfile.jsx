import React, { useEffect, useState } from "react";
import TopCard from "../components/Layout/TopCard";
import Sidebar from "../components/Layout/SideBar";
import EmployeeProfCard from "../components/Layout/EmployeeProfCard";

import PersonalInformation from "../components/Composite/PersonalInformation";
import EducationalSummary from "../components/Composite/EducationalSummary";
import EmpPayrollInfo from "../components/Composite/EmpPayrollInfo";
import EmploymentHistory from "../components/Composite/EmploymentHistory";

export default function EmployeeProfile() {
  /* ================= STATE ================= */
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null); // image only
  const [payrollDraft, setPayrollDraft] = useState(null); // payroll draft
  const [personalDraft, setPersonalDraft] = useState(null); // personal draft

  // "personal" | "education" | "employment"
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
    if (!selectedEmployeeId) return;

    try {
      console.log("SAVE CLICKED");
      console.log("personalDraft:", personalDraft);
      console.log("payrollDraft:", payrollDraft);

      /* ============ 1) IMAGE SAVE ============ */
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const res = await fetch(
          `http://localhost:5000/api/employees/${selectedEmployeeId}/image`,
          { method: "PATCH", body: formData }
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error("Image save failed: " + txt);
        }
      }

      /* ============ 2) PERSONAL INFO SAVE ============ */
      // personalDraft MUST be DB-shaped keys (snake_case)
      if (personalDraft) {
        const res = await fetch(
          `http://localhost:5000/api/employees/${selectedEmployeeId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(personalDraft),
          }
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error("Personal save failed: " + txt);
        }
      }

      /* ============ 3) PAYROLL SAVE ============ */
      /* ============ 3) PAYROLL SAVE ============ */
      if (payrollDraft) {
        const payload = {
          employeeStatus: payrollDraft.employeeStatus ?? null,
          designation: payrollDraft.designation ?? null,
          basicRate: payrollDraft.basicRate ?? null,
          dailyRate: payrollDraft.dailyRate ?? null,
          hourlyRate: payrollDraft.hourlyRate ?? null,
          leaveCredits: payrollDraft.leaveCredits ?? null,
          sssNo: payrollDraft.sssNo ?? null,
          hdmfNo: payrollDraft.hdmfNo ?? null,
          tinNo: payrollDraft.tinNo ?? null,
        };

        const res = await fetch(
          `http://localhost:5000/api/employees/${selectedEmployeeId}/payroll`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error("Payroll save failed: " + txt);
        }
      }

      /* ============ CLEANUP ============ */
      setIsEditing(false);
      setSelectedFile(null);

      // optional: keep drafts or clear them
      // setPayrollDraft(null);
      // setPersonalDraft(null);

      console.log("SAVE DONE ✅");
    } catch (err) {
      console.error(err);
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
            onCancel={() => setIsEditing(false)}
            onSelectEmployee={(id) => setSelectedEmployeeId(id)}
          />

          {/* ================= PAGE: PERSONAL ================= */}
          {page === "personal" && (
            <div
              className="animate-fadeSlideIn"
              style={{ animationDuration: "0.45s" }}
            >
              <PersonalInformation
                isEditing={isEditing}
                selectedEmployeeId={selectedEmployeeId}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setPersonalDraft={setPersonalDraft} // ✅ rename + pass
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

          {/* ================= PAGE: EMPLOYMENT ================= */}
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
