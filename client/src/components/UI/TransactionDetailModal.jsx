import { X } from "lucide-react";

const STATUS_META = {
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    hint: "Needs attention",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-600",
    bg: "bg-green-100",
    hint: "Safe",
  },
  PENDING: {
    label: "Pending Approval",
    color: "text-blue-600",
    bg: "bg-blue-100",
    hint: "Decision needed",
  },
  ERROR: {
    label: "Rejected / Error",
    color: "text-red-600",
    bg: "bg-red-100",
    hint: "Urgent",
  },
};

export default function TransactionDetailModal({ transaction, onClose }) {
  if (!transaction) return null;

  const meta = STATUS_META[transaction.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-bg rounded-md shadow-lg w-full max-w-lg">

        {/* HEADER */}
        <div className="flex justify-between items-start px-6 py-4 border-b">
          <div>
            <h3 className="font-heading text-lg font-medium text-primary">
              {transaction.actor.name}
            </h3>
            <p className="text-sm text-gray-500">
              {transaction.action} • {transaction.entity}
            </p>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* STATUS */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${meta.bg} ${meta.color}`}
            >
              {meta.label}
            </span>
            <span className="text-sm text-gray-500">
              {meta.hint}
            </span>
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Department</p>
              <p className="font-medium">{transaction.actor.department}</p>
            </div>

            <div>
              <p className="text-gray-400">Reference</p>
              <p className="font-medium">{transaction.reference}</p>
            </div>

            <div className="col-span-2">
              <p className="text-gray-400">Date & Time</p>
              <p className="font-medium">
                {new Date(transaction.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm border rounded-md"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="px-4 py-2 text-sm bg-primary text-bg rounded-md"
          >
            View Full Record
          </button>
        </div>
      </div>
    </div>
  );
}
