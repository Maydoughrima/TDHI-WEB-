import { useEffect } from "react";

export default function EarningsPrint({ payroll, rows = [], onDone }) {
  useEffect(() => {
    const t = setTimeout(() => {
      window.print();
      onDone?.();
    }, 300);

    return () => clearTimeout(t);
  }, []);

  if (!payroll) return null;

  return (
    <div id="ledger-print" className="print-root">
      <div className="print-wrapper">
        {/* HEADER */}
        <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
          TAGUM DOCTORS HOSPITAL INC.
        </h1>
        <p style={{ textAlign: "center", marginBottom: 12 }}>
          Payroll Earnings Ledger
        </p>

        {/* META */}
        <div className="print-meta">
          <div>
            <span>Payroll Code</span>
            <strong>{payroll.paycode}</strong>
          </div>
          <div>
            <span>Date Generated</span>
            <strong>{new Date().toLocaleDateString()}</strong>
          </div>
        </div>

        {/* PERIOD */}
        <div className="print-period">
          <span>Payroll Period</span>
          <strong>
            {new Date(payroll.period_start).toLocaleDateString()} –{" "}
            {new Date(payroll.period_end).toLocaleDateString()}
          </strong>
        </div>

        {/* TABLE */}
        <table className="print-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2}>No records found</td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.department}</td>
                  <td>
                    {Number(row.grossSalary || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* FOOTER */}
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
