import React, { useEffect, useState } from "react";
import SideBar from "../components/Layout/SideBar.jsx";
import TopCard from "../components/Layout/TopCard.jsx";

// LEFT (PRIMARY)
import PayrollCostOverview from "../components/UI/PayrollCostOverview.jsx";

// RIGHT (GROUPED)
import EncodingSummaryCard from "../components/UI/EncodingSummaryCard.jsx";
import PendingLeaveRequestCard from "../components/UI/PendingLeaveRequestCard.jsx";
import TransactionHistorySummary from "../components/Composite/TransactionHistorySummary.jsx";
import TransactionDetailModal from "../components/UI/TransactionDetailModal.jsx";
import { recentTransactionsMock } from "../data/mockAPI/recentTransactionsMock.js";

// BOTTOM
import TransactionHistory from "../components/Composite/TransactionHistory.jsx";

export default function UserDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTxn, setSelectedTxn] = useState(null);

  //mockApi call to fetch recent transactions
  useEffect(() => {
    setTransactions(recentTransactionsMock);
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <SideBar />

      {/* MAIN */}
      <main className="bg-bgshade min-h-screen w-full px-3 md:px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
          {/* HEADER */}
          <TopCard title="DASHBOARD" />

          {/* ================= PRIMARY DASHBOARD ROW ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 md:mt-0">
            {/* LEFT — PAYROLL COST OVERVIEW */}
            <PayrollCostOverview
              expenses={2004}
              deductions={45}
              dateLabel="From 1–13 December, 2025"
              rangeLabel="Last Payroll"
            />

            {/* RIGHT — OPERATIONAL SUMMARY (GROUPED) */}
            <div className="bg-bg rounded-md shadow-md p-6 flex flex-col gap-6">
              <EncodingSummaryCard
                totalEmployees={30}
                pending={8}
                inProgress={12}
                completed={10}
              />

              <PendingLeaveRequestCard
                pendingTotal={13}
                forEvaluation={6}
                approved={121}
              />

              <TransactionHistorySummary
                total={42}
                created={12}
                edited={26}
                approved={4}
                lastActivity="2 hours ago"
              />
            </div>
          </div>

          {/* ================= TRANSACTION HISTORY ================= */}
          <div className="bg-bg rounded-md shadow-md p-4">
            <TransactionHistory 
            transactions={transactions}
            onOpen={(txn) => setSelectedTxn(txn)}
            />
          </div>
        </div>

        {/* 🔥 MODAL (THIS IS THE KEY PART) */}
        {selectedTxn && (
          <TransactionDetailModal
            transaction={selectedTxn}
            onClose={() => setSelectedTxn(null)}
          />
        )}
      </main>
    </div>
  );
}
