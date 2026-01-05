import React, { useState, useEffect } from "react";
import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import LedgerHeader from "../components/Layout/LedgerHeader";
import DeductionsTable from "../components/Composite/DeductionsTable";
import EarningsTable from "../components/Composite/EarningsTable";
import Button from "../components/UI/Button";

export default function Ledger() {
  // 🔑 Single source of truth
  const [filters, setFilters] = useState({
    departmentId: "",
    type: "deductions",
    paycode: "",
  });

  useEffect(() => {
    console.log("FILTERS:", filters);
  }, [filters]);

  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:px-0">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="bg-bgshade min-h-screen w-full md:px-4 overflow-x-hidden">
        <div className="container flex flex-col gap-6">
          {/* PAGE HEADER */}
          <TopCard title="LEDGER" />

          {/* FILTERS */}
          <LedgerHeader filters={filters} onChange={setFilters} />

          <div className="flex justify-end">
            <Button
              onClick={() => window.print()}
              className="print:hidden bg-secondary w-20px text-white px-4 py-2 rounded-md shadow-sm"
            >
              Print Ledger
            </Button>
          </div>

          {/* PRINTABLE AREA */}
          <div id="ledger-print">
            {filters.type === "deductions" && (
              <DeductionsTable filters={filters} />
            )}

            {filters.type === "earnings" && <EarningsTable filters={filters} />}
          </div>
        </div>
      </div>
    </div>
  );
}
