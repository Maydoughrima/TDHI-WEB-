import { useEffect, useState } from "react";

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

  /* ================= NORMALIZATION ================= */
  const manualAdjustments = Array.isArray(source.manual_adjustments)
    ? source.manual_adjustments
    : [];

  const deductions = Array.isArray(source.deductions)
    ? source.deductions
    : [];

  const govDeductions = deductions.filter((d) => d.source === "GOV");
  const loanDeductions = deductions.filter((d) => d.source === "LOAN");

  const earningAdjustments = manualAdjustments.filter(
    (a) => a.effect === "ADD" && Number(a.amount) > 0
  );

  const manualDeductions = manualAdjustments.filter(
    (a) => a.effect === "DEDUCT" && Number(a.amount) > 0
  );

  /* ================= PAY VALUES ================= */
  const basicPay = Number(source.quincena_rate || 0);
  const grossEarnings = Number(source.total_earnings || 0);
  const totalDeductions = Number(source.total_deductions || 0);
  const netPay = Number(source.net_pay || 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-md shadow-lg">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">TAGUM DOCTORS HOSPITAL INC.</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* EMPLOYEE INFO */}
        <div className="px-6 py-4 text-sm grid grid-cols-2 gap-2 border-b">
          <div><b>Employee:</b> {payslip.full_name}</div>
          <div><b>Employee No:</b> {payslip.employee_no}</div>
          <div><b>Department:</b> {payslip.department}</div>
          <div><b>Payroll Code:</b> {payslip.paycode}</div>
          <div>
            <b>Period:</b>{" "}
            {new Date(payslip.period_start).toLocaleDateString()} –{" "}
            {new Date(payslip.period_end).toLocaleDateString()}
          </div>
          <div><b>Transaction:</b> {payslip.transaction_code}</div>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 grid grid-cols-2 gap-6">
          {/* EARNINGS */}
          <div>
            <h3 className="font-semibold mb-2">EARNINGS</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td>Basic Pay</td>
                  <td className="text-right">{basicPay.toLocaleString()}</td>
                </tr>

                {earningAdjustments.map((e, i) => (
                  <tr key={i}>
                    <td>{e.label}</td>
                    <td className="text-right">{Number(e.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DEDUCTIONS */}
          <div>
            <h3 className="font-semibold mb-2">DEDUCTIONS</h3>
            <table className="w-full text-sm">
              <tbody>
                {govDeductions.map((d, i) => (
                  <tr key={i}>
                    <td>{d.deduction_type}</td>
                    <td className="text-right">{Number(d.amount).toLocaleString()}</td>
                  </tr>
                ))}

                {loanDeductions.map((d, i) => (
                  <tr key={i}>
                    <td>{d.deduction_type}</td>
                    <td className="text-right">{Number(d.amount).toLocaleString()}</td>
                  </tr>
                ))}

                {manualDeductions.map((d, i) => (
                  <tr key={i}>
                    <td>{d.label}</td>
                    <td className="text-right">{Number(d.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="px-6 py-4 border-t text-sm">
          <div className="flex justify-between">
            <span>Gross Earnings</span>
            <b>{grossEarnings.toLocaleString()}</b>
          </div>
          <div className="flex justify-between">
            <span>Total Deductions</span>
            <b>{totalDeductions.toLocaleString()}</b>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2">
            <span>TAKE HOME PAY</span>
            <span>{netPay.toLocaleString()}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t flex justify-end">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-secondary text-white rounded"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
