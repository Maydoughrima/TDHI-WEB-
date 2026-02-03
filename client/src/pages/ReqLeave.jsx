import { useEffect, useState } from "react";
import Sidebar from "../components/Layout/SideBar";
import TopCard from "../components/Layout/TopCard";

import Dropdown from "../components/UI/Dropdown";
import TextField from "../components/UI/TextField";
import Button from "../components/UI/Button";
import SuccessModal from "../components/UI/SuccessModal";

export default function ReqLeave() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    department: "",
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ===========================
     FETCH DEPARTMENTS
  =========================== */
  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((json) => {
        if (!json.success || !Array.isArray(json.data)) return;

        const normalized = json.data
          .map((d) => {
            const name =
              typeof d === "string"
                ? d
                : d?.department || d?.name;

            if (!name) return null;

            return {
              label: String(name),
              value: String(name),
            };
          })
          .filter(Boolean);

        setDepartments(normalized);
      })
      .catch(console.error);
  }, []);

  /* ===========================
     FETCH EMPLOYEES BY DEPT
  =========================== */
  useEffect(() => {
    if (!form.department) {
      setEmployees([]);
      return;
    }

    setLoadingEmployees(true);

    fetch(`/api/employees?department=${encodeURIComponent(form.department)}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success || !Array.isArray(json.data)) return;

        const normalized = json.data
          .map((e) => {
            if (!e?.id || !e?.full_name) return null;

            return {
              label: `${e.full_name}${e.position ? ` (${e.position})` : ""}`,
              value: String(e.id),
            };
          })
          .filter(Boolean);

        setEmployees(normalized);
      })
      .finally(() => setLoadingEmployees(false));
  }, [form.department]);

  /* ===========================
     SUBMIT LEAVE REQUEST
  =========================== */
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // 🔐 AUTH SOURCE
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.id) {
        console.error("No user found in localStorage");
        return;
      }

      const payload = {
        employee_id: form.employeeId,
        leave_type: form.leaveType,
        start_date: form.startDate,
        end_date: form.endDate,
        reason: form.reason || null,
      };

      const res = await fetch("/api/leave-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id, // ✅ THIS FIXES THE 403
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        console.error("Leave request failed:", json);
        return;
      }

      // ✅ SUCCESS
      setShowSuccess(true);

      // reset form
      setForm({
        department: "",
        employeeId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setEmployees([]);
    } catch (err) {
      console.error("Submit leave error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="bg-bgshade min-h-screen w-full px-2 md:px-4 overflow-x-hidden">
          <div className="container flex flex-col gap-6">
            <TopCard title="Request Leave" />

            <div className="bg-bg rounded-md shadow-md p-6 flex flex-col gap-6">
              <Dropdown
                label="Department"
                placeHolder="Select department"
                value={form.department}
                options={departments}
                onChange={(e) => {
                  update("department", e.target.value);
                  update("employeeId", "");
                }}
              />

              <Dropdown
                label="Employee"
                placeHolder={
                  loadingEmployees
                    ? "Loading employees..."
                    : form.department
                    ? "Select employee"
                    : "Select department first"
                }
                value={form.employeeId}
                options={employees}
                onChange={(e) => update("employeeId", e.target.value)}
              />

              <Dropdown
                label="Leave Type"
                placeHolder="Select leave type"
                value={form.leaveType}
                options={[
                  { label: "Sick Leave", value: "SICK" },
                  { label: "Vacation Leave", value: "VACATION" },
                ]}
                onChange={(e) => update("leaveType", e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  type="date"
                  label="Start Date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                />
                <TextField
                  type="date"
                  label="End Date"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                />
              </div>

              <TextField
                label="Reason (Optional)"
                multiline
                rows={4}
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <Button className="bg-gray-200 text-fontc">
                  Cancel
                </Button>
                <Button
                  className="bg-secondary text-bg"
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    !form.department ||
                    !form.employeeId ||
                    !form.leaveType ||
                    !form.startDate ||
                    !form.endDate
                  }
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* SUCCESS MODAL */}
      <SuccessModal
        isOpen={showSuccess}
        message="Leave request submitted successfully."
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
