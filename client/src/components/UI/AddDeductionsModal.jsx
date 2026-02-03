import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Button from "./Button";

const modalRoot = document.getElementById("modal-root");

export default function AddDeductionsModal({
  isOpen,
  onClose,
  employeeId,
  onSuccess,
}) {
  const [form, setForm] = useState({
    loan_type: "",
    principal_amount: "",
    monthly_amortization: "",
    cutoff_behavior: "",
    start_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= AUTO CUTOFF RULES ================= */
  useEffect(() => {
    if (!form.loan_type) return;

    // ✅ FIRST CUTOFF ONLY
    if (
      form.loan_type === "SSS_LOAN" ||
      form.loan_type === "SSS_SALARY_LOAN" ||
      form.loan_type === "SSS_CALAMITY_LOAN" ||
      form.loan_type === "PHILHEALTH_LOAN"
    ) {
      setForm((prev) => ({
        ...prev,
        cutoff_behavior: "FIRST_CUTOFF_ONLY",
      }));
      return;
    }

    // ✅ SECOND CUTOFF ONLY
    if (
      form.loan_type === "PAGIBIG_LOAN" ||
      form.loan_type === "PAGIBIG_CALAMITY_LOAN"
    ) {
      setForm((prev) => ({
        ...prev,
        cutoff_behavior: "SECOND_CUTOFF_ONLY",
      }));
      return;
    }

    // ✅ COMPANY LOAN = MANUAL
    if (form.loan_type === "COMPANY_LOAN") {
      setForm((prev) => ({
        ...prev,
        cutoff_behavior: "",
      }));
    }
  }, [form.loan_type]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      setError("User session not found. Please re-login.");
      return;
    }

    if (
      !form.loan_type ||
      !form.monthly_amortization ||
      !form.cutoff_behavior ||
      !form.start_date
    ) {
      setError("Please complete all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/employees/${employeeId}/loans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          loan_type: form.loan_type, // ✅ unchanged
          principal_amount:
            form.principal_amount || form.monthly_amortization,
          monthly_amortization: Number(form.monthly_amortization),
          cutoff_behavior: form.cutoff_behavior,
          start_date: form.start_date,
        }),
      });

      if (!res.ok) throw new Error("Failed to save loan");

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save loan");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Add Loan</h2>
          <Button
            type="button"
            className="border border-gray-300 shadow-none"
            onClick={onClose}
          >
            <IoClose className="text-primary" />
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* FORM */}
        <div className="flex flex-col gap-4">
          <select
            value={form.loan_type}
            onChange={(e) => handleChange("loan_type", e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Select loan</option>

            {/* EXISTING */}
            <option value="SSS_LOAN">SSS Loan</option>
            <option value="PHILHEALTH_LOAN">PhilHealth Loan</option>
            <option value="PAGIBIG_LOAN">Pag-IBIG Loan</option>
            <option value="COMPANY_LOAN">Company Loan</option>

            {/* NEW */}
            <option value="SSS_SALARY_LOAN">SSS Salary Loan</option>
            <option value="SSS_CALAMITY_LOAN">SSS Calamity Loan</option>
            <option value="PAGIBIG_CALAMITY_LOAN">
              Pag-IBIG Calamity Loan
            </option>
          </select>

          <input
            type="number"
            placeholder="Principal Amount (optional)"
            value={form.principal_amount}
            onChange={(e) =>
              handleChange("principal_amount", e.target.value)
            }
            className="p-2 border rounded-md"
          />

          <input
            type="number"
            placeholder="Monthly Amortization"
            value={form.monthly_amortization}
            onChange={(e) =>
              handleChange("monthly_amortization", e.target.value)
            }
            className="p-2 border rounded-md"
          />

          <select
            value={form.cutoff_behavior}
            disabled={form.loan_type === "COMPANY_LOAN"}
            onChange={(e) =>
              handleChange("cutoff_behavior", e.target.value)
            }
            className="p-2 border rounded-md"
          >
            <option value="">Select cutoff</option>
            <option value="FIRST_CUTOFF_ONLY">1st Cutoff Only</option>
            <option value="SECOND_CUTOFF_ONLY">2nd Cutoff Only</option>
          </select>

          <input
            type="date"
            value={form.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            onClick={onClose}
            className="border border-gray-300 text-primary shadow-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-secondary shadow-none"
          >
            {loading ? "Saving..." : "Add Loan"}
          </Button>
        </div>
      </motion.form>
    </motion.div>,
    modalRoot,
  );
}
