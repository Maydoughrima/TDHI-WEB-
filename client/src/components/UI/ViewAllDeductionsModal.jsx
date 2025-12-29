import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { getEmployeeDeductions } from "../../data/mockAPI/getEmployeeDeductions";

export default function ViewAllDeductionsModal({
  isOpen,
  onClose,
  employeeId,
}) {
  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !employeeId) return;

    setLoading(true);
    setError(null);

    getEmployeeDeductions(employeeId)
      .then((data) => {
        setDeductions(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load deductions");
        setLoading(false);
      });
  }, [isOpen, employeeId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            absolute inset-0 z-20
            flex items-center justify-center
            bg-white/60 backdrop-blur-sm
            rounded-md
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              bg-white rounded-xl shadow-xl
              w-full max-w-md
              p-6
            "
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading text-primary">
                All Deductions
              </h3>

              <Button
                className="border border-gray-300"
                onClick={onClose}
              >
                Close
              </Button>
            </div>

            {/* CONTENT */}
            {loading && (
              <p className="text-center text-gray-500">
                Loading deductions...
              </p>
            )}

            {error && (
              <p className="text-center text-red-500">{error}</p>
            )}

            {!loading && !error && deductions.length === 0 && (
              <p className="text-center text-gray-500">
                No deductions found
              </p>
            )}

            {!loading && !error && (
              <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
                {deductions.map((d) => (
                  <div
                    key={d.id}
                    className="flex justify-between bg-gray-50 p-3 rounded-md border"
                  >
                    <span className="font-medium">{d.type}</span>
                    <span className="font-semibold text-secondary">
                      ₱{d.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
