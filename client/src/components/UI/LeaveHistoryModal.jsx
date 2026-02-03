import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

/* ===============================
   DATE FORMATTER
================================ */
const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function LeaveHistoryModal({
  isOpen,
  onClose,
  records = [],
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
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
            {/* CONTAINER */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
              
              {/* HEADER */}
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-bold text-secondary">
                  Leave Request History
                </h3>
                <Button
                  className="border border-gray-300 text-fontc px-3 py-1 shadow-sm"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>

              {/* BODY (SCROLLABLE) */}
              <div className="p-6 overflow-y-auto">
                {records.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-10">
                    No leave history found
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead className="sticky top-0 bg-gray-100">
                        <tr className="text-left">
                          <th className="p-3">Employee</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Leave Type</th>
                          <th className="p-3">Dates</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Processed At</th>
                        </tr>
                      </thead>

                      <tbody>
                        {records.map((r) => (
                          <tr key={r.id} className="border-t">
                            <td className="p-3">{r.employee_name}</td>
                            <td className="p-3">{r.department}</td>
                            <td className="p-3">
                              {r.leave_type === "SICK"
                                ? "Sick Leave"
                                : "Vacation Leave"}
                            </td>
                            <td className="p-3">
                              {formatDate(r.start_date)} →{" "}
                              {formatDate(r.end_date)}
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-semibold ${
                                  r.status === "APPROVED"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="p-3">
                              {formatDate(r.approved_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
