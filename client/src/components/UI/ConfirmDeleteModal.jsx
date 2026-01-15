import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

export default function ConfirmDeleteModal({
  isOpen,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  onCancel,
  onConfirm,
  loading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* MODAL */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold text-red-600 mb-3">
                {title}
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                {message}
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  className="bg-gray-100 text-secondary shadow-sm"
                  onClick={onCancel}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  disabled={loading}
                  className="bg-red-600 text-bg shadow-sm"
                  onClick={onConfirm}
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
