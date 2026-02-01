import { useEffect } from "react";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

export default function DeductionsPrint({ payroll, rows, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => {
      window.print();
      onDone?.();
    }, 300);

    return () => clearTimeout(t);
  }, []);

  if (!payroll || !rows?.length) return null;

  return (
    <div id="ledger-print" className="print-root">
      <div className="print-wrapper">
        {/* HEADER */}
        <div className="print-header">
          <h1>TAGUM DOCTORS HOSPITAL INC.</h1>
          <p className="subtitle">Payroll Deductions Ledger</p>
        </div>

        {/* META */}
        <div className="print-meta">
          <div>
            <span>Payroll Code</span>
            <strong>{payroll.paycode}</strong>
          </div>

          <div>
            <span>Date Generated</span>
            <strong>{formatDate(payroll.date_generated)}</strong>
          </div>
        </div>

        {/* PERIOD */}
        <div className="print-period">
          <span>Payroll Period</span>
          <strong>
            {formatDate(payroll.period_start)} –{" "}
            {formatDate(payroll.period_end)}
          </strong>
        </div>

        {/* TABLE */}
        <table className="print-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>SSS</th>
              <th>PhilHealth</th>
              <th>HDMF Prem</th>
              <th>SSS Loan</th>
              <th>PH Loan</th>
              <th>HDMF Loan</th>
              <th>Late</th>
              <th>Hosp Acc</th>
              <th>Canteen</th>
              <th>HSBC</th>
              <th>Coop</th>
              <th>Leave</th>
              <th>Others</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.department}>
                <td>{r.department}</td>
                <td>{r.SSS}</td>
                <td>{r.PHILHEALTH}</td>
                <td>{r.HDMF_PREM}</td>
                <td>{r.SSS_LOAN}</td>
                <td>{r.PHILHEALTH_LOAN}</td>
                <td>{r.HDMF_LOAN}</td>
                <td>{r.LATE}</td>
                <td>{r.HOSPITAL_ACCOUNTS}</td>
                <td>{r.CANTEEN}</td>
                <td>{r.HSBC}</td>
                <td>{r.COOP}</td>
                <td>{r.LEAVE}</td>
                <td>{r.OTHERS}</td>
                <td className="net-pay">{r.TOTAL}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER — MATCHES TransactionPrint */}
        <div className="print-footer">
          <div>
            <span>Prepared By</span>
            <div className="line" />
          </div>

          <div>
            <span>Approved By</span>
            <div className="line" />
          </div>
        </div>
      </div>
    </div>
  );
}
