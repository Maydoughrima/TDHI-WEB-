import React from "react";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import pfpimg from "../../assets/ds1232.jpg";

// simple action → UI mapping
const actionMeta = {
  ADD: { label: "Created", color: "text-blue-600", dot: "bg-blue-500" },
  EDIT: { label: "Edited", color: "text-yellow-600", dot: "bg-yellow-500" },
  DELETE: { label: "Deleted", color: "text-red-600", dot: "bg-red-500" },
  LOGIN: { label: "Login", color: "text-green-600", dot: "bg-green-500" },
};

export default function TransactionHistory({ transactions = [] }) {
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
        {transactions.slice(0, 5).map((t) => {
          const meta = actionMeta[t.action] || {
            label: t.action,
            color: "text-gray-500",
            dot: "bg-gray-400",
          };

          return (
            <div
              key={t.id}
              className="grid grid-cols-[2fr_1fr_1fr] items-center py-4 gap-4"
            >
              {/* LEFT — ACTOR */}
              <div className="flex items-center gap-3">
                <img
                  src={pfpimg}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="avatar"
                />

                <div>
                  <p className="text-sm font-heading">
                    {t.actor_name || "System"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.actor_role || "—"}
                  </p>
                </div>
              </div>

              {/* CENTER — DATE */}
              <div className="hidden md:flex flex-col items-center justify-center text-center">
                <p className="text-sm leading-tight">
                  {new Date(t.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {new Date(t.created_at).toLocaleTimeString()}
                </p>
              </div>

              {/* RIGHT — STATUS */}
              <div className="hidden md:flex flex-col items-end justify-center text-right">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  <span className={`text-sm ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {t.entity}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
