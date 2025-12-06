import React, { useEffect, useState } from "react";

export default function EmpDeductions({ employeeId }) {
  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Always show dummy data for preview
    setDeductions([
      { id: 1, type: "Tax", amount: 150 },
      { id: 2, type: "SSS", amount: 100 },
      { id: 3, type: "PhilHealth", amount: 50 },
      { id: 4, type: "Loan", amount: 200 },
      { id: 5, type: "Others", amount: 75 },
      { id: 6, type: "Additional", amount: 60 },
      { id: 7, type: "Misc", amount: 40 },
    ]);
    setLoading(false);
    setError(null);

    // Backend fetch (commented for now)
    /*
    if (employeeId) {
      setLoading(true);
      setError(null);

      fetch(`/api/employees/${employeeId}/deductions`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch deductions");
          return res.json();
        })
        .then((data) => {
          setDeductions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || "Something went wrong");
          setLoading(false);
        });
    }
    */
  }, [employeeId]);

  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-4 w-full">
      {/* Static label */}
      <div className="bg-secondary p-2 rounded">
        <h2 className="text-bg font-heading text-center">Deductions</h2>
      </div>

      {/* Scrollable deduction list */}
      <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">
        {loading && <p className="text-center text-gray-500">Loading deductions...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && deductions.length === 0 && (
          <p className="text-gray-500 text-center">No deductions found</p>
        )}

        {!loading && !error && deductions.map((deduction) => (
          <div
            key={deduction.id}
            className="flex justify-between bg-white p-2 rounded shadow-sm"
          >
            <span>{deduction.type}</span>
            <span>₱{deduction.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
