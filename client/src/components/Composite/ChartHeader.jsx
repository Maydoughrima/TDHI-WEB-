import React from "react";
import Button from "../UI/Button";
import { RiArrowDropDownLine } from "react-icons/ri";


export default function ChartHeader({onClick}) {
  return (
    <div className="card-wrapper flex justify-between items-center">
      <div className="card-header flex-col items-center gap-2 px-3">
        <p className="font-heading text-lg font-medium text-primary">
          Employee Category Breakdown
        </p>
        <p className="font-heading text-sm text-gray-500 mt-1">DATE</p>
      </div>

      <div className="cta-select-date">
        <Button 
        onClick={onClick}
        className="flex text-bg bg-secondary rounded-2xl border border-gray-200 shadow-sm"
        >Last 30 Days
        <RiArrowDropDownLine
        className="text-base"
        />
        </Button>
      </div>
    </div>
  );
}
