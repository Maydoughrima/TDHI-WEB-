// ===============================
// EMPLOYEE (PERSONAL INFO)
// ===============================
export async function fetchEmployeeById(id) {
  const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employee");
  }

  const json = await res.json();
  return json.data;
}

// ===============================
// PAYROLL (SEPARATE SOURCE)
// ===============================
export async function fetchPayrollByEmployeeId(id) {
  const res = await fetch(
    `http://localhost:5000/api/employees/${id}/payroll`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch payroll");
  }

  const json = await res.json();
  return json.data; // can be null
}
