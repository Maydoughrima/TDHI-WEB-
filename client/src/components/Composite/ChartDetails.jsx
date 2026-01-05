import React from "react";

export default function ChartDetails({
  expenses = 0,
  deductions = 0,
}) {
  return (
    <div className="flex flex-col gap-6">

      <div className="border-l-4 border-l-primary pl-4">
        <p className="text-gray-500 text-sm">Expenses</p>
        <h2 className="text-2xl font-medium text-primary">
          {expenses.toLocaleString()}
        </h2>
      </div>

      <div className="border-l-4 border-l-primary pl-4">
        <p className="text-gray-500 text-sm">Deductions</p>
        <h2 className="text-2xl font-medium text-primary">
          {deductions.toLocaleString()}
        </h2>
      </div>

    </div>
  );
}
