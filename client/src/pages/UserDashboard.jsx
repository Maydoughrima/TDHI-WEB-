import React from "react";
import SideBar from "../components/SideBar.jsx";
import { SlGraph } from "react-icons/sl";
import { FaRegCalendarMinus } from "react-icons/fa";
import TopCard from "../components/TopCard.jsx";
import PayrollSummaryChart from "../components/PayrollSummaryChart.jsx";
import TransactionHistory from "../components/TransactionHistory.jsx";

export default function UserDashboard() {
  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:py-0 md:px-0">
      <SideBar />
      <main className="bg-bgshade h-full w-full md:px-4">
        {/* Page Layout */}
        <div className="container flex flex-col gap-6">
          {/* Top bar */}
          <TopCard title="DASHBOARD" />

          {/* Dashboard Cards (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 (top-left) */}
            <div className="bg-bg px-2 py-6 rounded-md shadow-md">
              <div className="flex items-center gap-2 px-3">
                <SlGraph className="text-lg text-complimentary" />
                <p className="font-heading text-sm text-gray-500">
                  Total Outstanding
                </p>
              </div>
              <div className="px-3 lg:px-6 mt-3 lg:mt-10">
                <h2 className="font-heading font-semibold text-xl md:text-2xl lg:text-3xl text-primary">
                  Php 34,000
                </h2>
              </div>
            </div>

            {/* Card 3 (right side, spanning 2 rows) */}
            <div className="bg-bg px-2 py-6 rounded-md shadow-md md:col-span-2 md:row-span-2">
              <div className="card-wrapper flex justify-between items-center">
                <div className="card-header flex-col items-center gap-2 px-3">
                  <p className="font-heading text-lg font-medium text-primary">
                    Payroll Summary
                  </p>
                  <p className="font-heading text-sm text-gray-500 mt-1">
                    DATE
                  </p>
                </div>

                <div className="cta-select-date">
                  <button className="text-bg text-sm bg-secondary rounded-lg shadow-lg p-2 border border-gray-200">
                    Last 30 days
                  </button>
                </div>
              </div>

              <div className="flex-col">
                <PayrollSummaryChart
                  pending={12}
                  completed={48}
                  employees={30}
                />

                <div className="grid grid-cols-2 md:flex md:items-start lg:justify-between md:gap-10 px-3 gap-6">
                  <div className="Pending-payroll border-l-4 border-l-primary pl-3 flex-col items-center">
                    <p className="text-gray-500 font-heading text-sm">
                      Pending Payroll
                    </p>
                    <h2 className="text-xl text-primary font-heading font-medium">
                      3,040
                    </h2>
                  </div>

                  <div className="Pending-payroll border-l-4 border-l-primary pl-3 flex-col">
                    <p className="text-gray-500 font-heading text-sm">
                      Completed Payroll
                    </p>
                    <h2 className="text-xl text-primary font-heading font-medium">
                      1,850
                    </h2>
                  </div>

                  <div
                    className="Pending-payroll border-l-4 border-l-primary pl-3 flex-col 
                  col-span-2 md:col-span-1 mx-auto md:mx-0"
                  >
                    <p className="text-gray-500 font-heading text-sm">
                      Employees
                    </p>
                    <h2 className="text-xl text-primary font-heading font-medium">
                      4,890
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 (bottom-left) */}
            <div className="bg-bg px-2 py-6 rounded-md shadow-md">
              <div className="flex items-center gap-2 px-3">
                <FaRegCalendarMinus className="text-lg text-complimentary" />
                <p className="font-heading text-sm text-gray-500">
                  Upcoming Payroll
                </p>
              </div>
               <div className="px-3 lg:px-6 mt-3 lg:mt-10">
                <h2 className="font-heading font-semibold text-xl md:text-2xl lg:text-3xl text-primary">
                  DATE
                </h2>
              </div>
            </div>
          </div>

          {/*TRANSACTION HISTORY*/}

          <div className="trans-wrapper w-full flex flex-col px-4 py-4 bg-bg rounded shadow-md">
            <TransactionHistory/>
          </div>
        </div>
      </main>
    </div>
  );
}
