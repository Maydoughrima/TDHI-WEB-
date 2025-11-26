import { React, useState } from "react";
import { FaRegFile } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import { LuHistory } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import PayrollTable from "./PayrollTable";
import EmployeeTable from "./EmployeeTable";
import TransactionsTable from "./TransactionsTable";

//import EmployeesTable from "./EmployeesTable"; // <-- IMPORT

export default function GenerateFileTable() {
  const [activeTab, setActiveTab] = useState("payroll");
  //

  return (
    <div className="flex flex-col bg-bg rounded-md">
      {/*CTA-CONTAINER*/}
      <div className="flex flex-col lg:flex-row gap-2">
        {/* CTA-WRAPPER */}
        <div className="top-cta flex flex-1 lg:gap-2 border-b border-b-gray-300 rounded-md justify-between p-0">
          {/* PAYROLL FILE */}
          <button
            onClick={() => setActiveTab("payroll")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm text-fontc font-heading py-3
        ${activeTab === "payroll" ? "bg-gray-400" : ""}
      `}
          >
            <FaRegFile />
            Payroll File
          </button>

          {/* EMPLOYEES */}
          <button
            onClick={() => setActiveTab("employee")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm text-fontc font-heading py-3
        ${activeTab === "employee" ? "bg-gray-400" : ""}
      `}
          >
            <BsPeople />
            Employees
          </button>

          {/* TRANSACTION */}
          <button
            onClick={() => setActiveTab("transaction")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm text-fontc font-heading py-3
        ${activeTab === "transaction" ? "bg-gray-400" : ""}
      `}
          >
            <LuHistory />
            Transaction
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="search flex flex-1 items-center justify-end gap-2 border border-gray-200 rounded-md px-3 py-2 w-full lg:w-auto">
          <IoIosSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search.."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>


      <div className="mt-4">
        {activeTab === "payroll" && <PayrollTable />}
         {activeTab === "employee" && <EmployeeTable />}
         {activeTab === "transaction" && <TransactionsTable />}
      </div>

    </div>
  );
}
