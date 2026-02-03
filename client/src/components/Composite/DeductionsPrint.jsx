import { useEffect } from "react";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

const money = (v) =>
  Number(v || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

        {/* TABLE — FULLY ALIGNED WITH LEDGER */}
        <table className="print-table">
          <thead>
            <tr>
              <th>Department</th>

              {/* GOVERNMENT */}
              <th>SSS</th>
              <th>PhilHealth</th>
              <th>HDMF Prem</th>

              {/* SSS LOANS */}
              <th>SSS Salary Loan</th>
              <th>SSS Calamity Loan</th>

              {/* PAG-IBIG */}
              <th>HDMF Loan</th>
              <th>HDMF Calamity Loan</th>

              {/* COMPANY / MANUAL */}
              <th>Late</th>
              <th>Hosp. Acc</th>
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

                {/* GOVERNMENT */}
                <td>{money(r.SSS)}</td>
                <td>{money(r.PHILHEALTH)}</td>
                <td>{money(r.HDMF_PREM)}</td>

                {/* SSS LOANS */}
                <td>{money(r.SSS_SALARY_LOAN)}</td>
                <td>{money(r.SSS_CALAMITY_LOAN)}</td>

                {/* PAG-IBIG */}
                <td>{money(r.HDMF_LOAN)}</td>
                <td>{money(r.PAGIBIG_CALAMITY_LOAN)}</td>
                
                {/* COMPANY / MANUAL */}
                <td>{money(r.LATE)}</td>
                <td>{money(r.HOSPITAL_ACCOUNTS)}</td>
                <td>{money(r.CANTEEN)}</td>
                <td>{money(r.HSBC)}</td>
                <td>{money(r.COOP)}</td>
                <td>{money(r.LEAVE)}</td>
                <td>{money(r.OTHERS)}</td>

                <td className="net-pay">{money(r.TOTAL)}</td>
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
