import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../UI/Button";
import SuccessModal from "../UI/SuccessModal";

export default function AddEmploymentHistoryModal({
  isOpen,
  onClose,
  employeeId,
  onAdded,
  editData, // if present = edit mode
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    position: "",
    company_place: "",
    employment_type: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= RESET ================= */
  const resetAll = () => {
    setForm({
      company_name: "",
      position: "",
      company_place: "",
      employment_type: "",
      start_date: "",
      end_date: "",
    });
    setError("");
    setLoading(false);
    onClose();
  };

  /* ================= PREFILL (EDIT MODE) ================= */
  useEffect(() => {
    if (!editData) return;

    setForm({
      company_name: editData.company_name ?? "",
      position: editData.position ?? "",
      company_place: editData.company_place ?? "",
      employment_type: editData.employment_type ?? "",
      start_date: editData.start_date
        ? editData.start_date.split("T")[0]
        : "",
      end_date: editData.end_date
        ? editData.end_date.split("T")[0]
        : "",
    });
  }, [editData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");

      const url = editData
        ? `http://localhost:5000/api/employees/employment-history/${editData.id}`
        : `http://localhost:5000/api/employees/${employeeId}/employment-history`;

      const method = editData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser?.id,
        },
        body: JSON.stringify({
          ...form,
          end_date: form.end_date || null, // allow "Present"
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      onAdded?.();        // refresh list
      setShowSuccess(true); // show success modal
    } catch (err) {
      setError(err?.message || "Failed to save employment history");
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={resetAll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* MODAL */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl"
              >
                {/* HEADER */}
                <h2 className="text-xl font-bold text-primary text-center mb-6">
                  {editData
                    ? "Edit Employment History"
                    : "Add Employment History"}
                </h2>

                {error && (
                  <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                {/* FORM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company Name"
                    value={form.company_name}
                    onChange={(v) => handleChange("company_name", v)}
                  />

                  <Input
                    label="Position"
                    value={form.position}
                    onChange={(v) => handleChange("position", v)}
                  />

                  <Input
                    label="Company Location"
                    value={form.company_place}
                    onChange={(v) => handleChange("company_place", v)}
                  />

                  <Input
                    label="Employment Type"
                    value={form.employment_type}
                    onChange={(v) => handleChange("employment_type", v)}
                  />

                  <Input
                    label="Start Date"
                    type="date"
                    value={form.start_date}
                    onChange={(v) => handleChange("start_date", v)}
                  />

                  <Input
                    label="End Date (leave empty if present)"
                    type="date"
                    value={form.end_date}
                    onChange={(v) => handleChange("end_date", v)}
                  />
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    type="button"
                    className="bg-gray-100 text-secondary shadow-sm"
                    onClick={resetAll}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-secondary text-bg shadow-sm"
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <SuccessModal
        isOpen={showSuccess}
        message={
          editData
            ? "Employment history updated successfully."
            : "Employment history added successfully."
        }
        onClose={() => {
          setShowSuccess(false);
          resetAll();
        }}
      />
    </>
  );
}

/* ================= INPUT HELPER ================= */
function Input({ label, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-md p-2 text-sm"
      />
    </div>
  );
}
