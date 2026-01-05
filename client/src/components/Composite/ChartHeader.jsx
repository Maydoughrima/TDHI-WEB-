import React from "react";
import Button from "../UI/Button";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function ChartHeader({
  dateLabel,
  rangeLabel,
  onRangeClick,
}) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-primary">
          Payroll Cost Overview
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {dateLabel}
        </p>
      </div>

      <Button
        onClick={onRangeClick}
        className="flex items-center gap-1 bg-secondary text-bg px-4 py-2 rounded-xl shadow-sm"
      >
        {rangeLabel}
        <RiArrowDropDownLine className="text-xl" />
      </Button>
    </div>
  );
}
