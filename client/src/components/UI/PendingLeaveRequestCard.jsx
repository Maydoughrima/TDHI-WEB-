import { FaRegCalendarMinus } from "react-icons/fa";

/**
 * PendingLeaveRequestCard
 *
 * Props (from backend):
 * - pendingTotal: total PENDING leave requests
 * - approved: total APPROVED leave requests
 */
export default function PendingLeaveRequestCard({
  pendingTotal = 0,
  approved = 0,
}) {
  return (
    <div className="bg-bg rounded-md shadow-md p-5 flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <FaRegCalendarMinus className="text-lg text-primary" />
        <p className="font-heading text-sm text-gray-500">
          Pending Leave Requests
        </p>
      </div>

      {/* MAIN COUNT */}
      <div>
        <h2 className="font-heading font-semibold text-3xl text-primary">
          {pendingTotal}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Awaiting approval
        </p>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end text-xs text-gray-500 mt-auto">
        <span>Approved: {approved}</span>
      </div>
    </div>
  );
}
