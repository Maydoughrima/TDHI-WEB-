import React, {useState, useEffect} from "react";
import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import LedgerHeader from "../components/Layout/LedgerHeader";
import DeductionsTable from "../components/Composite/DeductionsTable";
import EarningsTable from "../components/Composite/EarningsTable";

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
          <LedgerHeader
            filters={filters}
            onChange={setFilters}
          />

          {/* TABLES */}
          {filters.type === "deductions" && (
            <DeductionsTable filters={filters} />
          )}

          {filters.type === "earnings" && (
            <EarningsTable filters={filters} />
          )}
        </div>
      </div>
    </div>
  );
}