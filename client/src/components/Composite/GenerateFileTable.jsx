import { useState } from "react";
import { FaRegFile } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import { LuHistory } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";

import PayrollTable from "./PayrollTable";
import EmployeeTable from "./EmployeeTable";
import TransactionsTable from "./TransactionsTable";

export default function GenerateFileTable({ data = [], loading, onRefreshPayrolls }) {
  /* =====================================================
     TAB STATE
     ===================================================== */
  const [activeTab, setActiveTab] = useState("payroll");

  /* =====================================================
     PAYROLL CONTEXT STATE
     ===================================================== */
  const [activePayroll, setActivePayroll] = useState(null);
  // Example:
  // { id, payCode, status, periodStart, periodEnd }

  /* =====================================================
     DERIVED STATE
     ===================================================== */
  const isEmployeeLocked = !activePayroll;

  /* =====================================================
     HANDLERS
     ===================================================== */

  /**
   * ENTER PAYROLL CONTEXT
   */
  const handleOpenPayroll = (payroll) => {
    setActivePayroll(payroll);
    setActiveTab("employee");
  };

  /**
   * EXIT PAYROLL CONTEXT
   */
  const handleExitPayroll = () => {
    setActivePayroll(null);
    setActiveTab("payroll");
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
          {/* PAYROLL FILE TAB */}
          <button
            onClick={handleExitPayroll}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-heading py-3
              ${activeTab === "payroll" ? "bg-accent text-bg" : "text-fontc"}
            `}
          >
            <FaRegFile />
            Payroll File
          </button>

          {/* EMPLOYEES TAB */}
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

          {/* TRANSACTIONS TAB */}
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

        {/* SEARCH BAR (UI ONLY FOR NOW) */}
        <div className="search flex flex-1 items-center justify-end gap-2 border border-gray-200 rounded-md px-3 py-2">
          <IoIosSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* ===============================
          TAB CONTENT
         =============================== */}
      <div className="mt-4">
        {/* PAYROLL FILE LIST */}
        {activeTab === "payroll" && (
          <PayrollTable
            data={data}
            loading={loading}
            onOpenPayroll={handleOpenPayroll}
          />
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === "employee" && activePayroll && (
          <EmployeeTable
            payroll={activePayroll}
            onExitPayroll={handleExitPayroll}
            onRefreshPayrolls={onRefreshPayrolls}
          />
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transaction" && (
          <TransactionsTable payroll={activePayroll} />
        )}
      </div>
    </div>
  );
}
