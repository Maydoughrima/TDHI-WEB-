import { FaRegCalendarMinus } from "react-icons/fa";

/**
 * PendingLeaveRequestCard
 *
 * Backend-ready props:
 * - pendingTotal: total pending leave requests
 * - forEvaluation: requests waiting for approver
 * - approved: already approved (for context)
 */
export default function PendingLeaveRequestCard({
  pendingTotal = 0,
  forEvaluation = 0,
  approved = 0,
}) {
  return (
    <div className="bg-bg rounded-md shadow-md p-5 flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <FaRegCalendarMinus className="text-lg text-complimentary" />
        <p className="font-heading text-sm text-gray-500">
          Pending Leave Request
        </p>
      </div>

      {/* MAIN COUNT */}
      <div>
        <h2 className="font-heading font-semibold text-3xl text-primary">
          {pendingTotal}
        </h2>
      </div>

      {/* FOOTER DETAILS */}
      <div className="flex justify-between text-xs text-gray-500 mt-auto">
        <span>For evaluation: {forEvaluation}</span>
        <span>Approved: {approved}</span>
      </div>

    </div>
  );
}
