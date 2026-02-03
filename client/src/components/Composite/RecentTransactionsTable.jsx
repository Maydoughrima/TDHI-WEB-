import { useEffect, useState } from "react";
import { fetchTransactions } from "../../../../server/api/transactionsAPI";

const ACTION_OPTIONS = ["ALL", "ADD", "EDIT", "DELETE", "LOGIN"];
const STATUS_OPTIONS = ["ALL", "IN_PROGRESS", "COMPLETED", "PENDING", "ERROR", "APPROVED"];

const STATUS_STYLE = {
  IN_PROGRESS: "text-yellow-600 bg-yellow-100",
  COMPLETED: "text-green-600 bg-green-100",
  PENDING: "text-blue-600 bg-blue-100",
  ERROR: "text-red-600 bg-red-100",
};

export default function RecentTransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  const [actionFilter, setActionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [page, setPage] = useState(0);
  const limit = 20;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchTransactions({
          action: actionFilter,
          status: statusFilter,
          limit,
          offset: page * limit,
        });

        setTransactions(res.data || []);
        setTotal(res.meta.total || 0);
      } catch {
        setTransactions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [actionFilter, statusFilter, page]);

  return (
    <div className="bg-bg rounded-md shadow-md">
      {/* FILTERS */}
      <div className="flex gap-4 px-4 py-4 border-b">
        <select
          value={actionFilter}
          onChange={(e) => {
            setPage(0);
            setActionFilter(e.target.value);
          }}
          className="border rounded px-3 py-2 text-sm"
        >
          {ACTION_OPTIONS.map((a) => (
            <option key={a} value={a}>
              {a === "ALL" ? "All Actions" : a}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(0);
            setStatusFilter(e.target.value);
          }}
          className="border rounded px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All Statuses" : s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bgshade text-left">
            <tr>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Entity</th>
              <th className="px-6 py-3">Affected Account</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Loading…
                </td>
              </tr>
            )}

            {!loading &&
              transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium">{t.actor_name}</p>
                    <p className="text-xs text-gray-500">{t.actor_role}</p>
                  </td>

                  <td className="px-6 py-4">{t.action}</td>
                  <td className="px-6 py-4">{t.entity}</td>

                  <td className="px-6 py-4">
                    {t.affected_employee_name ? (
                      <span className="font-medium text-primary">
                        {t.affected_employee_name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        STATUS_STYLE[t.status]
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}

            {!loading && transactions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center px-4 py-3 border-t">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">Page {page + 1}</span>

        <button
          disabled={(page + 1) * limit >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
