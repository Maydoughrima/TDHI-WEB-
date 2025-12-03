import React from "react";
import SideBar from "../components/Layout/SideBar.jsx";
import { SlGraph } from "react-icons/sl";
import { FaRegCalendarMinus } from "react-icons/fa";
import TopCard from "../components/Layout/TopCard.jsx";
import PayrollSummaryChart from "../components/Composite/PayrollSummaryChart.jsx";
import TransactionHistory from "../components/Composite/TransactionHistory.jsx";
import ChartDetails from "../components/Composite/ChartDetails.jsx";
import ChartHeader from "../components/Composite/ChartHeader.jsx";

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
            <div className="bg-secondary px-2 py-6 rounded-md shadow-md">
              <div className="flex items-center gap-2 px-3">
                <SlGraph className="text-lg text-bg" />
                <p className="font-heading text-sm text-bg">
                  Total Expenditures
                </p>
              </div>
              <div className="px-3 lg:px-6 mt-3 lg:mt-10">
                <h2 className="font-heading font-semibold text-xl md:text-2xl lg:text-3xl text-bg">
                  Php 34,000
                </h2>
              </div>
            </div>

            {/* Card 3 (right side, spanning 2 rows) */}
            <div className="bg-bg px-2 py-6 rounded-md shadow-md md:col-span-2 md:row-span-2">
              <ChartHeader/>

              <div className="flex-col">
                <PayrollSummaryChart
                  pending={12}
                  completed={48}
                  employees={30}
                />
                <ChartDetails/>
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
