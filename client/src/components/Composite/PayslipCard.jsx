/* ======================================================
   PayslipCard
   - PURE PRESENTATION COMPONENT
   - No fetch
   - No modal
   - No print logic
====================================================== */
const normalizeLabel = (label = "") =>
  label.replace(/\s*\/\s*(HRS|MINS)/i, "").trim();

export default function PayslipCard({ payslip }) {
  if (!payslip) return null;

  const {
    full_name,
    employee_no,
    department,
    paycode,
    period_start,
    period_end,
    transaction_code,

    quincena_rate,
    manual_adjustments = [],
    deductions = [],
    total_earnings,
    total_deductions,
    net_pay,
  } = payslip;

  const earnings = manual_adjustments.filter(
    (a) => a.effect === "ADD" && Number(a.amount) > 0,
  );

  const manualDeductions = manual_adjustments.filter(
    (a) => a.effect === "DEDUCT" && Number(a.amount) > 0,
  );

  const govDeductions = deductions.filter((d) => d.source === "GOV");
  const loanDeductions = deductions.filter((d) => d.source === "LOAN");

  return (
    <div className="border border-black p-3 text-[11px] w-full h-full payslip-card">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-2">
        <div className="font-bold text-sm">TAGUM DOCTORS HOSPITAL INC.</div>
        <div className="text-[10px]">PAYSLIP</div>
      </div>

      {/* ================= EMPLOYEE INFO ================= */}
      <div className="grid grid-cols-2 gap-x-2 mb-2">
        <div>
          <b>Name:</b> {full_name}
        </div>
        <div>
          <b>Emp No:</b> {employee_no}
        </div>
        <div>
          <b>Dept:</b> {department}
        </div>
        <div>
          <b>Payroll:</b> {paycode}
        </div>
        <div className="col-span-2">
          <b>Period:</b> {new Date(period_start).toLocaleDateString()} –{" "}
          {new Date(period_end).toLocaleDateString()}
        </div>
        <div className="col-span-2">
          <b>TXN:</b> {transaction_code}
        </div>
      </div>

      {/* ================= EARNINGS ================= */}
      <table className="w-full mb-2">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left">EARNINGS</th>
            <th className="text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic Pay</td>
            <td className="text-right">
              {Number(quincena_rate).toLocaleString()}
            </td>
          </tr>

          {earnings.map((e, i) => (
            <tr key={i}>
              <td>{normalizeLabel(e.label)}</td>
              <td className="text-right">
                {Number(e.amount).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= DEDUCTIONS ================= */}
      <table className="w-full mb-2">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left">DEDUCTIONS</th>
            <th className="text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {govDeductions.map((d, i) => (
            <tr key={`gov-${i}`}>
              <td>{d.deduction_type}</td>
              <td className="text-right">
                {Number(d.amount).toLocaleString()}
              </td>
            </tr>
          ))}

          {loanDeductions.map((d, i) => (
            <tr key={`loan-${i}`}>
              <td>{d.deduction_type}</td>
              <td className="text-right">
                {Number(d.amount).toLocaleString()}
              </td>
            </tr>
          ))}

          {manualDeductions.map((d, i) => (
            <tr key={`man-${i}`}>
              <td>{normalizeLabel(d.label)}</td>
              <td className="text-right">
                {Number(d.amount).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= SUMMARY ================= */}
      <div className="border-t border-black pt-1 mb-4">
        <div className="flex justify-between">
          <span>Gross</span>
          <b>{Number(total_earnings).toLocaleString()}</b>
        </div>
        <div className="flex justify-between">
          <span>Deductions</span>
          <b>{Number(total_deductions).toLocaleString()}</b>
        </div>
        <div className="flex justify-between font-bold text-sm">
          <span>NET PAY</span>
          <span>{Number(net_pay).toLocaleString()}</span>
        </div>
      </div>

      {/* ================= SIGNATURES ================= */}
      {/* ================= SIGNATURES ================= */}
      <div className="signature-section grid grid-cols-2 gap-6 text-[10px]">
        <div className="text-center">
          <div className="border-t border-black mt-6" />
          <span className="block">Prepared By</span>
          <span className="block text-[9px]">Signature & Date</span>
        </div>

        <div className="text-center">
          <div className="border-t border-black mt-6" />
          <span className="block mt-1">Received By</span>
          <span className="block text-[9px]">Signature & Date</span>
        </div>
      </div>
    </div>
  );
}
