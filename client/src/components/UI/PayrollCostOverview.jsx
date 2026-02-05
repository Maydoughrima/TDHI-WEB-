import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Button from "../UI/Button";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function PayrollCostOverview({
  expenses = 0,
  deductions = 0,
  dateLabel = "From 1–13 December, 2025",
  rangeLabel = "Last Payroll",

  // 🔽 NEW PROPS
  payrollOptions = [],
  isDropdownOpen = false,
  onRangeClick,
  onSelectPayroll,
}) {
  const data = [
    { name: "Expenses", value: expenses },
    { name: "Deductions", value: deductions },
  ];

  const COLORS = ["#03045e", "#0077B6"];
  const total = expenses + deductions;
  const percent = total > 0 ? Math.round((expenses / total) * 100) : 0;

  return (
    <div className="relative bg-bg rounded-md shadow-md px-6 py-5 h-full flex flex-col">

      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between mb-6 relative">
        <div>
          <p className="font-heading text-lg font-medium text-primary">
            Payroll Cost Overview
          </p>
          <p className="text-sm text-gray-500 mt-1">{dateLabel}</p>
        </div>

        {/* BUTTON + DROPDOWN */}
        <div className="relative">
          <Button
            onClick={onRangeClick}
            className="flex items-center gap-1 bg-secondary text-bg px-4 py-2 rounded-xl shadow-sm"
          >
            {rangeLabel}
            <RiArrowDropDownLine className="text-xl" />
          </Button>

          {/* DROPDOWN LIST */}
          {isDropdownOpen && payrollOptions.length > 0 && (
            <div className="absolute right-0 mt-2 w-56 bg-bg border border-gray-200 rounded-md shadow-lg z-50">
              {payrollOptions.map((payroll) => (
                <button
                  key={payroll.payroll_file_id}
                  onClick={() => onSelectPayroll(payroll)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                >
                  {payroll.paycode}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= CENTER CONTENT ================= */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-14">

          {/* DONUT */}
          <div className="relative w-[260px] h-[260px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius="70%"
                  outerRadius="100%"
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER PERCENT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white w-24 h-24 rounded-full shadow-md flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">
                  {percent}%
                </span>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-primary rounded" />
              <div>
                <p className="text-sm text-gray-500">Earnings</p>
                <p className="text-xl font-medium text-primary">
                  {expenses.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-secondary rounded" />
              <div>
                <p className="text-sm text-gray-500">Deductions</p>
                <p className="text-xl font-medium text-primary">
                  {deductions.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
