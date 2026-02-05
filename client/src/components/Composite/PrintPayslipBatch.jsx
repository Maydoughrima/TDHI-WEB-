import { useEffect, useMemo, useRef, useState } from "react";
import PayslipCard from "../Composite/PayslipCard";

export default function PrintPayslipsBatch({ payrollFileId, onDone }) {
  const [payslips, setPayslips] = useState([]);
  const printed = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(
        `http://localhost:5000/api/payroll-files/${payrollFileId}/payslips`
      );
      const json = await res.json();
      if (!cancelled && json.success) setPayslips(json.data || []);
    }

    load();
    return () => (cancelled = true);
  }, [payrollFileId]);

  const pages = useMemo(() => {
    const out = [];
    for (let i = 0; i < payslips.length; i += 2) {
      out.push(payslips.slice(i, i + 2));
    }
    return out;
  }, [payslips]);

  useEffect(() => {
    if (!payslips.length || printed.current) return;
    printed.current = true;

    const afterPrint = () => {
      window.removeEventListener("afterprint", afterPrint);
      onDone?.();
    };

    window.addEventListener("afterprint", afterPrint);
    setTimeout(() => window.print(), 300);

    return () => window.removeEventListener("afterprint", afterPrint);
  }, [payslips, onDone]);

  return (
    <div id="payslip-batch-print">
      {pages.map((page, i) => (
        <div className="payslip-page" key={i}>
          {page.map((p) => (
            <div className="payslip-item" key={p.employee_id}>
              <PayslipCard payslip={p} />

            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
