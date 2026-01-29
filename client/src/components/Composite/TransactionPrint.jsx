import { useEffect } from "react";

export default function TransactionPrint({ transaction, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => {
      window.print();
      onDone?.();
    }, 300);

    return () => clearTimeout(t);
  }, []);

  if (!transaction) return null;

  return (
    <div id="transaction-print" className="print-root">
      <div className="print-wrapper">
        {/* HEADER */}
        <div className="print-header">
          <h1>TAGUM DOCTORS HOSPITAL INC.</h1>
          <p className="subtitle">Payroll Transaction Summary</p>
        </div>

        {/* META */}
        <div className="print-meta">
          <div>
            <span>Transaction ID</span>
            <strong>{transaction.transaction_code}</strong>
          </div>

          <div>
            <span>Date Generated</span>
            <strong>
              {new Date(transaction.date_generated).toLocaleDateString()}
            </strong>
          </div>
        </div>

        {/* PERIOD */}
        <div className="print-period">
          <span>Payroll Period</span>
          <strong>
            {new Date(transaction.period_start).toLocaleDateString()} –{" "}
            {new Date(transaction.period_end).toLocaleDateString()}
          </strong>
        </div>

        {/* SUMMARY TABLE */}
        <table className="print-table">
          <thead>
            <tr>
              <th>No. of Employees</th>
              <th>Total Earnings</th>
              <th>Total Deductions</th>
              <th>Total Net Pay</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{transaction.employee_count}</td>
              <td>{Number(transaction.total_earnings).toLocaleString()}</td>
              <td>{Number(transaction.total_deductions).toLocaleString()}</td>
              <td className="net-pay">
                {Number(transaction.total_net_pay).toLocaleString()}
              </td>
            </tr>
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
