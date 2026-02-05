import React, { useEffect, useState } from "react";
import SideBar from "../components/Layout/SideBar.jsx";
import TopCard from "../components/Layout/TopCard.jsx";

// LEFT
import PayrollCostOverview from "../components/UI/PayrollCostOverview.jsx";

// RIGHT
import EncodingSummaryCard from "../components/UI/EncodingSummaryCard.jsx";
import PendingLeaveRequestCard from "../components/UI/PendingLeaveRequestCard.jsx";
import TransactionHistorySummary from "../components/Composite/TransactionHistorySummary.jsx";

// BOTTOM
import TransactionHistory from "../components/Composite/TransactionHistory.jsx";

export default function UserDashboard() {
  /* ================= UI ================= */
  const [isPayrollOpen, setIsPayrollOpen] = useState(false);

  /* ================= PAYROLL ================= */
  const [payrollFiles, setPayrollFiles] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [overview, setOverview] = useState(null);

  /* ================= ENCODING SUMMARY ================= */
  const [encodingSummary, setEncodingSummary] = useState({
    total_employees: 0,
    completed: 0,
    pending: 0,
    paycode: "-",
  });

  /* ================= LEAVE SUMMARY ================= */
  const [leaveSummary, setLeaveSummary] = useState({
    pendingTotal: 0,
    approved: 0,
  });

  /* ================= TRANSACTION SUMMARY ================= */
  const [transactionSummary, setTransactionSummary] = useState({
    total: 0,
    created: 0,
    edited: 0,
    approved: 0,
    last_activity: null,
  });

  /* ================= RECENT TRANSACTIONS ================= */
  const [transactions, setTransactions] = useState([]);

  /* ================= UI HANDLERS ================= */
  const handleTogglePayroll = () => {
    setIsPayrollOpen((prev) => !prev);
  };

  const handleSelectPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    setIsPayrollOpen(false);
  };

  /* ================= FETCH PAYROLL FILES ================= */
  useEffect(() => {
    fetch("/api/dashboard/payroll-files")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setPayrollFiles(json.data);
          setSelectedPayroll(json.data[0]);
        }
      });
  }, []);

  /* ================= FETCH PAYROLL COST OVERVIEW ================= */
  useEffect(() => {
    if (!selectedPayroll) return;

    fetch(
      `/api/dashboard/payroll-cost-overview?payroll_file_id=${selectedPayroll.payroll_file_id}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setOverview(json.data);
        }
      });
  }, [selectedPayroll]);

  /* ================= FETCH ENCODING SUMMARY ================= */
  useEffect(() => {
    fetch("/api/dashboard/encoding-summary")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setEncodingSummary({
            total_employees: Number(json.data.total_employees || 0),
            completed: Number(json.data.completed || 0),
            pending: Number(json.data.pending || 0),
            paycode: json.data.paycode || "-",
          });
        }
      });
  }, []);

  /* ================= FETCH LEAVE SUMMARY ================= */
  useEffect(() => {
    fetch("/api/dashboard/leave-summary")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setLeaveSummary({
            pendingTotal: Number(json.data.pendingTotal || 0),
            approved: Number(json.data.approved || 0),
          });
        }
      });
  }, []);

  /* ================= FETCH TRANSACTION SUMMARY ================= */
  useEffect(() => {
    fetch("/api/dashboard/transaction-summary")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setTransactionSummary({
            total: Number(json.data.total || 0),
            created: Number(json.data.created || 0),
            edited: Number(json.data.edited || 0),
            approved: Number(json.data.approved || 0),
            last_activity: json.data.last_activity,
          });
        }
      });
  }, []);

  /* ================= FETCH RECENT TRANSACTIONS ================= */
  useEffect(() => {
    fetch("/api/dashboard/recent-transactions")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTransactions(json.data);
        }
      });
  }, []);

  /* ================= HELPERS ================= */
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "—";

    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const dateLabel = overview
    ? `From ${new Date(overview.period_start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} – ${new Date(overview.period_end).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    : "—";

  /* ================= RENDER ================= */
  return (
    <div className="flex flex-col md:flex-row">
      <SideBar />

      <main className="bg-bgshade min-h-screen w-full px-3 md:px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
          <TopCard title="DASHBOARD" />

          {/* ===== PRIMARY ROW ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT */}
            <PayrollCostOverview
              expenses={Number(overview?.earnings || 0)}
              deductions={Number(overview?.deductions || 0)}
              dateLabel={dateLabel}
              rangeLabel={selectedPayroll?.paycode || "Last Payroll"}
              payrollOptions={payrollFiles}
              isDropdownOpen={isPayrollOpen}
              onRangeClick={handleTogglePayroll}
              onSelectPayroll={handleSelectPayroll}
            />

            {/* RIGHT */}
            <div className="bg-bg rounded-md shadow-md p-6 flex flex-col gap-6">
              <EncodingSummaryCard
                totalEmployees={encodingSummary.total_employees}
                pending={encodingSummary.pending}
                completed={encodingSummary.completed}
                paycode={encodingSummary.paycode}
              />

              <PendingLeaveRequestCard
                pendingTotal={leaveSummary.pendingTotal}
                approved={leaveSummary.approved}
              />

              <TransactionHistorySummary
                total={transactionSummary.total}
                created={transactionSummary.created}
                edited={transactionSummary.edited}
                approved={transactionSummary.approved}
                lastActivity={formatTimeAgo(transactionSummary.last_activity)}
              />
            </div>
          </div>

          {/* ===== RECENT TRANSACTIONS ===== */}
          <div className="bg-bg rounded-md shadow-md p-4">
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}
