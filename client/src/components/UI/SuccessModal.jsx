import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";



export default function SuccessModal({ isOpen, message, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
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
              <h3 className="text-lg font-bold text-green-600 mb-2">
                Success
              </h3>

              <p className="text-sm text-gray-600 mb-6">{message}</p>

              <Button
                className="bg-secondary text-bg w-full justify-center"
                onClick={onClose}
              >
                OK
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
