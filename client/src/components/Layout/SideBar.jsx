import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import { LuHouse, LuFileCog } from "react-icons/lu";
import { FaRegFile } from "react-icons/fa";
import { IoChevronDown, IoChevronUp, IoMenu, IoClose } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { HiOutlineWallet } from "react-icons/hi2";
import { LuClipboardList } from "react-icons/lu";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineFeedback } from "react-icons/md";
import pfpimg from "../../assets/ds1232.jpg";

export default function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEPDropdownOpen, setIsEPDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* ✅ Mobile Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg md:hidden rounded-lg">
        <img src={logo} alt="Logo" className="w-14" />

        {/* Only show menu icon when sidebar is closed */}
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)}>
            <IoMenu className="text-2xl text-secondary text-fontc" />
          </button>
        )}
      </div>

      {/* ✅ Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-bg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col md:h-screen z-10`}
      >
        <div className="sidebar-wrapper px-4 flex flex-col gap-10 h-full overflow-y-auto">
          {/* Close Button (Mobile only) */}
          <div className="flex items-center justify-between md:hidden">
            <img src={logo} alt="Logo" className="w-20 my-3" />
            <button onClick={() => setIsSidebarOpen(false)}>
              <IoClose className="text-2xl text-secondary text-fontc" />
            </button>
          </div>

          {/* Logo Section (Desktop only) */}
          <div className="logo-container border-b mt-10 md:mt-5 xl:mt-10 border-gray-300 hidden md:block">
            <img src={logo} alt="Logo" className="w-20 mb-2" />
          </div>

          {/* Main Section */}
          <div className="main-comp px-4 flex flex-col gap-2">
            <div className="sec-title font-heading text-sm text-gray-500">
              <NavLink>Main</NavLink>
            </div>

            {/* Dashboard Link */}
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <NavLink
                to="/user/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg w-full ${
                    isActive ? "bg-accent text-white" : "text-fontc"
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-2">
                    <LuHouse
                      className={`text-xl ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span>Dashboard</span>
                  </div>
                )}
              </NavLink>
            </div>

            {/* Generate File Link */}
            <div className="gntf-lnk font-heading flex items-center gap-2">
              <NavLink
                to="/user/generatefile"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg w-full ${
                    isActive ? "bg-accent text-white" : "text-fontc"
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-2">
                    <FaRegFile
                      className={`text-xl ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span>Processing</span>
                  </div>
                )}
              </NavLink>
            </div>
          </div>

          <div className="acc-comp px-4 flex flex-col gap-2">
            {/* Account sec*/}
            <div className="sec-title font-heading text-sm text-gray-500">
              <Link>Account</Link>
            </div>

            {/* Employee Profile Dropdown */}
            <div className="gntf-lnk font-heading flex items-center gap-2">
              <NavLink
                to="/user/employeeprofile"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg w-full ${
                    isActive ? "bg-accent text-white" : "text-fontc"
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-2">
                    <GoPeople
                      className={`text-xl ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span>Employee Profile</span>
                  </div>
                )}
              </NavLink>
            </div>
          </div>

          {/* ENTRY/LEDGER/PAYSLIP */}
          <div className="elp-comp px-4 flex flex-col gap-2">
            <div className="elp-title font-heading text-sm text-gray-500">
              <Link>Entry/ Ledger/ Payslip</Link>
            </div>
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <HiOutlineWallet className="text-xl text-gray-500" />
              <NavLink className="text-base text-fontc">Compensation</NavLink>
            </div>
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <LuClipboardList className="text-xl text-gray-500" />
              <NavLink className="text-base text-fontc">Ledger</NavLink>
            </div>
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <TbReportSearch className="text-xl text-gray-500" />
              <NavLink className="text-base text-fontc">Reports</NavLink>
            </div>
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <MdOutlineFeedback className="text-xl text-gray-500" />
              <NavLink className="text-base text-fontc">Feedback</NavLink>
            </div>
          </div>

          <div className="user-deets flex gap-4 items-center -mx-4 mt-12 xl:mt-70 lg:hidden bg-bgshade py-3 px-6">
            <div className="img-container w-12 h-12">
              <img
                src={pfpimg}
                alt=""
                className="w-full h-auto rounded-full object-cover"
              />
            </div>
            <div className="user-name">
              <h3 className="text-primary font">Andrea Suello</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Background overlay (Mobile only) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 md:hidden"
        ></div>
      )}
    </>
  );
}
