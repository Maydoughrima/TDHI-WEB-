import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import AddDeductionsModal from "./AddDeductionsModal";

/* ======================================================
   API
====================================================== */
async function fetchEmployeeLoans(employeeId) {
  const res = await fetch(`/api/employees/${employeeId}/loans`);
  if (!res.ok) throw new Error("Failed to fetch loans");
  return res.json();
}

/* ======================================================
   HELPERS
====================================================== */
function formatLabel(text) {
  return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/* ======================================================
   COMPUTATIONS (PURE)
====================================================== */
function computeSSSPremium(basicRate) {
  if (!basicRate || basicRate <= 0) return 0;
  const row = SSS_EMPLOYEE_TABLE.find(
    (b) => basicRate >= b.min && basicRate <= b.max
  );
  return row ? row.employee : 0;
}

function computePhilHealthPremium(basicRate) {
  if (!basicRate || basicRate <= 0) return 0;
  const FLOOR = 10000;
  const CEILING = 100000;
  const RATE = 0.025;
  const base = Math.min(Math.max(basicRate, FLOOR), CEILING);
  return Number((base * RATE).toFixed(2));
}

function computePagIbigPremium(basicRate) {
  if (!basicRate || basicRate <= 0) return 0;
  return Math.min(Math.min(basicRate, 5000) * 0.02, 100);
}

/* ======================================================
   SSS TABLE
====================================================== */
const SSS_EMPLOYEE_TABLE = [
  { min: 0, max: 5250, employee: 250 },
  { min: 5250, max: 5749.99, employee: 275 },
  { min: 5750, max: 6249.99, employee: 300 },
  { min: 6250, max: 6749.99, employee: 325 },
  { min: 6750, max: 7249.99, employee: 350 },
  { min: 7250, max: 7749.99, employee: 375 },
  { min: 7750, max: 8249.99, employee: 400 },
  { min: 8250, max: 8749.99, employee: 425 },
  { min: 8750, max: 9249.99, employee: 450 },
  { min: 9250, max: 9749.99, employee: 475 },
  { min: 9750, max: 10249.99, employee: 500 },
  { min: 10250, max: 10749.99, employee: 525 },
  { min: 10750, max: 11249.99, employee: 550 },
  { min: 11250, max: 11749.99, employee: 575 },
  { min: 11750, max: 12249.99, employee: 600 },
  { min: 12250, max: 12749.99, employee: 625 },
  { min: 12750, max: 13249.99, employee: 650 },
  { min: 13250, max: 13749.99, employee: 675 },
  { min: 13750, max: 14249.99, employee: 700 },
  { min: 14250, max: 14749.99, employee: 725 },
  { min: 14750, max: 15249.99, employee: 750 },
  { min: 15250, max: 15749.99, employee: 775 },
  { min: 15750, max: 16249.99, employee: 800 },
  { min: 16250, max: 16749.99, employee: 825 },
  { min: 16750, max: 17249.99, employee: 850 },
  { min: 17250, max: 17749.99, employee: 875 },
  { min: 17750, max: 18249.99, employee: 900 },
  { min: 18250, max: 18749.99, employee: 925 },
  { min: 18750, max: 19249.99, employee: 950 },
  { min: 19250, max: 19749.99, employee: 975 },
  { min: 19750, max: 20249, employee: 1000 },
  { min: 20250, max: 20749, employee: 1025 },
  { min: 20750, max: 21249, employee: 1050 },
  { min: 21250, max: 21749, employee: 1075 },
  { min: 21750, max: 22249, employee: 1100 },
  { min: 22250, max: 22749, employee: 1125 },
  { min: 22750, max: 23249, employee: 1150 },
  { min: 23250, max: 23749, employee: 1175 },
  { min: 23750, max: 24249, employee: 1200 },
  { min: 24250, max: 24749, employee: 1225 },
  { min: 24750, max: 25249, employee: 1250 },
  { min: 25250, max: 25749, employee: 1275 },
  { min: 25750, max: 26249, employee: 1300 },
  { min: 26250, max: 26749, employee: 1325 },
  { min: 26750, max: 27249, employee: 1350 },
  { min: 27250, max: 27749, employee: 1375 },
  { min: 27750, max: 28249, employee: 1400 },
  { min: 28250, max: 28749, employee: 1425 },
  { min: 28750, max: 29249, employee: 1450 },
  { min: 29250, max: 29749, employee: 1475 },
  { min: 29750, max: 30249, employee: 1500 },
  { min: 30250, max: 30749, employee: 1525 },
  { min: 30750, max: 31249, employee: 1550 },
  { min: 31250, max: 31749, employee: 1575 },
  { min: 31750, max: 32249, employee: 1600 },
  { min: 32250, max: 32749, employee: 1625 },
  { min: 32750, max: 33249, employee: 1650 },
  { min: 33250, max: 33749, employee: 1675 },
  { min: 33750, max: 34249, employee: 1700 },
  { min: 34250, max: 34749, employee: 1725 },
  { min: 34750, max: Infinity, employee: 1750 },
];

/* ======================================================
   COMPONENT
====================================================== */
export default function EmpDeductions({ employeeId, basicRate }) {
  const [loans, setLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [error, setError] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  /* SYSTEM DEDUCTIONS (DERIVED) */
  const systemDeductions = useMemo(() => {
    if (!basicRate) return [];
    return [
      { type: "SSS_PREMIUM", amount: computeSSSPremium(basicRate) },
      {
        type: "PHILHEALTH_PREMIUM",
        amount: computePhilHealthPremium(basicRate),
      },
      {
        type: "PAGIBIG_CONTRIBUTION",
        amount: computePagIbigPremium(basicRate),
      },
    ];
  }, [basicRate]);

  /* LOANS FETCH */
  useEffect(() => {
    if (!employeeId) return;

    setLoadingLoans(true);
    setError(null);

    fetchEmployeeLoans(employeeId)
      .then((res) => {
        setLoans(res.loans || []);
        setLoadingLoans(false);
      })
      .catch(() => {
        setError("Failed to load loans");
        setLoadingLoans(false);
      });
  }, [employeeId, reloadKey]);

  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-4 w-full">
      {/* HEADER */}
      <div className="bg-secondary p-2 rounded flex justify-between items-center">
        <h2 className="text-bg font-heading">Deductions</h2>
        <Button
          className="border border-white-500 shadow-none"
          onClick={() => setOpenAddModal(true)}
        >
          Add Deduction
        </Button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto pr-1">
        <p className="text-xs font-semibold text-gray-600">
          SYSTEM DEDUCTIONS
        </p>

        {systemDeductions.map((d) => (
          <div
            key={d.type}
            className="flex justify-between bg-white p-2 rounded shadow-sm"
          >
            <span>{formatLabel(d.type)}</span>
            <span>₱{Number(d.amount).toLocaleString()}</span>
          </div>
        ))}

        <p className="text-xs font-semibold text-gray-600 mt-3">
          LOANS
        </p>

        {loadingLoans && (
          <p className="text-sm text-gray-500">Loading loans...</p>
        )}

        {!loadingLoans && loans.length === 0 && (
          <p className="text-sm text-gray-500">None</p>
        )}

        {loans.map((l) => (
          <div
            key={l.id}
            className="flex justify-between bg-white p-2 rounded shadow-sm"
          >
            <span>{formatLabel(l.loan_type)}</span>
            <span>
              ₱{Number(l.monthly_amortization).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <AddDeductionsModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        employeeId={employeeId}
        onSuccess={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
