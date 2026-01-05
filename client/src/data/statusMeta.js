export const statusMeta = {
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-yellow-600",
    dot: "bg-yellow-400",
    hint: "Needs attention",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-600",
    dot: "bg-green-500",
    hint: "Safe",
  },
  PENDING: {
    label: "Pending Approval",
    color: "text-blue-600",
    dot: "bg-blue-500",
    hint: "Decision needed",
  },
  ERROR: {
    label: "Rejected / Error",
    color: "text-red-600",
    dot: "bg-red-500",
    hint: "Urgent",
  },
};
