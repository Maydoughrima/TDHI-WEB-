import React from "react";
import TopCard from "../components/TopCard";
import Sidebar from "../components/SideBar";
import EmployeeProfCard from "../components/EmployeeProfCard";

export default function EmployeeProfile() {
  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:py-0 md:px-0">
      <Sidebar />
      <div className="bg-bgshade min-h-screen w-full md:px-4">
        {/* PAGE LAYOUT */}
        <div className="container flex flex-col gap-6">
          <TopCard title="GENERATE FILE" />

          <div className="">
            {/*CTA CARD CONTAINTER*/}
            <EmployeeProfCard onClick={() => setOpen(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
