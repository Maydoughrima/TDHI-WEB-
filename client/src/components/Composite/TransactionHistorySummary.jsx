import { FiActivity } from "react-icons/fi";

/**
 * TransactionSummaryCard
 *
 * Backend-ready props:
 * - total: total number of transactions
 * - created: created records
 * - edited: edited records
 * - approved: approved actions
 * - lastActivity: string or timestamp
 */
export default function TransactionHistorySummary({
  total = 0,
  created = 0,
  edited = 0,
  approved = 0,
  lastActivity = "—",
}) {
  return (
    <div className="bg-bg rounded-md shadow-md p-5 flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <FiActivity className="text-lg text-primary" />
        <p className="font-heading text-sm text-gray-500">
          Transaction Summary
        </p>
      </div>

      {/* TOTAL */}
      <div>
        <h2 className="font-heading font-semibold text-3xl text-primary">
          {total}
        </h2>
        <p className="text-xs text-gray-400">
          Total changes this period
        </p>
      </div>

      {/* BREAKDOWN */}
      <div className="grid grid-cols-3 gap-3 text-xs text-gray-500">
        <div>
          <p className="font-medium text-primary">{created}</p>
          <p>Created</p>
        </div>
        <div>
          <p className="font-medium text-primary">{edited}</p>
          <p>Edited</p>
        </div>
        <div>
          <p className="font-medium text-primary">{approved}</p>
          <p>Approved</p>
        </div>
      </div>

      {/* FOOTER */}
      <p className="text-[11px] text-gray-400 mt-auto">
        Last activity: {lastActivity}
      </p>
    </div>
  );
}
