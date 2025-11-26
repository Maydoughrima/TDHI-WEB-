import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

export default function PayrollFormModal({ isOpen, onClose, onSubmit }) {
  const [monthEnd, setMonthEnd] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lastPay, setLastPay] = useState("No"); // default to No

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      monthEnd,
      startDate,
      endDate,
      lastPay,
    });

    // Reset fields
    setMonthEnd("");
    setStartDate("");
    setEndDate("");
    setLastPay("No");

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 font-heading text-primary text-center">
                Generate Payroll
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 font-medium text-fontc">Month End</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary p-2 text-fontc"
                    value={monthEnd}
                    onChange={(e) => setMonthEnd(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-fontc ">
                    Starting Date
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary  p-2 text-fontc"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-fontc">Ending Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary  p-2 text-fontc"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-fontc">Last Pay</label>
                  <select
                    className="w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary p-2 text-fontc"
                    value={lastPay}
                    onChange={(e) => setLastPay(e.target.value)}
                    required
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-fontc rounded-lg bg-gray-200 shadow-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-bg rounded-lg bg-accent text-white shadow-md"
                >
                  Process
                </button>   
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
