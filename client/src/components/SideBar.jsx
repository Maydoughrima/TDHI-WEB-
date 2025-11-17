import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { LuHouse, LuFileCog } from "react-icons/lu";
import { FaRegFile } from "react-icons/fa";
import { IoChevronDown, IoChevronUp, IoMenu, IoClose } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { HiOutlineWallet } from "react-icons/hi2";
import { LuClipboardList } from "react-icons/lu";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineFeedback } from "react-icons/md";
import pfpimg from "../assets/ds1232.jpg";

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
              <Link>Main</Link>
            </div>

            {/* Dashboard Link */}
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <LuHouse className="text-xl text-gray-500" />
              <Link className="text-base text-fontc">Dashboard</Link>
            </div>

            {/* Generate File Link */}
            <div className="gntf-lnk font-heading flex items-center gap-2">
              <FaRegFile className="text-lg text-gray-500" />
              <Link className="text-base text-fontc">Generate File</Link>
            </div>

            {/* Processing Dropdown */}
            <div className="pros-lnk font-heading flex flex-col gap-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-2 w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <LuFileCog className="text-lg text-gray-500" />
                  <span className="text-base text-fontc">Processing</span>
                </div>

                {isDropdownOpen ? (
                  <IoChevronUp className="text-gray-500" />
                ) : (
                  <IoChevronDown className="text-gray-500" />
                )}
              </button>

              {/* Dropdown Items */}
              <div
                className={`flex flex-col gap-4 ml-5 pl-4 border-l border-l-gray-300 transition-all duration-300 ${
                  isDropdownOpen
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <Link className="text-sm text-fontc">Encode DTR</Link>
                <Link className="text-sm text-fontc">Deductions</Link>
              </div>
            </div>
          </div>

          <div className="acc-comp px-4 flex flex-col gap-2">
            {/* Account sec*/}
            <div className="sec-title font-heading text-sm text-gray-500">
              <Link>Account</Link>
            </div>

            {/* Employee Profile Dropdown */}
            <div className="EP-lnk font-heading flex flex-col gap-4">
              <button
                onClick={() => setIsEPDropdownOpen(!isEPDropdownOpen)}
                className="flex items-center justify-between gap-2 w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <GoPeople className="text-lg text-gray-500" />
                  <span className="text-base text-fontc">Employee Profile</span>
                </div>

                {isEPDropdownOpen ? (
                  <IoChevronUp className="text-gray-500" />
                ) : (
                  <IoChevronDown className="text-gray-500" />
                )}
              </button>

              {/* Dropdown Items */}
              <div
                className={`flex flex-col gap-4 ml-5 pl-4 border-l border-l-gray-300 transition-all duration-300 ${
                  isEPDropdownOpen
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <Link className="text-sm text-fontc">Department 1</Link>
                <Link className="text-sm text-fontc">Department 2</Link>
                <Link className="text-sm text-fontc">Department 3</Link>
              </div>
            </div>
          </div>

          {/* ENTRY/LEDGER/PAYSLIP */}
          <div className="elp-comp px-4 flex flex-col gap-2">
            <div className="elp-title font-heading text-sm text-gray-500">
              <Link>Entry/ Ledger/ Payslip</Link>
            </div>
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <HiOutlineWallet className="text-xl text-gray-500" />
              <Link className="text-base text-fontc">Compensation</Link>
            </div>
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <LuClipboardList className="text-xl text-gray-500" />
              <Link className="text-base text-fontc">Ledger</Link>
            </div>
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <TbReportSearch className="text-xl text-gray-500" />
              <Link className="text-base text-fontc">Reports</Link>
            </div>
            <div className="dshb-lnk font-heading flex items-center gap-2">
              <MdOutlineFeedback className="text-xl text-gray-500" />
              <Link className="text-base text-fontc">Feedback</Link>
            </div>
          </div>

          <div className="user-deets flex gap-4 items-center -mx-4 mt-12 xl:mt-70 lg:hidden bg-bgshade py-3 px-6">
            <div className="img-container w-12 h-12">
                <img src={pfpimg}
                 alt=""
                 className="w-full h-auto rounded-full object-cover"
                 />
            </div>
            <div className="user-name">
                <h3
                className="text-primary font"
                >Andrea Suello</h3>
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
