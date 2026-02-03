import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { LuHouse, LuClipboardList } from "react-icons/lu";
import { FaRegFile } from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { TbReportSearch } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";
import { MdOutlineRequestPage } from "react-icons/md";
import { FaRegSquareCheck } from "react-icons/fa6";
import pfpimg from "../../assets/ds1232.jpg";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role; // "USER" | "PAYROLL_CHECKER"

  const navItemBase =
    "flex items-center gap-3 px-3 py-2 rounded-lg w-full whitespace-nowrap transition";

  const activeClass = "bg-accent text-white";
  const normalClass = "text-fontc hover:bg-bgshade";
  const disabledClass =
    "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none";

  const navClass = ({ isActive, disabled }) => {
    if (disabled) return `${navItemBase} ${disabledClass}`;
    return `${navItemBase} ${isActive ? activeClass : normalClass}`;
  };

  const isUser = role === "USER";
  const isChecker = role === "PAYROLL_CHECKER";

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
          w-64 bg-bg fixed inset-y-0 left-0
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 min-h-screen z-10
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
              className={(props) =>
                navClass({ ...props, disabled: false })
              }
            >
              <LuHouse className="text-xl shrink-0" />
              <span className="font-heading">Dashboard</span>
            </NavLink>

            <NavLink
              to="/user/generatefile"
              className={(props) =>
                navClass({ ...props, disabled: isChecker })
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
              className={(props) =>
                navClass({ ...props, disabled: false })
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
              className={(props) =>
                navClass({ ...props, disabled: isChecker })
              }
            >
              <LuClipboardList className="text-xl shrink-0" />
              <span className="font-heading">Ledger</span>
            </NavLink>

            <NavLink
              to="/user/reports"
              className={(props) =>
                navClass({ ...props, disabled: isChecker })
              }
            >
              <TbReportSearch className="text-xl shrink-0" />
              <span className="font-heading">Reports</span>
            </NavLink>

            <NavLink
              to="/user/reqleave"
              className={(props) =>
                navClass({ ...props, disabled: isChecker })
              }
            >
              <MdOutlineRequestPage className="text-xl shrink-0" />
              <span className="font-heading">Request Leave</span>
            </NavLink>

            <NavLink
              to="/user/appleave"
              className={(props) =>
                navClass({ ...props, disabled: isUser })
              }
            >
              <FaRegSquareCheck className="text-xl shrink-0" />
              <span className="font-heading">Approve Leave</span>
            </NavLink>

            <NavLink
              to="/user/transactions"
              className={(props) =>
                navClass({ ...props, disabled: false })
              }
            >
              <GrTransaction className="text-xl shrink-0" />
              <span className="font-heading">Transaction History</span>
            </NavLink>
          </div>

          {/* Mobile User */}
          <div className="mt-auto flex items-center gap-3 bg-bgshade py-3 px-4 lg:hidden">
            <img
              src={pfpimg}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-primary">
              {user?.fullname || "User"}
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
