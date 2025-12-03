import { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { payrolls as mockPayrolls } from "../../data/payroll";

export default function PayrollTable() {
  const [payrolls, setPayrolls] = useState([]);

  // Fetch payroll data from backend API
  useEffect(() => {
    setPayrolls(mockPayrolls);
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Paycode</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date Generated</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Month End</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Period Start</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Period End</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">No. of Days</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Last Pay</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payrolls.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                No payrolls found.
              </td>
            </tr>
          ) : (
            payrolls.map((payroll) => (
              <tr key={payroll.paycode} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-fontc">{payroll.payCode}</td>
                <td className="px-4 py-2 text-sm text-fontc">{payroll.dateGenerated}</td>
                <td className="px-4 py-2 text-sm text-fontc">{payroll.monthEnd}</td>
                <td className="px-4 py-2 text-sm text-fontc">{payroll.periodStart}</td>
                <td className="px-4 py-2 text-sm text-fontc">{payroll.periodEnd}</td>
                <td className="px-4 py-2 text-sm text-fontc">{payroll.numOfDays}</td>
                <td className="px-4 py-2 text-sm text-fontc">{payroll.lastPay}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-accent hover:text-blue-700">
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
