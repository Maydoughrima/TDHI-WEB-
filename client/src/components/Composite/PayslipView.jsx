import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PayslipView() {
  const { payrollFileId } = useParams();
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/payroll-files/${payrollFileId}/payslips`
    )
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setPayslips(res.data || []);
        } else {
          setPayslips([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load payslips:", err);
        setPayslips([]);
      })
      .finally(() => setLoading(false));
  }, [payrollFileId]);

  if (loading) {
    return <div className="p-4">Loading payslips...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Payslips</h1>

      {payslips.length === 0 ? (
        <div>No payslips found.</div>
      ) : (
        payslips.map((p) => (
          <div
            key={p.employee_id}
            className="border rounded p-4 mb-4 bg-white"
          >
            <div className="font-medium">{p.full_name}</div>
            <div>Employee No: {p.employee_no}</div>
            <div>Net Pay: {Number(p.net_pay).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
