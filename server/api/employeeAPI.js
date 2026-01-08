export async function fetchEmployeeById(id) {
  const res = await fetch(`http://localhost:5000/api/employees/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch employee");
  }

  const json = await res.json();
  return json.data;
}


