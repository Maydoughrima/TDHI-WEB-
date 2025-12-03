import React, { useState } from "react";
import TopCard from "../components/Layout/TopCard";
import Sidebar from "../components/Layout/SideBar";
import { LuRefreshCcw } from "react-icons/lu";
import GenerateFileTable from "../components/Composite/GenerateFileTable";
import GenerateFCTA from "../components/Layout/GenerateFCTA";
import GeneratePayrollModal from "../components/UI/GeneratePayrollModal";

export default function GenerateFiles() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data) => {
    console.log("Payroll Data Submitted:", data);
    // Later: send to backend API
  };
  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:py-0 md:px-0">
      <Sidebar />
      <div className="bg-bgshade min-h-screen w-full md:px-4">
        {/* PAGE LAYOUT */}
        <div className="container flex flex-col gap-6">
          <TopCard title="GENERATE FILE" />

          {/*CTA CARD CONTAINTER*/}
          <GenerateFCTA onClick={() => setOpen(true)}/>
          {/*TABLE CONTAINER*/}
          <GenerateFileTable />

          <GeneratePayrollModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
