import React, { useState, useEffect } from "react";
import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import LedgerHeader from "../components/Layout/LedgerHeader";
import DeductionsTable from "../components/Composite/DeductionsTable";
import EarningsTable from "../components/Composite/EarningsTable";
import Button from "../components/UI/Button";

// 🖨️ PRINT COMPONENTS
import EarningsPrint from "../components/Composite/EarningsPrint";
import DeductionsPrint from "../components/Composite/DeductionsPrint";

export default function Ledger() {
  /* ======================================================
     FILTERS (SINGLE SOURCE OF TRUTH)
  ====================================================== */
  const [filters, setFilters] = useState({
    payrollFileId: "",
    departmentId: "",
    type: "deductions",
    paycode: "",
  });

  /* ======================================================
     PRINT STATE
  ====================================================== */
  const [printMode, setPrintMode] = useState(null); // null | "earnings" | "deductions"
  const [printRows, setPrintRows] = useState([]);
  const [payrollMeta, setPayrollMeta] = useState(null);

  /* ======================================================
     TEMP PAYROLL FILE (SAFE FOR DEV)
     REMOVE WHEN SELECTOR IS READY
  ====================================================== */
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      payrollFileId: "369d6182-fd02-49de-bd9e-f43bb36152c4",
    }));
  }, []);

  /* ======================================================
     FETCH PAYROLL META (FROM TRANSACTIONS)
     SAME SOURCE AS TRANSACTION PRINT
  ====================================================== */
  useEffect(() => {
    if (!filters.payrollFileId) return;

    const fetchPayrollMeta = async () => {
      try {
        const res = await fetch(
          `/api/payroll-transactions?payroll_file_id=${filters.payrollFileId}`
        );
        const json = await res.json();

        if (!json.success || !json.data?.length) return;

        const txn = json.data[0]; // finalized payroll = 1 transaction

        setPayrollMeta({
          paycode: txn.transaction_code,
          period_start: txn.period_start,
          period_end: txn.period_end,
          date_generated: txn.date_generated,
        });
      } catch (err) {
        console.error("Failed to load payroll meta", err);
      }
    };

    fetchPayrollMeta();
  }, [filters.payrollFileId]);

  /* ======================================================
     HANDLE PRINT
  ====================================================== */
  const handlePrint = async () => {
    try {
      const endpoint =
        filters.type === "earnings"
          ? "/api/ledger/earnings"
          : "/api/ledger";

      const res = await fetch(
        `${endpoint}?payroll_file_id=${filters.payrollFileId}`
      );
      const json = await res.json();

      if (!json.success) {
        console.error("Ledger print API failed", json);
        return;
      }

      setPrintRows(json.data);
      setPrintMode(filters.type);
    } catch (err) {
      console.error("Print fetch failed", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 px-2 md:px-0">
      <Sidebar />

      <div className="bg-bgshade min-h-screen w-full md:px-4 overflow-x-hidden">
        <div className="container flex flex-col gap-6">
          <TopCard title="LEDGER" />

          <LedgerHeader filters={filters} onChange={setFilters} />

          {/* PRINT BUTTON */}
          <div className="flex justify-end print:hidden">
            <Button
              onClick={handlePrint}
              className="bg-secondary text-white px-4 py-2 rounded-md shadow-sm"
            >
              Print Ledger
            </Button>
          </div>

          {/* ===========================
              PRINT ROOT (CSS ALLOWED)
          ============================ */}
          <div id="ledger-print">
            {/* SCREEN MODE (ALWAYS VISIBLE) */}
            {printMode === null && filters.type === "deductions" && (
              <DeductionsTable filters={filters} />
            )}

            {printMode === null && filters.type === "earnings" && (
              <EarningsTable filters={filters} />
            )}

            {/* PRINT MODE */}
            {printMode === "earnings" && payrollMeta && (
              <EarningsPrint
                payroll={payrollMeta}
                rows={printRows}
                onDone={() => setPrintMode(null)}
              />
            )}

            {printMode === "deductions" && payrollMeta && (
              <DeductionsPrint
                payroll={payrollMeta}
                rows={printRows}
                onDone={() => setPrintMode(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
