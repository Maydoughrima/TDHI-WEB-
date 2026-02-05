import { useEffect, useState } from "react";
import { LuPrinter } from "react-icons/lu";
import TransactionPrint from "./TransactionPrint";

export default function TransactionsTable({ search = "" }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [printTransaction, setPrintTransaction] = useState(null);

  /* ================= FETCH PAYROLL TRANSACTIONS ================= */
  useEffect(() => {
    let mounted = true;

    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payroll-transactions");
        const json = await res.json();

        if (!mounted) return;
        setTransactions(json.success ? json.data : []);
      } catch (err) {
        console.error("Failed to load payroll transactions:", err);
        if (mounted) setTransactions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTransactions();
    return () => (mounted = false);
  }, []);

  /* ================= GLOBAL SEARCH ================= */
  const filteredRows = transactions.filter((t) => {
    if (!search) return true;

    const q = search.toLowerCase();

    return (
      t.transaction_code?.toLowerCase().includes(q) ||
      String(t.employee_count).includes(q) ||
      String(t.total_earnings).includes(q) ||
      String(t.total_deductions).includes(q) ||
      String(t.total_net_pay).includes(q) ||
      new Date(t.period_start).toLocaleDateString().toLowerCase().includes(q) ||
      new Date(t.period_end).toLocaleDateString().toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* ================= PRINT LAYER ================= */}
      {printTransaction && (
        <TransactionPrint
          transaction={printTransaction}
          onDone={() => setPrintTransaction(null)}
        />
      )}

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Transaction ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Payroll Period
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Date Generated
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Employees
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Earnings
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Deductions
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Net Pay
              </th>
              <th className="px-4 py-2 text-center text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                  Loading transactions...
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredRows.map((t) => (
                <tr key={t.transaction_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono">
                    {t.transaction_code}
                  </td>

                  <td className="px-4 py-2 text-sm">
                    {new Date(t.period_start).toLocaleDateString()} –{" "}
                    {new Date(t.period_end).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-2 text-sm">
                    {new Date(t.date_generated).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-2 text-sm">
                    {t.employee_count}
                  </td>

                  <td className="px-4 py-2 text-sm tabular-nums">
                    {Number(t.total_earnings).toLocaleString()}
                  </td>

                  <td className="px-4 py-2 text-sm tabular-nums">
                    {Number(t.total_deductions).toLocaleString()}
                  </td>

                  <td className="px-4 py-2 text-sm font-medium tabular-nums">
                    {Number(t.total_net_pay).toLocaleString()}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <button
                      className="text-accent hover:text-blue-700"
                      onClick={() => setPrintTransaction(t)}
                    >
                      <LuPrinter />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
