import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function PayrollSummaryChart({ pending, completed, employees }) {
  // Data going into the chart
  const data = [
    { name: "Pending Payroll", value: pending },
    { name: "Completed Payroll", value: completed },
    { name: "Employees", value: employees },
  ]; 

  // Colors similar to your sample image
  const COLORS = ["#79C2FF", "#0F5CAD", "#3D8ABF"];

  // Compute total percentage (example)
  const total = pending + completed + employees;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="flex-col relative w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="70%"
            outerRadius="90%"
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Percentage bubble in the center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-full shadow-lg w-20 h-20 flex items-center justify-center"
      >
        <p className="text-xl font-semibold">{percent}%</p>
      </div>

    </div>
  );
}
