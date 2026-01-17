import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

export default function DuplicateEmployeeNoModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL WRAPPER */}
          <motion.div
            className="fixed inset-0 z-[61] flex items-center justify-center px-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div
              className="
                bg-white rounded-xl shadow-xl w-full
                max-w-[90vw] sm:max-w-sm
                p-5 sm:p-6
                text-center
              "
            >
              {/* TITLE */}
              <h3 className="text-base sm:text-lg font-semibold text-red-600">
                Employee Number Already Exists
              </h3>

              {/* MESSAGE */}
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                The employee number you entered is already registered.
                Please use a different employee number.
              </p>

              {/* ACTION */}
              <div className="flex justify-center sm:justify-end mt-6">
                <Button
                  className="bg-secondary text-bg px-6 sm:px-8"
                  onClick={onClose}
                >
                  Go Back
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
