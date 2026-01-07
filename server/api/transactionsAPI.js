export async function fetchTransactions({
  action = "ALL",
  status = "ALL",
  limit = 20,
  offset = 0,
} = {}) {
  const params = new URLSearchParams();

  // ✅ USE LOGICAL AND (&&)
  if (action && action !== "ALL") {
    params.append("action", action);
  }

  if (status && status !== "ALL") {
    params.append("status", status);
  }

  params.append("limit", limit);
  params.append("offset", offset);

  const res = await fetch(
    `http://localhost:5000/api/transactions?${params.toString()}`,
    {
      cache: "no-store", // 🔥 avoid stale data
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const json = await res.json();
  return json;
}
