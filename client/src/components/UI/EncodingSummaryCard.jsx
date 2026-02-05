import { SlGraph } from "react-icons/sl";

/**
 * Encoding Summary (Backend-ready)
 * Props are raw counts from backend
 */
export default function EncodingSummaryCard({
  totalEmployees = 0,
  pending = 0,
  completed = 0,
  paycode = "-", // ✅ NEW PROP
}) {
  const getPercent = (value) => {
    if (!totalEmployees) return 0;
    return Math.round((value / totalEmployees) * 100);
  };

  return (
    <div className="bg-secondary rounded-md shadow-md p-4 flex flex-col gap-4">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-2">
        <SlGraph className="text-bg text-lg" />
        <p className="text-bg font-heading text-sm">Encoding Summary</p>
      </div>

      {/* ================= PAYCODE ================= */}
      <p className="text-bg/80 text-xs font-mono -mt-2">
        Paycode: <span className="font-semibold text-bg">{paycode}</span>
      </p>

      {/* ================= PROGRESS LIST ================= */}
      <div className="flex flex-col gap-3">
        {/* EMPLOYEES */}
        <div>
          <div className="flex justify-between text-xs text-bg mb-1">
            <span>Employees</span>
            <span>{totalEmployees}</span>
          </div>
          <div className="w-full bg-bg/30 rounded-full h-2">
            <div className="bg-bg h-2 rounded-full" style={{ width: "100%" }} />
          </div>
        </div>

        {/* PENDING */}
        <div>
          <div className="flex justify-between text-xs text-bg mb-1">
            <span>Pending</span>
            <span>{pending}</span>
          </div>
          <div className="w-full bg-bg/30 rounded-full h-2">
            <div
              className="bg-complimentary h-2 rounded-full"
              style={{ width: `${getPercent(pending)}%` }}
            />
          </div>
        </div>

        {/* COMPLETED */}
        <div>
          <div className="flex justify-between text-xs text-bg mb-1">
            <span>Completed</span>
            <span>{completed}</span>
          </div>
          <div className="w-full bg-bg/30 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full"
              style={{ width: `${getPercent(completed)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= SCALE ================= */}
      <div className="flex justify-between text-[10px] text-bg/70 mt-1">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
