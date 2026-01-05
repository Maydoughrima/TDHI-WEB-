import { useState } from "react";
import { FaRegFile } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import { LuHistory } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";

import PayrollTable from "./PayrollTable";
import EmployeeTable from "./EmployeeTable";
import TransactionsTable from "./TransactionsTable";

export default function GenerateFileTable() {
  /* =====================================================
     TAB STATE
     -----------------------------------------------------
     Controls which section is visible:
     - "payroll"
     - "employee"
     - "transaction"
     ===================================================== */
  const [activeTab, setActiveTab] = useState("payroll");

  /* =====================================================
     PAYROLL CONTEXT STATE (VERY IMPORTANT)
     -----------------------------------------------------
     - null  → user is NOT inside a payroll
     - object → user IS inside a payroll
     This state controls whether Employees tab is locked.
     ===================================================== */
  const [activePayroll, setActivePayroll] = useState(null);
  // Example value:
  // { payCode: "PR-2025-001", status: "ongoing" }

  /* =====================================================
     DERIVED STATE
     ===================================================== */
  const isEmployeeLocked = !activePayroll;

  /* =====================================================
     HANDLERS
     ===================================================== */

  /**
   * ENTER PAYROLL CONTEXT
   * Called when user clicks a payroll row.
   * - Sets active payroll
   * - Automatically navigates to Employees tab
   */
  const handleOpenPayroll = (payroll) => {
    setActivePayroll(payroll);
    setActiveTab("employee"); // 👈 AUTO PROCEED TO EMPLOYEES
  };

  /**
   * EXIT PAYROLL CONTEXT
   * Called when user goes back to Payroll File tab.
   * - Clears active payroll
   * - Locks Employees tab again
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
            onClick={handleExitPayroll} // 👈 EXIT PAYROLL CONTEXT HERE
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-heading py-3
              ${activeTab === "payroll" ? "bg-accent text-bg" : "text-fontc"}
            `}
          >
            <FaRegFile />
            Payroll File
          </button>

          {/* EMPLOYEES TAB (LOCKED WHEN NOT IN PAYROLL) */}
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

          {/* TRANSACTIONS TAB (ALWAYS AVAILABLE) */}
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
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* ===============================
          TAB CONTENT
         =============================== */}
      <div className="mt-4">
        {/* PAYROLL LIST */}
        {activeTab === "payroll" && (
          <PayrollTable onOpenPayroll={handleOpenPayroll} />
        )}

        {/* EMPLOYEES (ONLY RENDERS IF INSIDE PAYROLL) */}
        {activeTab === "employee" && activePayroll && (
          <EmployeeTable
            payroll={activePayroll}
            onExitPayroll={handleExitPayroll}
          />
        )}

        {/* TRANSACTIONS (OPTIONALLY SCOPED TO PAYROLL) */}
        {activeTab === "transaction" && (
          <TransactionsTable payroll={activePayroll} />
        )}
      </div>
    </div>
  );
}
