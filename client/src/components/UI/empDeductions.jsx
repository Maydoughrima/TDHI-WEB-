import React, { useEffect, useState } from "react";
import Button from "./Button";
import { getEmployeeDeductions } from "../../data/mockAPI/getEmployeeDeductions";
import AddDeductionsModal from "./AddDeductionsModal";

export default function EmpDeductions({ employeeId }) {
  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    if (!employeeId) {
      setDeductions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getEmployeeDeductions(employeeId)
      .then((data) => {
        setDeductions(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load deductions");
        setLoading(false);
      });
  }, [employeeId]);

  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-4 w-full">
      {/* HEADER */}
      <div className="bg-secondary p-2 rounded flex justify-between items-center">
        <h2 className="text-bg font-heading">Deductions</h2>

        <Button
          className="shadow-sm border border-gray-300"
          onClick={() => setOpenAddModal(true)}
        >
          Add Deduction
        </Button>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {loading && (
          <p className="text-center text-gray-500">
            Loading deductions...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && deductions.length === 0 && (
          <p className="text-gray-500 text-center">
            No deductions found
          </p>
        )}

        {!loading &&
          !error &&
          deductions.map((d) => (
            <div
              key={d.id}
              className="flex justify-between bg-white p-2 rounded shadow-sm"
            >
              <span>{d.type}</span>
              <span>₱{d.amount}</span>
            </div>
          ))}
      </div>

      {/* ✅ ADD DEDUCTION MODAL */}
      <AddDeductionsModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        employeeId={employeeId}
        onSuccess={() => {
          // re-fetch deductions later if you want
        }}
      />
    </div>
  );
}
