import { useEffect, useState } from "react";
import { LiaEyeSolid } from "react-icons/lia";
import { transactions as mockTransactions } from "../../data/transactions";
import { LuPrinter } from "react-icons/lu";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);

  // Fetch payroll data from backend API
  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Payroll Period</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date Generated</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">No. of Employees</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Earnings</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Deductions</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Net Pay</th>
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
                <td className="px-4 py-2 text-sm text-fontc">{transaction.id}</td>
                <td className="px-4 py-2 text-sm text-fontc">{transaction.payrollPeriod}</td>
                <td className="px-4 py-2 text-sm text-fontc">{transaction.dateGenerated}</td>
                <td className="px-4 py-2 text-sm text-fontc">{transaction.numOfEmployees}</td>
                <td className="px-4 py-2 text-sm text-fontc">{transaction.totalEarnings}</td>
                <td className="px-4 py-2 text-sm text-fontc">{transaction.totalDeductions}</td>
                <td className="px-4 py-2 text-sm text-fontc">{transaction.totalNetPay}</td>
                <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                  <button className="text-accent hover:text-blue-700">
                    <LiaEyeSolid  className="text-xl"/>
                  </button>
                  <button className="text-accent hover:text-blue-700">
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
