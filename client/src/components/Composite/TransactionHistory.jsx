import React from "react";
import Button from "../UI/Button";
import pfpimg from "../../assets/ds1232.jpg";

// TEMP MOCK DATA
const transactions = [
  {
    id: 1,
    name: "Arlene McCoy",
    department: "Nursing Department",
    date: "Nov 18, 2025",
    time: "08:00 AM",
    amount: "₱1,546.12",
    date2: "17 Nov 2025",
  },
  {
    id: 2,
    name: "Savannah Nguyen",
    department: "HR Department",
    date: "Nov 18, 2025",
    time: "08:00 AM",
    amount: "₱1,546.12",
    date2: "17 Nov 2025",
  },
  // Add more...
];

export default function TransactionHistory({ onClick }) {
  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-heading text-primary text-lg font-medium">
          Recent Transactions
        </h3>

        <button className="font-body text-sm text-secondary font-medium">
          See All
        </button>
      </div>

      {/* TRANSACTION LIST */}
      <div className="flex flex-col divide-y">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between py-4"
          >
            {/* LEFT: PROFILE + NAME + DEPT */}
            <div className="flex gap-3 items-center">
              <img
                src={pfpimg}
                className="w-10 h-10 rounded-full object-cover"
                alt=""
              />

              <div className="flex flex-col">
                <p className="text-sm font-heading text-fontc">{t.name}</p>
                <p className="text-xs text-gray-500 font-heading">
                  {t.department}
                </p>
              </div>
            </div>

            {/* MIDDLE: DATE + TIME (HIDDEN ON MOBILE) */}
            <div className="hidden md:flex flex-col text-right">
              <p className="text-sm font-heading text-fontc">{t.date}</p>
              <p className="text-xs text-gray-500 font-heading">{t.time}</p>
            </div>

            {/* AMOUNT + SECOND DATE (HIDDEN ON MOBILE) */}
            <div className="hidden md:flex flex-col text-right">
              <p className="text-sm font-heading text-fontc">{t.amount}</p>
              <p className="text-xs text-gray-500 font-heading">{t.date2}</p>
            </div>

            {/* BUTTON (MOBILE) */}
            <div className="md:hidden">
              <Button onClick={onClick}>View Details</Button>
            </div>

            {/* BUTTON (DESKTOP) */}
            <div className="hidden md:block">
              <Button onClick={onClick}>View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
