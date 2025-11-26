import { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);

  // Fetch payroll data from backend API
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch("/api/transactions"); // replace with your API endpoint
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Payroll Period</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date Generated</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">No. of Employees</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Total Earnings</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Total Deductions</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Total Net Pay</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                No Transactions.
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.transactionID} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.transactionID}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.payrollPeriod}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.dateGenerated}</td>
                <td className="px-4 py-2 text-sm text-gray-700 text-right">{transaction.numofEmployees}</td>
                <td className="px-4 py-2 text-sm text-gray-700 text-right">{transaction.totalEarnings}</td>
                <td className="px-4 py-2 text-sm text-gray-700 text-right">{transaction.totalDeductions}</td>
                <td className="px-4 py-2 text-sm text-gray-700 text-right">{transaction.totalNetPay}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaPrint />
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
