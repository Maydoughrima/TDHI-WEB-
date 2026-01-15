import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddEducationalSummaryModal from "../UI/AddEducationalSummaryModal";
import DeleteConfirmModal from "../UI/ConfirmDeleteModal";

/* ================= YEAR FORMATTER ================= */
const formatYear = (year) => {
  if (!year) return "Present";
  return year;
};

/* ================= API ================= */
async function fetchEducation(employeeId) {
  const res = await fetch(
    `http://localhost:5000/api/employees/${employeeId}/education`,
    { cache: "no-store" }
  );
  const json = await res.json();
  return json.data || [];
}

export default function EducationalSummary({
  selectedEmployeeId,
  isEditing,
  goBack,
  goNext,
}) {
  const [educList, setEducList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!selectedEmployeeId) return;

    async function load() {
      setLoading(true);
      const data = await fetchEducation(selectedEmployeeId);
      setEducList(data);
      setLoading(false);
    }

    load();
  }, [selectedEmployeeId]);

  /* ================= REFRESH ================= */
  const refresh = async () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    const data = await fetchEducation(selectedEmployeeId);
    setEducList(data);
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    await fetch(
      `http://localhost:5000/api/employees/education/${deleteId}`,
      {
        method: "DELETE",
        headers: { "x-user-id": storedUser?.id },
      }
    );

    setEducList((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="bg-bg w-full rounded-md p-4 min-h-[600px] flex flex-col">
      {/* HEADER */}
      <div className="bg-secondary py-2 rounded">
        <h2 className="text-bg text-center font-heading">
          Educational Summary
        </h2>
      </div>

      <div className="mt-4 flex flex-col gap-4 flex-1">
        {loading && <p className="text-center">Loading…</p>}

        {!loading &&
          educList.map((edu) => (
            <div
              key={edu.id}
              className="p-4 border rounded-md shadow-sm bg-white relative"
            >
              <div className="font-semibold">
                {edu.school_name} | {edu.degree}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {formatYear(edu.year_start)} – {formatYear(edu.year_end)}
              </div>

              {/* EDIT / DELETE */}
              {isEditing && (
                <div className="absolute top-3 right-3 flex gap-3">
                  <button
                    className="text-blue-600"
                    onClick={() => {
                      setEditingRecord(edu);
                      setIsModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() => setDeleteId(edu.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}

        {!loading && educList.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No educational background available.
          </p>
        )}

        {/* ADD */}
        {isEditing && (
          <button
            className="p-3 border rounded bg-white shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            + Add new education
          </button>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-2 mt-4">
          <Button className="bg-gray-100 border shadow-sm" onClick={goBack}>
            <IoIosArrowBack className="text-primary" />
          </Button>

          <Button className="bg-gray-100 border shadow-sm" onClick={goNext}>
            <IoIosArrowForward className="text-primary" />
          </Button>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <AddEducationalSummaryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        employeeId={selectedEmployeeId}
        editData={editingRecord}
        onAdded={refresh}
      />

      {/* DELETE CONFIRM */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Education"
        message="Are you sure you want to delete this educational record?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
