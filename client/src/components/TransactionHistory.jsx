import React from "react";
import pfpimg from "../assets/ds1232.jpg";

export default function TransactionHistory() {
  return (
    <div className="flex flex-col gap-6">
      <div className="page-label flex justify-between border-b-2 pb-2">
        <h3 className="font-heading text-primary text-lg font-medium">
          Transaction History
        </h3>

        <button className="view-full-trans font-body text-sm text-secondary font-medium">
          See All
        </button>
      </div>

      <div className="trans-his flex flex-col">
        <div className="wrapper flex justify-between">
            <div className="emp-cred flex gap-2 ">
                <div className="emp-img w-10 h-13">
                    <img src={pfpimg} 
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div className="emp-dets flex flex-col">
                    <p className="emp-name text-sm font-heading text-fontc">Name</p>
                    <p className="emp-dept text-sm text-gray-500 font-heading">Department</p>
                </div>
            </div>

            <div className="emp-date md:flex gap-2 hidden">
                <div className="emp-dets flex flex-col">
                    <p className="emp-month text-sm font-heading text-fontc">Date</p>
                    <p className="emp-time text-sm text-gray-500 font-heading">Time</p>
                </div>
            </div>

            <div className="emp-lastaccessed md:flex gap-2 hidden">
                <div className="emp-dets flex flex-col">
                    <p className="emp-mon text-sm font-heading text-fontc">Money</p>
                    <p className="emp-date text-sm text-gray-500 font-heading">Date</p>
                </div>
            </div>

            <div className="cta-dets flex gap-2 md:hidden">
                <div className="emp-dets flex">
                    <button className="bg-secondary text-sm rounded text-bg p-2">
                        View Details
                    </button>
                </div>
            </div>

            <div className="hidden md:flex">
                <div className="emp-dets flex">
                    <button className="bg-secondary text-sm rounded text-bg p-2">
                        Button
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
