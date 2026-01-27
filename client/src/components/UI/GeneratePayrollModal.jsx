import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function GeneratePayrollModal({ isOpen, onClose, onSubmit }) {
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [lastPay, setLastPay] = useState(false);

  const generatePaycode = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    return `PR-${year}-${rand}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      paycode: generatePaycode(),
      period_start: periodStart,
      period_end: periodEnd,
      last_pay: lastPay,
    });

    // Reset
    setPeriodStart("");
    setPeriodEnd("");
    setLastPay(false);
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
                Generate Payroll File
              </h2>

              <div className="flex flex-col gap-4">
                {/* PERIOD START */}
                <div>
                  <label className="block mb-1 font-medium text-fontc">
                    Period Start
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-2"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    required
                  />
                </div>

                {/* PERIOD END */}
                <div>
                  <label className="block mb-1 font-medium text-fontc">
                    Period End
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-2"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    required
                  />
                </div>

                {/* LAST PAY */}
                <div>
                  <label className="block mb-1 font-medium text-fontc">
                    Last Pay
                  </label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={lastPay ? "yes" : "no"}
                    onChange={(e) => setLastPay(e.target.value === "yes")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-accent text-white shadow-md"
                >
                  Generate
                </button>

                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
