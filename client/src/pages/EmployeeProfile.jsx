import React, { useState } from "react";
import TopCard from "../components/Layout/TopCard";
import Sidebar from "../components/Layout/SideBar";
import EmployeeProfCard from "../components/Layout/EmployeeProfCard";
import PersonalInformation from "../components/Composite/PersonalInformation";
import EmpPayrollInfo from "../components/Composite/EmpPayrollInfo";


export default function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false); // State to manage lock textfield
   const [open, setOpen] = useState(false); // <-- REQUIRED

   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null); // Example employee ID
  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:py-0 md:px-0">
      <Sidebar />
      <div className="bg-bgshade min-h-screen w-full md:px-4">
        {/* PAGE LAYOUT */}
        <div className="container flex flex-col gap-6">
          <TopCard title="EMPLOYEE PROFILE" />

          <div className="inputbox-container">
            {/*CTA CARD CONTAINTER*/}
            <EmployeeProfCard onClick={() => 
              setOpen(true)} 
              onEdit={() =>  
              setIsEditing(true)}
              onSelectEmployee = {setSelectedEmployeeId} />
          </div>

          <div className="content-container flex flex-col gap-2"> 
            {/*CONTENT CARDS CONTAINER*/}
            <PersonalInformation
             isEditing={isEditing}
             selectedEmployeeId = {selectedEmployeeId}
             />
            <EmpPayrollInfo
            isEditing={isEditing}
            selectedEmployeeId = {selectedEmployeeId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
