import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Button from "./Button";

const modalRoot = document.getElementById("modal-root");

export default function AddDeductionsModal({
  isOpen,
  onClose,
  employeeId,
  onSuccess, // callback after add (optional)
}) {
  const [form, setForm] = useState({
    type: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.type || !form.amount) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      /**
       * MOCK API (FOR NOW)
       * ------------------------
       * POST /api/employees/:id/deductions
       */
      await new Promise((resolve) => setTimeout(resolve, 600));

      console.log("ADD DEDUCTION:", {
        employeeId,
        type: form.type,
        amount: Number(form.amount),
      });

      // reset
      setForm({ type: "", amount: "" });
      setLoading(false);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to add deduction");
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary text-center">
              Add Deduction
            </h2>

            <Button
              type="button"
              className="border border-gray-300 shadow-sm"
              onClick={onClose}
            >
              <IoClose 
              className="text-primary"
              />
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          {/* FORM */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Deduction Type
              </label>
              <input
                type="text"
                value={form.type}
                onChange={(e) =>
                  handleChange("type", e.target.value)
                }
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="e.g. SSS, Loan, Tax"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  handleChange("amount", e.target.value)
                }
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              className="border border-gray-300 shadow-sm text-primary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-secondary text-bg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Deduction"}
            </Button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>,
    modalRoot
  );
}
