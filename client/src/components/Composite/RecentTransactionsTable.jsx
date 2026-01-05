import { useState, useMemo } from "react";

const ACTION_OPTIONS = ["ALL", "ADD", "EDIT", "APPROVE", "REJECT"];
const STATUS_OPTIONS = ["ALL", "IN_PROGRESS", "COMPLETED", "PENDING", "ERROR"];

const STATUS_STYLE = {
  IN_PROGRESS: "text-yellow-600 bg-yellow-100",
  COMPLETED: "text-green-600 bg-green-100",
  PENDING: "text-blue-600 bg-blue-100",
  ERROR: "text-red-600 bg-red-100",
};

export default function RecentTransactionsTable({ transactions = [] }) {
  const [actionFilter, setActionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const actionMatch =
        actionFilter === "ALL" || t.action === actionFilter;
      const statusMatch =
        statusFilter === "ALL" || t.status === statusFilter;

      return actionMatch && statusMatch;
    });
  }, [transactions, actionFilter, statusFilter]);

  return (
    <div className="bg-bg rounded-md shadow-md">

      {/* HEADER / FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 py-4 border-b">

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
          >
            {ACTION_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a === "ALL" ? "All Actions" : a}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Statuses" : s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bgshade text-left">
            <tr>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Entity</th>
              <th className="px-6 py-3">Reference</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td className="px-6 py-4">
                  <p className="font-medium">{t.actor.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.actor.department}
                  </p>
                </td>

                <td className="px-6 py-4">{t.action}</td>
                <td className="px-6 py-4">{t.entity}</td>
                <td className="px-6 py-4">{t.reference}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[t.status]}`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(t.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}

            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden divide-y">
        {filteredTransactions.map((t) => (
          <div key={t.id} className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{t.actor.name}</p>
                <p className="text-xs text-gray-500">
                  {t.actor.department}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[t.status]}`}
              >
                {t.status.replace("_", " ")}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              {t.action} • {t.entity}
            </p>

            <div className="flex justify-between text-xs text-gray-500">
              <span>{t.reference}</span>
              <span>{new Date(t.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
