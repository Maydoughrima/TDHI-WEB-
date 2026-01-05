import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import ReportsHeader from "../components/Composite/ReportsHeader";
import { useState } from "react";
import ReportExpenditures from "../components/Composite/ReportExpenditures";
import ReportsDeductions from "../components/Composite/ReportsDeductions";

export default function Reports() {
  const [filters, setFilters] = useState({
    paycode: "",
    type: "expenditures",
  });

  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:px-0">
      <Sidebar />

      <div className="bg-bgshade min-h-screen w-full md:px-4 overflow-x-hidden">
        <div className="container flex flex-col gap-6">
          <TopCard title="REPORTS" />
          <ReportsHeader filters={filters} onChange={setFilters} />

          <div id="reports-print">
            {filters.type === "expenditures" && (
              <ReportExpenditures filters={filters} />
            )}
            {filters.type === "deductions" && (
              <ReportsDeductions filters={filters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
