import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import { IoIosArrowBack } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddEmploymentHistoryModal from "../UI/AddEmploymentHistoryModal";
import ConfirmDeleteModal from "../UI/ConfirmDeleteModal";

/* DATE FORMAT */
const formatDate = (date) => {
  if (!date) return "Present";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

/* API */
async function fetchEmploymentHistory(employeeId) {
  const res = await fetch(
    `http://localhost:5000/api/employees/${employeeId}/employment-history`,
    { cache: "no-store" }
  );
  const json = await res.json();
  return json.data || [];
}

export default function EmploymentHistory({
  selectedEmployeeId,
  isEditing,
  goBack,
}) {
  const [empList, setEmpList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* LOAD */
  useEffect(() => {
    if (!selectedEmployeeId) return;

    async function load() {
      setLoading(true);
      const data = await fetchEmploymentHistory(selectedEmployeeId);
      setEmpList(data);
      setLoading(false);
    }

    load();
  }, [selectedEmployeeId]);

  /* DELETE CONFIRMED */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");

      await fetch(
        `http://localhost:5000/api/employees/employment-history/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: { "x-user-id": storedUser?.id },
        }
      );

      setEmpList((prev) =>
        prev.filter((e) => e.id !== deleteTarget.id)
      );
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* REFRESH AFTER ADD / EDIT */
  const refresh = async () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    const data = await fetchEmploymentHistory(selectedEmployeeId);
    setEmpList(data);
  };

  return (
    <div className="bg-bg w-full rounded-md p-4 min-h-[600px] flex flex-col">
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg text-center font-heading">
          Employment History
        </h2>
      </div>

      <div className="mt-4 flex flex-col gap-4 flex-1">
        {loading && <p className="text-center">Loading…</p>}

        {!loading &&
          empList.map((emp) => (
            <div
              key={emp.id}
              className="p-4 border rounded-md shadow-sm bg-white relative"
            >
              <div className="font-semibold">
                {emp.position} | {emp.company_name}
              </div>

              <div className="text-xs text-gray-500">
                {emp.company_place} | {emp.employment_type}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                {formatDate(emp.start_date)} – {formatDate(emp.end_date)}
              </div>

              {/* EDIT / DELETE (ONLY WHEN EDITING) */}
              {isEditing && (
                <div className="absolute top-3 right-3 flex gap-3">
                  <button
                    onClick={() => {
                      setEditingRecord(emp);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(emp)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}

        {!loading && empList.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No employment history available.
          </p>
        )}

        {/* ADD */}
        {isEditing && (
          <button
            className="p-3 border rounded bg-white shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            + Add new employment history
          </button>
        )}

        {/* BACK */}
        <div className="flex justify-end mt-3">
          <Button className="bg-gray-100 border shadow-sm" onClick={goBack}>
            <IoIosArrowBack className="text-primary" />
          </Button>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <AddEmploymentHistoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        employeeId={selectedEmployeeId}
        editData={editingRecord}
        onAdded={refresh}
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Employment History?"
        message={`This will permanently remove "${deleteTarget?.company_name}".`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
