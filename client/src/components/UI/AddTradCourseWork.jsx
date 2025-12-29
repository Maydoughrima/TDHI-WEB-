import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../UI/Button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function AddTradCourseWork({
  isOpen,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    CourseWork: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetAll() {
    setForm({ CourseWork: "" });
    setError("");
    setLoading(false);
    onClose();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* ---------------------------
         BACKEND READY (example)
      ------------------------------
      
      const res = await fetch("/api/education/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add education");
      */

      // TEMP MOCK SAVE
      console.log("EDUCATION SUBMITTED:", form);

      // Pass form back to parent if needed
      if (onSave) onSave(form);

      resetAll();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={resetAll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl"
            >
              {/* HEADER */}
              <h2 className="text-xl font-bold text-primary text-center mb-6">
                Add New Traditional Course Work
              </h2>

              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              {/* FORM */}
              <div className="">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Course Work</label>
                  <input
                    type="text"
                    value={form.CourseWork}
                    onChange={(e) => handleChange("CourseWork", e.target.value)}
                    className="border rounded-md p-2 text-sm"
                    placeholder="Course Work"
                    required
                  />
                </div>
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
                  className="bg-secondary text-bg flex items-center gap-1 shadow-sm"
                >
                  {loading ? "Saving..." : "Save Education"}
                  <IoIosArrowForward />
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
