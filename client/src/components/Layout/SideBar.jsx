import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import { LuHouse, LuClipboardList } from "react-icons/lu";
import { FaRegFile } from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineFeedback } from "react-icons/md";
import pfpimg from "../../assets/ds1232.jpg";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItemBase =
    "flex items-center gap-3 px-3 py-2 rounded-lg w-full whitespace-nowrap";

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg md:hidden">
        <img src={logo} alt="Logo" className="w-14" />
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)}>
            <IoMenu className="text-2xl text-secondary" />
          </button>
        )}
      </div>

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-bg
          fixed inset-y-0 left-0
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
          min-h-screen
          z-10
        `}
      >
        <div className="flex flex-col h-full px-4 py-4">
          {/* Mobile Close */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <img src={logo} alt="Logo" className="w-20" />
            <button onClick={() => setIsSidebarOpen(false)}>
              <IoClose className="text-2xl text-secondary" />
            </button>
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:block border-b border-gray-300 pb-3 mb-6">
            <img src={logo} alt="Logo" className="w-20" />
          </div>

          {/* MAIN */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-heading text-gray-500 mb-2">Main</p>

            <NavLink
              to="/user/dashboard"
              className={({ isActive }) =>
                `${navItemBase} ${
                  isActive ? "bg-accent text-white" : "text-fontc"
                }`
              }
            >
              <LuHouse className="text-xl shrink-0" />
              <span className="font-heading">Dashboard</span>
            </NavLink>

            <NavLink
              to="/user/generatefile"
              className={({ isActive }) =>
                `${navItemBase} ${
                  isActive ? "bg-accent text-white" : "text-fontc"
                }`
              }
            >
              <FaRegFile className="text-xl shrink-0" />
              <span className="font-heading">Processing</span>
            </NavLink>
          </div>

          {/* ACCOUNT */}
          <div className="flex flex-col gap-2 mt-6">
            <p className="text-xs font-heading text-gray-500 mb-2">Account</p>

            <NavLink
              to="/user/employeeprofile"
              className={({ isActive }) =>
                `${navItemBase} ${
                  isActive ? "bg-accent text-white" : "text-fontc"
                }`
              }
            >
              <GoPeople className="text-xl shrink-0" />
              <span className="font-heading">Employee Profile</span>
            </NavLink>
          </div>

          {/* ENTRY / LEDGER / PAYSLIP */}
          <div className="flex flex-col gap-2 mt-6">
            <p className="text-xs font-heading text-gray-500 mb-2">
              Entry / Ledger / Payslip
            </p>

            <NavLink
              to="/user/ledger"
              className={({ isActive }) =>
                `${navItemBase} ${
                  isActive ? "bg-accent text-white" : "text-black"
                }`
              }
            >
              <LuClipboardList className="text-xl shrink-0" />
              <span className="font-heading">Ledger</span>
            </NavLink>

            <NavLink
              to="/user/reports"
              className={({ isActive }) =>
                `${navItemBase} ${
                  isActive ? "bg-accent text-white" : "text-black"
                }`
              }
            >
              <TbReportSearch className="text-xl shrink-0" />
              <span className="font-heading">Reports</span>
            </NavLink>

            <NavLink
              to="/user/feedback"
              className={navItemBase + " text-fontc"}
            >
              <MdOutlineFeedback className="text-xl shrink-0 text-gray-500" />
              <span className="font-heading">Feedback</span>
            </NavLink>
          </div>

          {/* User Details (Mobile) */}
          <div className="mt-auto flex items-center gap-3 bg-bgshade py-3 px-4 lg:hidden">
            <img
              src={pfpimg}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-primary">
              Andrea Suello
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 md:hidden"
        />
      )}
    </>
  );
}
