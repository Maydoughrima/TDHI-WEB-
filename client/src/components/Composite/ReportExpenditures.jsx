import PrintableReport from "../UI/PrintableReport";
import { useEffect, useState } from "react";

/* ================= COLUMN CONFIG ================= */
const reportExpenditures = [
  { label: "Paycode", key: "paycode" },
  { label: "Salaries", key: "salaries_and_wages" },

  // MANUAL
  { label: "Radiology", key: "radiology_supplies", manual: true },
  { label: "Nursing", key: "nursing_supplies", manual: true },
  { label: "Affiliation", key: "affiliation_fee", manual: true },

  { label: "Food Allow.", key: "food_allowance" },
  { label: "AP SSS", key: "ap_sss" },
  { label: "AP PHIC", key: "ap_phic" },
  { label: "SSS Loan", key: "sss_salary_loan" },
  { label: "Calamity", key: "sss_calamity_loan" },
  { label: "W/Tax", key: "withholding_tax" },
  { label: "Hospital", key: "hospital_account" },
  { label: "Canteen", key: "canteen" },
  { label: "Other NSO", key: "other_nso" },
  { label: "Accured", key: "accrued_expenses" },
  { label: "Cash (DBP)", key: "cash_in_bank_dbp" },
  { label: "Total", key: "total", bold: true },
];

export default function ReportExpenditures({ filters }) {
  const [data, setData] = useState(null);
  const [manual, setManual] = useState({
    radiology_supplies: 0,
    nursing_supplies: 0,
    affiliation_fee: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const money = (v) =>
    Number(v || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!filters?.payrollFileId) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/reports/expenditures?payroll_file_id=${filters.payrollFileId}`
        );
        const json = await res.json();

        if (!json.success || !json.data) return;

        setData(json.data);
        setManual({
          radiology_supplies: Number(json.data.radiology_supplies || 0),
          nursing_supplies: Number(json.data.nursing_supplies || 0),
          affiliation_fee: Number(json.data.affiliation_fee || 0),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filters?.payrollFileId]);

  /* ================= TOTAL ================= */
  const total =
    Number(data?.cash_in_bank_dbp || 0) +
    Number(data?.ap_sss || 0) +
    Number(data?.ap_phic || 0) +
    Number(data?.sss_salary_loan || 0) +
    Number(data?.sss_calamity_loan || 0) +
    Number(data?.withholding_tax || 0) +
    Number(data?.hospital_account || 0) +
    Number(data?.canteen || 0) +
    Number(data?.other_nso || 0) +
    Number(manual.radiology_supplies || 0) +
    Number(manual.nursing_supplies || 0) +
    Number(manual.affiliation_fee || 0);

  const handleManualChange = (key, value) => {
    setManual((prev) => ({ ...prev, [key]: Number(value || 0) }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!filters?.payrollFileId) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return alert("User not authenticated");

    setSaving(true);
    try {
      await fetch("/api/reports/expenditures/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          payroll_file_id: filters.payrollFileId,
          items: [
            { type: "RADIOLOGY_SUPPLIES", amount: manual.radiology_supplies },
            { type: "NURSING_SUPPLIES", amount: manual.nursing_supplies },
            { type: "AFFILIATION_FEE", amount: manual.affiliation_fee },
          ],
        }),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ACTION BAR */}
      <div className="no-print flex justify-end gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-bgshade border border-gray-300 text-secondary px-4 py-2 rounded-md text-sm"
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <button
          onClick={() => window.print()}
          className="bg-secondary text-white px-4 py-2 rounded-md text-sm"
        >
          Print Report
        </button>
      </div>

      {/* PRINT ROOT */}
      <div id="reports-print">
        <PrintableReport
          title="EXPENDITURES REPORT"
          subtitle={`Paycode: ${data?.paycode || "-"}`}
        >
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                {reportExpenditures.map((col) => (
                  <th
                    key={col.key}
                    className="px-2 py-2 text-center text-[11px] font-semibold leading-tight whitespace-normal"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading || !data ? (
                <tr>
                  <td
                    colSpan={reportExpenditures.length}
                    className="py-4 text-center text-[11px]"
                  >
                    No records
                  </td>
                </tr>
              ) : (
                <tr>
                  {reportExpenditures.map((col) => {
                    if (col.manual) {
                      return (
                        <td
                          key={col.key}
                          className="px-2 py-1 text-center text-[11px]"
                        >
                          {/* SCREEN */}
                          <input
                            type="number"
                            className="screen-only border px-1 py-[2px] w-16 text-right text-[11px] rounded"
                            value={manual[col.key]}
                            onChange={(e) =>
                              handleManualChange(col.key, e.target.value)
                            }
                          />
                          {/* PRINT */}
                          <span className="print-only">
                            {money(manual[col.key])}
                          </span>
                        </td>
                      );
                    }

                    if (col.key === "total") {
                      return (
                        <td
                          key={col.key}
                          className="px-2 py-1 text-center text-[11px] font-semibold"
                        >
                          {money(total)}
                        </td>
                      );
                    }

                    return (
                      <td
                        key={col.key}
                        className="px-2 py-1 text-center text-[11px]"
                      >
                        {typeof data[col.key] === "number"
                          ? money(data[col.key])
                          : data[col.key] ?? "-"}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </PrintableReport>
      </div>
    </div>
  );
}
