import { useEffect, useState } from "react";
import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";
import Button from "../components/UI/Button";
import SuccessModal from "../components/UI/SuccessModal";
import WarningModal from "../components/UI/WarningModal";
import LeaveHistoryModal from "../components/UI/LeaveHistoryModal";

export default function ApproveLeave() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // warning modal
  const [warningOpen, setWarningOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { id, decision }

  // success modal
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // history modal
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);

  // ⚠️ TEMP — replace with auth context later
  const PAYROLL_CHECKER_ID = "c069c93d-b229-4986-9b24-c5a6d8b7cbfc";

  /* ===========================
     FETCH PENDING REQUESTS
  =========================== */
  const fetchRequests = () => {
    setLoading(true);
    fetch("/api/leave-requests/pending")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setRequests(json.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ===========================
     OPEN HISTORY MODAL
  =========================== */
  const openHistory = () => {
    setHistoryOpen(true);
    setHistoryLoading(true);

    fetch("/api/leave-requests/history", {
      headers: {
        "x-user-id": PAYROLL_CHECKER_ID,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setHistoryRecords(json.data);
        }
      })
      .finally(() => setHistoryLoading(false));
  };

  /* ===========================
     CONFIRM ACTION
  =========================== */
  const confirmDecision = (id, decision) => {
    setPendingAction({ id, decision });
    setWarningOpen(true);
  };

  /* ===========================
     EXECUTE APPROVE / REJECT
  =========================== */
  const executeDecision = async () => {
    if (!pendingAction) return;

    const { id, decision } = pendingAction;

    setWarningOpen(false);
    setProcessingId(id);

    try {
      const res = await fetch(`/api/leave-requests/${id}/decision`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": PAYROLL_CHECKER_ID,
        },
        body: JSON.stringify({ decision }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setRequests((prev) => prev.filter((r) => r.id !== id));

      setSuccessMessage(
        decision === "APPROVED"
          ? "Leave request approved successfully."
          : "Leave request rejected successfully."
      );
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
      setPendingAction(null);
    }
  };

  /* ===========================
     DATE FORMATTER
  =========================== */
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <main className="bg-bgshade min-h-screen w-full px-2 md:px-4 overflow-x-hidden">
        <div className="container flex flex-col gap-6">
          <TopCard title="Approve Leave Requests" />

          {/* ACTION BAR */}
          <div className="flex justify-end">
            <Button
              className="bg-secondary text-bg px-4 py-2"
              onClick={openHistory}
            >
              History
            </Button>
          </div>

          <div className="bg-bg rounded-md shadow-md p-4 overflow-x-auto">
            {loading && (
              <p className="text-sm text-gray-500">Loading requests…</p>
            )}

            {!loading && requests.length === 0 && (
              <p className="text-sm text-gray-500">
                No pending leave requests
              </p>
            )}

            {!loading && requests.length > 0 && (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Leave Type</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Requested</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((r) => (
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
                        {formatDate(r.requested_at)}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            className="bg-green-600 text-white text-xs px-3 py-1"
                            disabled={processingId === r.id}
                            onClick={() =>
                              confirmDecision(r.id, "APPROVED")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            className="bg-red-600 text-white text-xs px-3 py-1"
                            disabled={processingId === r.id}
                            onClick={() =>
                              confirmDecision(r.id, "REJECTED")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* WARNING MODAL */}
      <WarningModal
        isOpen={warningOpen}
        title="Confirm Action"
        message={
          pendingAction?.decision === "APPROVED"
            ? "Are you sure you want to approve this leave request?"
            : "Are you sure you want to reject this leave request?"
        }
        confirmText={
          pendingAction?.decision === "APPROVED" ? "Approve" : "Reject"
        }
        onCancel={() => {
          setWarningOpen(false);
          setPendingAction(null);
        }}
        onConfirm={executeDecision}
      />

      {/* SUCCESS MODAL */}
      <SuccessModal
        isOpen={successOpen}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />

      {/* HISTORY MODAL */}
      <LeaveHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        records={historyRecords}
        loading={historyLoading}
      />
    </div>
  );
}
