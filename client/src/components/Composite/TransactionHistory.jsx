import React from "react";
import Button from "../UI/Button";
import { statusMeta } from "../../data/statusMeta.js";
import { useNavigate } from "react-router-dom";
import pfpimg from "../../assets/ds1232.jpg";

// TEMP MOCK DATA
export default function TransactionHistory({
  transactions = [],
  onOpen,
}) {

  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-heading text-primary text-lg font-medium">
          Recent Transactions
        </h3>
        <Button 
        className="text-sm text-secondary font-medium shadow-none"
        onClick={() => navigate("/user/transactions")}
        >
          See All
        </Button>
      </div>

      {/* LIST */}
      <div className="flex flex-col divide-y">
        {transactions.map((t) => {
          const meta = statusMeta[t.status];

          return (
            <div
              key={t.id}
              className="flex items-center justify-between py-4 gap-4"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <img
                  src={t.actor.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />

                <div>
                  <p className="text-sm font-heading">
                    {t.actor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.actor.department}
                  </p>
                </div>
              </div>

              {/* MIDDLE */}
              <div className="hidden md:flex flex-col text-right">
                <p className="text-sm">
                  {new Date(t.timestamp).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(t.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {/* STATUS */}
              <div className="hidden md:flex flex-col text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  <span className={`text-sm ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {t.referenceCode}
                </p>
              </div>

              {/* ACTION */}
              <Button
                onClick={() => onOpen(t)}
                className="border border-fontc shadow-sm text-fontc"
              >
                Open
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}