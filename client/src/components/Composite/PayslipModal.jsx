import { useEffect, useState } from "react";
import PayslipCard from "./PayslipCard";

export default function PayslipModal({ isOpen, onClose, payslip }) {
  const [snapshot, setSnapshot] = useState(null);

  /* ================= FETCH SNAPSHOT ================= */
  useEffect(() => {
    if (!isOpen || !payslip?.payroll_file_id || !payslip?.employee_id) {
      setSnapshot(null);
      return;
    }

    fetch(
      `http://localhost:5000/api/payroll-files/${payslip.payroll_file_id}/employees/${payslip.employee_id}/snapshot`
    )
      .then((r) => r.json())
      .then((j) => setSnapshot(j.success ? j.data : null))
      .catch(() => setSnapshot(null));
  }, [isOpen, payslip?.payroll_file_id, payslip?.employee_id]);

  if (!isOpen || !payslip) return null;

  /* ================= SOURCE OF TRUTH ================= */
  const source = snapshot || payslip;

  return (
    <>
      {/* ================= SCREEN MODAL ================= */}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center payslip-overlay">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-xl flex flex-col payslip-modal">
          
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Payslip Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>
          </div>

          {/* BODY (SCROLLABLE ON SCREEN) */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6 payslip-scroll">
            <div className="flex justify-center">
              <div className="w-full max-w-[820px] print-root">
                <PayslipCard payslip={source} />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t flex justify-end gap-2 bg-white">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm"
            >
              Close
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-secondary text-white rounded-md text-sm"
            >
              Print Payslip
            </button>
          </div>
        </div>
      </div>

      {/* ================= PRINT ROOT (HIDDEN ON SCREEN) ================= */}
      <div id="payslip-print" className="print-only">
        <div className="payslip-card">
          <PayslipCard payslip={source} />
        </div>
      </div>
    </>
  );
}
