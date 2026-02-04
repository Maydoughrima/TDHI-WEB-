import { useEffect, useMemo, useState, useRef } from "react";
import Button from "./Button";

/* ================= BUILT-IN MANUAL ADJUSTMENTS ================= */
const ADD_ADJUSTMENTS = [
  "Overtime",
  "Night Premium",
  "Regular Holiday",
  "Special Holiday",
  "Extend Duty",
  "Food Allow / Others",
  "On Call",
  "Others",
  "Adjustment (Earnings)",
  "Adjustment (Allowance)",
];

const DEDUCT_ADJUSTMENTS = [
  "Late / Undertime",
  "Hospital Accounts",
  "W/holding Tax",
  "Tax Compensation",
  "Canteen",
  "Coop",
  "HSBC",
  "Leave w/o Pay",
  "Other Ded (NSO / Adjustment)",
];

/* ================= DATE FORMATTER ================= */
const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function EmployeePayrollModal({
  isOpen,
  onClose,
  employee,
  payroll,
}) {
  // ✅ NORMALIZE last pay flag (THIS IS THE FIX)
  const lastPayFlag = Boolean(
    payroll?.last_pay !== undefined ? payroll.last_pay : payroll?.lastPay,
  );

  console.log("PAYROLL FROM MODAL:", payroll);
  console.log("LAST PAY FLAG:", lastPayFlag);

  const isReadOnly = payroll?.status === "done";

  const isSecondCutoff = lastPayFlag;
  const activeCutoff = lastPayFlag ? "SECOND" : "FIRST";

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);

  const [payrollInfo, setPayrollInfo] = useState(null);

  const [deductions, setDeductions] = useState([]);
  const [deductionsLoaded, setDeductionsLoaded] = useState(false);

  const [loanPreview, setLoanPreview] = useState([]);
  const [loansLoaded, setLoansLoaded] = useState(false);

  const [dbSnapshot, setDbSnapshot] = useState(null);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);

  //CONST FOR IMAGE
  const [employeeWithImage, setEmployeeWithImage] = useState(null);

  // ✅ only “locks” initialization after we have all required data
  const seededRef = useRef(false);

   /* ================= FETCH FULL EMPLOYEE (IMAGE FIX) ================= */
  useEffect(() => {
    if (!isOpen || !employee?.id) return;

    fetch(`http://localhost:5000/api/employees/${employee.id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setEmployeeWithImage(j.data);
      })
      .catch(() => {});
  }, [isOpen, employee?.id]);

  const emp = employeeWithImage || employee;

  /* ================= PAYROLL FILE ================= */
  const payrollFile = {
    payCode: payroll?.payCode ?? payroll?.pay_code,
    periodStart: payroll?.periodStart ?? payroll?.start_date,
    periodEnd: payroll?.periodEnd ?? payroll?.end_date,
    numOfDays: payroll?.numOfDays ?? payroll?.num_days,
    lastPay: payroll?.last_pay,
  };

  /* ================= HELPERS ================= */
  const round = (v) => Math.round((Number(v) || 0) * 100) / 100;

  const defaultManualAdjustments = useMemo(
    () => [
      ...ADD_ADJUSTMENTS.map((label) => ({ label, amount: 0, effect: "ADD" })),
      ...DEDUCT_ADJUSTMENTS.map((label) => ({
        label,
        amount: 0,
        effect: "DEDUCT",
      })),
    ],
    [],
  );

  const computeTotals = (quincena, gov = [], loans = [], manual = []) => {
    let add = 0;
    let deduct = 0;

    gov.forEach((d) => (deduct += Number(d.amount || 0)));
    loans.forEach((l) => (deduct += Number(l.amount || 0)));

    manual.forEach((m) => {
      const amt = Number(m.amount || 0);
      if (m.effect === "ADD") add += amt;
      else deduct += amt;
    });

    return {
      totalEarnings: round(quincena + add),
      totalDeductions: round(deduct),
      netPay: round(quincena + add - deduct),
    };
  };

  const isGovType = (t) =>
    t === "SSS_PREMIUM" ||
    t === "PHILHEALTH_PREMIUM" ||
    t === "PAGIBIG_CONTRIBUTION";

  const isLoanType = (t) =>
    t === "SSS_LOAN" ||
    t === "PHILHEALTH_LOAN" ||
    t === "PAGIBIG_LOAN" ||
    t === "COMPANY_LOAN" ||
    String(t || "").includes("LOAN"); // fallback

  /* ======================================================
   SSS TABLE (EMPLOYEE SHARE / MONTHLY)
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
  // 🔹 SSS (TEMP VALUE — replace later with table)
  const computeSSS = (monthlyRate) => {
    if (!monthlyRate) return 0;

    const row = SSS_EMPLOYEE_TABLE.find(
      (r) => monthlyRate >= r.min && monthlyRate <= r.max,
    );

    return row ? row.employee : 0;
  };

/**
 * PhilHealth EMPLOYEE SHARE
 * Rule:
 * - Monthly salary
 * - Floor: 10,000
 * - Ceiling: 100,000
 * - Rate: 2.5%
 * - Employee pays 50%
 */
function computePhilHealth(monthlyBase) {
  if (!monthlyBase || monthlyBase <= 0) return 0;

  const FLOOR = 10000;
  const CEILING = 100000;
  const EMPLOYEE_RATE = 0.025;

  const base = Math.min(Math.max(monthlyBase, FLOOR), CEILING);
  return Number((base * EMPLOYEE_RATE).toFixed(2));
}

  // 🔹 Pag-IBIG (2% capped later — TEMP)
  const computePagIbig = (monthlyRate) => {
    if (!monthlyRate) return 0;
    return round(monthlyRate * 0.02);
  };

  const buildSnapshotObject = ({ manualAdjustmentsOverride } = {}) => {
    const quincena = round(payrollInfo?.basic_rate || 0);
    const monthlyRate = quincena * 2;

    // -------------------------------
    // 1️⃣ SOURCE OF DEDUCTIONS
    // -------------------------------
    const baseDeductions =
      payroll?.status === "done"
        ? (deductions || []).filter((d) => d.cutoff === activeCutoff)
        : deductions || [];

    // -------------------------------
    // 2️⃣ GOVERNMENT DEDUCTIONS
    // -------------------------------
    let govDeductions = [];

    if (payroll?.status === "done") {
      // ✅ FINALIZED → use DB values
      govDeductions = baseDeductions.filter((d) => {
        if (lastPayFlag) {
          return d.deduction_type === "PAGIBIG_CONTRIBUTION";
        }

        return (
          d.deduction_type === "SSS_PREMIUM" ||
          d.deduction_type === "PHILHEALTH_PREMIUM"
        );
      });
    } else {
      // ⏳ PENDING → COMPUTE LIVE (NO ZERO VALUES)
      if (!lastPayFlag) {
        // FIRST CUTOFF
        govDeductions = [
          {
            deduction_type: "SSS_PREMIUM",
            amount: computeSSS(monthlyRate),
          },
          {
            deduction_type: "PHILHEALTH_PREMIUM",
            amount: computePhilHealth(monthlyRate),
          },
        ];
      } else {
        // SECOND CUTOFF
        govDeductions = [
          {
            deduction_type: "PAGIBIG_CONTRIBUTION",
            amount: computePagIbig(monthlyRate),
          },
        ];
      }
    }

    // -------------------------------
    // 3️⃣ LOANS
    // -------------------------------
    const loanDeductions =
      payroll?.status === "done"
        ? baseDeductions.filter((d) => d.source === "LOAN")
        : (loanPreview || []).filter((l) => {
            // Normalize in case shape differs
            const cutoff = l.cutoff_behavior;

            if (cutoff === "FIRST_CUTOFF_ONLY") {
              return activeCutoff === "FIRST";
            }

            if (cutoff === "SECOND_CUTOFF_ONLY") {
              return activeCutoff === "SECOND";
            }

            // COMPANY_LOAN or unspecified → always deduct
            return true;
          });

    // -------------------------------
    // 4️⃣ MANUAL ADJUSTMENTS
    // -------------------------------
    const manualAdjustments =
      manualAdjustmentsOverride ??
      originalForm?.manualAdjustments ??
      form?.manualAdjustments ??
      dbSnapshot?.manualAdjustments ??
      defaultManualAdjustments;

    // -------------------------------
    // 5️⃣ TOTALS
    // -------------------------------
    const totals = computeTotals(
      quincena,
      govDeductions,
      loanDeductions,
      manualAdjustments,
    );

    return {
      status: payrollInfo?.employment_status,
      monthlyRate,
      quincenaRate: quincena,
      dailyRate: payrollInfo?.daily_rate,
      hourlyRate: payrollInfo?.hourly_rate,
      govDeductions,
      loanDeductions,
      manualAdjustments,
      ...totals,
    };
  };
  /* ================= RESET WHEN OPEN CHANGES ================= */
  useEffect(() => {
    if (!isOpen) return;

    // reset flags so when you open a different employee it rebuilds
    seededRef.current = false;
    setIsEditing(false);

    setForm(null);
    setOriginalForm(null);

    setPayrollInfo(null);

    setDeductions([]);
    setDeductionsLoaded(false);

    setLoanPreview([]);
    setLoansLoaded(false);

    setDbSnapshot(null);
    setSnapshotLoaded(false);
  }, [isOpen, employee?.id, payroll?.id]);

  /* ================= FETCH PAYROLL INFO ================= */
  useEffect(() => {
    if (!isOpen || !employee?.id) return;

    fetch(`http://localhost:5000/api/employees/${employee.id}/payroll`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          console.log("PAYROLL INFO FROM API:", j.data);
          setPayrollInfo(j.data);
        }
      })
      .catch(() => {});
  }, [isOpen, employee?.id]);

  /* ================= FETCH DEDUCTIONS ================= */
  useEffect(() => {
    if (!isOpen || !employee?.id || !payroll?.id) return;

    setDeductionsLoaded(false);

    fetch(
      `http://localhost:5000/api/payroll-files/${payroll.id}/employees/${employee.id}/deductions`,
    )
      .then((r) => r.json())
      .then((j) => setDeductions(j.success ? j.data : []))
      .finally(() => setDeductionsLoaded(true));
  }, [isOpen, employee?.id, payroll?.id]);

  /* ================= FETCH LOANS (PREVIEW) ================= */
  useEffect(() => {
    if (!isOpen || !employee?.id) return;

    // if done payroll: loans come from deductions table (source=LOAN)
    if (payroll?.status === "done") {
      console.log("⛔ Payroll is DONE — skipping loan preview");
      setLoanPreview([]);
      setLoansLoaded(true);
      return;
    }

    setLoansLoaded(false);

    fetch(`http://localhost:5000/api/employees/${employee.id}/loans`)
      .then((r) => r.json())
      .then((j) => {
        console.log("📦 RAW LOANS FROM API:", j.loans);

        const normalizedLoans =
          j.loans?.map((l) => ({
            deduction_type: l.loan_type, // SSS_LOAN, PHILHEALTH_LOAN, etc.
            amount: Number(l.monthly_amortization),
            source: "LOAN", // 🔥 REQUIRED FOR FILTERING
            cutoff_behavior: l.cutoff_behavior,
          })) || [];

        console.table(normalizedLoans); // 🔥 THIS IS WHAT YOU WANT TO SEE

        setLoanPreview(normalizedLoans);
      })
      .catch((err) => {
        console.error("❌ FETCH LOANS ERROR:", err);
        setLoanPreview([]);
      })
      .finally(() => {
        setLoansLoaded(true);
      });
  }, [isOpen, employee?.id, payroll?.status]);

  /* ================= FETCH DB SNAPSHOT ================= */
  useEffect(() => {
    if (!isOpen || !employee?.id || !payroll?.id) return;

    setSnapshotLoaded(false);

    fetch(
      `http://localhost:5000/api/payroll-files/${payroll.id}/employees/${employee.id}/snapshot`,
    )
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data) setDbSnapshot(j.data);
        else setDbSnapshot(null);
      })
      .finally(() => setSnapshotLoaded(true));
  }, [isOpen, employee?.id, payroll?.id]);

  /* ================= BUILD/REFRESH SNAPSHOT SAFELY ================= */
  useEffect(() => {
    if (!isOpen) return;
    if (!payrollInfo) return;

    // ✅ wait until everything needed for gov/loans is loaded
    if (!deductionsLoaded) return;
    if (!loansLoaded) return;
    if (!snapshotLoaded) return;

    // 🔒 never override while editing
    if (isEditing) return;

    // ✅ seed once when data is READY (gov & loans available)
    if (!seededRef.current) {
      const initial = buildSnapshotObject({
        manualAdjustmentsOverride: dbSnapshot?.manualAdjustments,
      });

      setForm(initial);
      setOriginalForm(initial);
      seededRef.current = true;
      return;
    }

    // ✅ after seeded: refresh only computed parts if gov/loans changed
    // keep manual adjustments from originalForm (saved) if present
    setForm((prev) => {
      if (!prev) return prev;

      const rebuilt = buildSnapshotObject({
        manualAdjustmentsOverride:
          originalForm?.manualAdjustments ?? prev.manualAdjustments,
      });

      // DO NOT touch originalForm here — only refresh displayed calculated snapshot
      return { ...prev, ...rebuilt };
    });
  }, [
    isOpen,
    payrollInfo,
    deductionsLoaded,
    loansLoaded,
    snapshotLoaded,
    deductions,
    loanPreview,
    dbSnapshot,
    payroll?.status,
    isEditing,
  ]);

  /* ================= UPDATE MANUAL ================= */
  const updateManual = (i, value) => {
    if (!isEditing) return;

    setForm((p) => {
      if (!p) return p;

      const list = [...(p.manualAdjustments || [])];
      list[i] = { ...list[i], amount: value === "" ? 0 : Number(value) };

      return {
        ...p,
        manualAdjustments: list,
        ...computeTotals(
          p.quincenaRate,
          p.govDeductions,
          p.loanDeductions,
          list,
        ),
      };
    });
  };

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <h2 className="font-semibold text-lg text-secondary">
            EMPLOYEE PAYROLL INFORMATION
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* EMPLOYEE INFO */}
        <div className="flex items-center gap-4 px-6 py-3 border-b">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {/*FETCH IMAGE*/}
            {emp?.image_url ? (
              <img
                src={`http://localhost:5000${emp.image_url}?v=${Date.now()}`}
                alt="Employee"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-semibold text-lg">
                {emp?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <p className="text-gray-500">{employee.department}</p>
          </div>
        </div>

        {/* RATE STRIP */}
        <div className="px-6 py-3 border-b">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Info label="Status" value={form.status} />
            <Info label="Monthly" value={form.monthlyRate} />
            <Info label="Daily Rate" value={form.dailyRate} />
            <Info label="Quincena" value={form.quincenaRate} />
            <Info label="Hourly Rate" value={form.hourlyRate} />
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LEFT */}
          <div className="border rounded-md">
            <Section title="Government Deductions">
              <Table rows={form.govDeductions} />
            </Section>

            <Section title="Loan Deductions">
              <Table rows={form.loanDeductions} />
            </Section>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">
            <div className="border rounded-md">
              <Section title="Payroll Info">
                <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                  <Info label="Payroll Code" value={payrollFile.payCode} />
                  <Info
                    label="Start"
                    value={formatDate(payrollFile.periodStart)}
                  />
                  <Info label="End" value={formatDate(payrollFile.periodEnd)} />
                  <Info label="No. of Days" value={payrollFile.numOfDays} />
                  <Info label="Last Pay" value={lastPayFlag ? "Yes" : "No"} />
                </div>
              </Section>
            </div>

            <div className="border rounded-md">
              <Section title="Manual Adjustments">
                <div className="max-h-[260px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {form.manualAdjustments.map((m, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{m.label}</td>
                          <td className="px-3 py-2 text-xs">{m.effect}</td>
                          <td className="px-3 py-2 text-right">
                            <input
                              type="number"
                              disabled={!isEditing}
                              className="border px-2 py-1 w-24 text-right rounded"
                              value={m.amount}
                              onChange={(e) => updateManual(i, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="px-6 py-3 border-t">
          <div className="flex justify-center gap-6 text-sm">
            <Info label="Total Earnings" value={form.totalEarnings} />
            <Info label="Total Deductions" value={form.totalDeductions} />
            <Info label="Net Pay" value={form.netPay} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-secondary text-bg"
              disabled={isReadOnly}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  setForm(originalForm);
                  setIsEditing(false);
                }}
                className="bg-gray-100 text-secondary"
              >
                Cancel
              </Button>

              <Button
                onClick={async () => {
                  const user = JSON.parse(localStorage.getItem("user"));
                  if (!user?.id) {
                    alert("Unauthenticated");
                    return;
                  }

                  await fetch(
                    `http://localhost:5000/api/payroll-files/${payroll.id}/employees/${employee.id}/snapshot`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "x-user-id": user.id,
                      },
                      body: JSON.stringify({ ...form, activeCutoff }),
                    },
                  );

                  setOriginalForm(form);
                  setIsEditing(false);
                }}
                className="bg-secondary text-bg"
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */
function Section({ title, children }) {
  return (
    <>
      <div className="bg-gray-100 px-4 py-2 text-sm font-semibold">{title}</div>
      {children}
    </>
  );
}

function Table({ rows }) {
  return (
    <div className="max-h-[160px] overflow-y-auto">
      <table className="w-full text-sm">
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-3 text-center text-gray-400">None</td>
            </tr>
          )}
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">{r.deduction_type || r.loan_type}</td>
              <td className="px-3 py-2 text-right">{Number(r.amount || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-primary">{label}:</span>
      <span className="px-3 py-1 bg-gray-200 rounded">{value ?? "-"}</span>
    </div>
  );
}
