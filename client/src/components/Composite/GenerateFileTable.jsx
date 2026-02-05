import { useState } from "react";
import { FaRegFile } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import { LuHistory } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";

import PayrollTable from "./PayrollTable";
import EmployeeTable from "./EmployeeTable";
import TransactionsTable from "./TransactionsTable";

export default function GenerateFileTable({
  data = [],
  loading,
  onRefreshPayrolls,
}) {
  /* =====================================================
     TAB STATE
     ===================================================== */
  const [activeTab, setActiveTab] = useState("payroll");

  /* =====================================================
     SEARCH STATE (GLOBAL)
     ===================================================== */
  const [search, setSearch] = useState("");

  /* =====================================================
     PAYROLL CONTEXT STATE
     ===================================================== */
  const [activePayroll, setActivePayroll] = useState(null);

  const isEmployeeLocked = !activePayroll;

  /* =====================================================
     HANDLERS
     ===================================================== */
  const handleOpenPayroll = (payroll) => {
    setActivePayroll(payroll);
    setActiveTab("employee");
    setSearch(""); // optional: reset search when entering
  };

  const handleExitPayroll = () => {
    setActivePayroll(null);
    setActiveTab("payroll");
    setSearch("");
  };

  /* =====================================================
     RENDER
     ===================================================== */
  return (
    <div className="flex flex-col bg-bg rounded-md">
      {/* ===============================
          TOP BAR (TABS + SEARCH)
         =============================== */}
      <div className="flex flex-col lg:flex-row gap-2">
        {/* TABS */}
        <div className="top-cta flex flex-1 border-b border-gray-300 justify-between">
          <button
            onClick={handleExitPayroll}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-heading py-3
              ${activeTab === "payroll" ? "bg-accent text-bg" : "text-fontc"}
            `}
          >
            <FaRegFile />
            Payroll File
          </button>

          <button
            disabled={isEmployeeLocked}
            onClick={() => setActiveTab("employee")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-heading py-3
              ${
                isEmployeeLocked
                  ? "text-gray-400 cursor-not-allowed"
                  : activeTab === "employee"
                  ? "bg-accent text-bg"
                  : "text-fontc"
              }
            `}
          >
            <BsPeople />
            Employees
          </button>

          <button
            onClick={() => setActiveTab("transaction")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-heading py-3
              ${activeTab === "transaction" ? "bg-accent text-bg" : "text-fontc"}
            `}
          >
            <LuHistory />
            Transaction
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="search flex flex-1 items-center justify-end gap-2 border border-gray-200 rounded-md px-3 py-2">
          <IoIosSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${
              activeTab === "payroll"
                ? "payroll files"
                : activeTab === "employee"
                ? "employees"
                : "transactions"
            }...`}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* ===============================
          TAB CONTENT
         =============================== */}
      <div className="mt-4">
        {activeTab === "payroll" && (
          <PayrollTable
            data={data}
            loading={loading}
            search={search}
            onOpenPayroll={handleOpenPayroll}
          />
        )}

        {activeTab === "employee" && activePayroll && (
          <EmployeeTable
            payroll={activePayroll}
            search={search}
            onExitPayroll={handleExitPayroll}
            onRefreshPayrolls={onRefreshPayrolls}
          />
        )}

        {activeTab === "transaction" && (
          <TransactionsTable payroll={activePayroll} search={search} />
        )}
      </div>
    </div>
  );
}
