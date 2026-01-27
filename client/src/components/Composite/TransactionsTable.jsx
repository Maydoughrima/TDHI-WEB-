import { useEffect, useState } from "react";
import { LuPrinter } from "react-icons/lu";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PAYROLL TRANSACTIONS (ACCURATE) ================= */
  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payroll-transactions");
        const json = await res.json();

        if (!isMounted) return;

        if (json.success) {
          setTransactions(json.data || []);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load payroll transactions:", err);
        setTransactions([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Transaction ID
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Payroll Period
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Date Generated
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              No. of Employees
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Total Earnings
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Total Deductions
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Total Net Pay
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
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
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                No finalized payroll transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.transaction_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-fontc font-mono">
                  {t.transaction_code}
                </td>

                <td className="px-4 py-2 text-sm text-fontc">
                  {new Date(t.period_start).toLocaleDateString()} –{" "}
                  {new Date(t.period_end).toLocaleDateString()}
                </td>

                <td className="px-4 py-2 text-sm text-fontc">
                  {new Date(t.date_generated).toLocaleDateString()}
                </td>

                <td className="px-4 py-2 text-sm text-fontc">
                  {t.employee_count}
                </td>

                <td className="px-4 py-2 text-sm text-fontc tabular-nums">
                  {Number(t.total_earnings).toLocaleString()}
                </td>

                <td className="px-4 py-2 text-sm text-fontc tabular-nums">
                  {Number(t.total_deductions).toLocaleString()}
                </td>

                <td className="px-4 py-2 text-sm text-fontc font-medium tabular-nums">
                  {Number(t.total_net_pay).toLocaleString()}
                </td>

                <td className="px-4 py-2 text-center flex items-center justify-center">
                  <button
                    className="text-accent hover:text-blue-700"
                    title="Print Payroll"
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
  );
}
