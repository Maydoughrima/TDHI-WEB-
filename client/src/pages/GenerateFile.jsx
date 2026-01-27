import React, { useEffect, useState } from "react";
import TopCard from "../components/Layout/TopCard";
import Sidebar from "../components/Layout/SideBar";
import GenerateFileTable from "../components/Composite/GenerateFileTable";
import GenerateFCTA from "../components/Layout/GenerateFCTA";
import GeneratePayrollModal from "../components/UI/GeneratePayrollModal";

export default function GenerateFiles() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const [payrollFiles, setPayrollFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ======================================================
     FETCH PAYROLL FILES
  ====================================================== */
  const fetchPayrollFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/payroll-files");
      const json = await res.json();

      if (json.success) {
        setPayrollFiles(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch payroll files:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     ON PAGE LOAD
  ====================================================== */
  useEffect(() => {
    fetchPayrollFiles();
  }, []);

  /* ======================================================
     CREATE PAYROLL FILE
  ====================================================== */
  const handleSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/payroll-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.success) {
        setOpen(false);
        fetchPayrollFiles(); // refresh table
      } else {
        console.error(json.message);
      }
    } catch (error) {
      console.error("Failed to create payroll file:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:py-0 md:px-0">
      <Sidebar />

      <div className="bg-bgshade min-h-screen w-full md:px-4">
        <div className="container flex flex-col gap-6">
          <TopCard title="GENERATE FILE" />

          {/* CTA */}
          <GenerateFCTA onClick={() => setOpen(true)} />

          {/* TABLE */}
          <GenerateFileTable 
          data={payrollFiles}
          loading={loading}
          onRefreshPayrolls={fetchPayrollFiles}/>

          {/* MODAL */}
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