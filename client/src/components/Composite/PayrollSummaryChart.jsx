import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function PayrollSummaryChart({
  expenses = 0,
  deductions = 0,
}) {
  const data = [
    { name: "Expenses", value: expenses },
    { name: "Deductions", value: deductions },
  ];

  const COLORS = ["#0F5CAD", "#79C2FF"];
  const total = expenses + deductions;
  const percent = total ? Math.round((expenses / total) * 100) : 0;

  return (
    <div className="relative w-[260px] h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="65%"
            outerRadius="95%"
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white w-24 h-24 rounded-full shadow-lg flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary">
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
}
