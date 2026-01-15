import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../UI/Button";
import SuccessModal from "../UI/SuccessModal";

export default function AddEducationalSummaryModal({
  isOpen,
  onClose,
  employeeId,
  onAdded,
  editData,
}) {
  const [form, setForm] = useState({
    school_name: "",
    degree: "",
    year_start: "",
    year_end: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= PREFILL (EDIT MODE) ================= */
  useEffect(() => {
    if (editData) {
      setForm({
        school_name: editData.school_name ?? "",
        degree: editData.degree ?? "",
        year_start: editData.year_start ?? "",
        year_end: editData.year_end ?? "",
      });
    }
  }, [editData]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm({
      school_name: "",
      degree: "",
      year_start: "",
      year_end: "",
    });
    setError("");
    setLoading(false);
  }

  function closeAll() {
    resetForm();
    setShowSuccess(false);
    onClose();
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");

      const url = editData
        ? `http://localhost:5000/api/employees/education/${editData.id}`
        : `http://localhost:5000/api/employees/${employeeId}/education`;

      const method = editData ? "PATCH" : "POST";

      const payload = {
        school_name: form.school_name,
        degree: form.degree,
        year_start: form.year_start ? Number(form.year_start) : null,
        year_end: form.year_end ? Number(form.year_end) : null,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser?.id,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      onAdded?.();
      setShowSuccess(true);
    } catch (err) {
      setError(err?.message || "Failed to save education");
      setLoading(false);
    }
  };

  return (
    <>
      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={closeAll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

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
                <h2 className="text-xl font-bold text-primary text-center mb-6">
                  {editData
                    ? "Edit Educational Background"
                    : "Add Educational Background"}
                </h2>

                {error && (
                  <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="School / University"
                    value={form.school_name}
                    onChange={(v) => handleChange("school_name", v)}
                  />

                  <Input
                    label="Degree / Course"
                    value={form.degree}
                    onChange={(v) => handleChange("degree", v)}
                  />

                  <Input
                    label="Start Year"
                    value={form.year_start}
                    onChange={(v) => handleChange("year_start", v)}
                    placeholder="e.g. 2019"
                  />

                  <Input
                    label="End Year (leave empty if present)"
                    value={form.year_end}
                    onChange={(v) => handleChange("year_end", v)}
                    placeholder="e.g. 2023"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    type="button"
                    className="bg-gray-100 text-secondary shadow-sm"
                    onClick={closeAll}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-secondary text-bg shadow-sm"
                  >
                    {loading ? "Saving..." : "Save Education"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL (REUSED COMPONENT) */}
      <SuccessModal
        isOpen={showSuccess}
        message={
          editData
            ? "Educational background updated successfully."
            : "Educational background added successfully."
        }
        onClose={closeAll}
      />
    </>
  );
}

/* ================= INPUT HELPER ================= */
function Input({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border rounded-md p-2 text-sm"
      />
    </div>
  );
}
