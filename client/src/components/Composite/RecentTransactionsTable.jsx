import { useEffect, useState } from "react";
import { fetchTransactions } from "../../../../server/api/transactionsAPI";

// Dropdown options
const ACTION_OPTIONS = ["ALL", "ADD", "EDIT", "APPROVE", "REJECT", "LOGIN"];
const STATUS_OPTIONS = ["ALL", "IN_PROGRESS", "COMPLETED", "PENDING", "ERROR"];

// Status badge colors
const STATUS_STYLE = {
  IN_PROGRESS: "text-yellow-600 bg-yellow-100",
  COMPLETED: "text-green-600 bg-green-100",
  PENDING: "text-blue-600 bg-blue-100",
  ERROR: "text-red-600 bg-red-100",
};

export default function RecentTransactionsTable() {
  // 🔹 Data state
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  // 🔹 Filters
  const [actionFilter, setActionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 🔹 Pagination
  const [page, setPage] = useState(0);
  const limit = 20;

  // 🔹 Loading state
  const [loading, setLoading] = useState(false);

  /**
   * Fetch transactions whenever:
   * - actionFilter changes
   * - statusFilter changes
   * - page changes
   */
  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      try {
        const response = await fetchTransactions({
          action: actionFilter,
          status: statusFilter,
          limit,
          offset: page * limit,
        });

        setTransactions(response?.data || []);
        setTotal(response?.meta?.total || 0);
      } catch (err) {
        console.error("Transaction fetch failed:", err);
        setTransactions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [actionFilter, statusFilter, page]);

  return (
    <div className="bg-bg rounded-md shadow-md">
      {/* ================= FILTER HEADER ================= */}
      <div className="flex flex-col md:flex-row gap-4 px-4 py-4 border-b">
        <select
          value={actionFilter}
          onChange={(e) => {
            setPage(0); // reset page when filter changes
            setActionFilter(e.target.value);
          }}
          className="border rounded-md px-3 py-2 text-sm"
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
            setPage(0); // reset page when filter changes
            setStatusFilter(e.target.value);
          }}
          className="border rounded-md px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All Statuses" : s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
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
                  <td className="px-6 py-4">{t.reference_code}</td>
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

      {/* ================= PAGINATION ================= */}
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
