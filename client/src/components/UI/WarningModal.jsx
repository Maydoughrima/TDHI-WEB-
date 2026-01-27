import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

export default function WarningModal({
  isOpen,
  title = "Warning",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
              <h3 className="text-lg font-bold text-red-600 mb-2">
                {title}
              </h3>

              <p className="text-sm text-gray-600 mb-6">{message}</p>

              <div className="flex gap-3">
                <Button
                  className="bg-gray-200 text-fontc w-full justify-center"
                  onClick={onCancel}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-red-600 text-bg w-full justify-center"
                  onClick={onConfirm}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
