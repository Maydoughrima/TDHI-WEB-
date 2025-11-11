import LogInForm from "./LogInForm.jsx";

export default function AdminLogin() {
  const adminLoginApi = async (username, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      return await res.json();
    } catch (err) {
      console.error("Admin login failed:", err);
      return { success: false, message: "Server not reachable" };
    }
  };

  return <LogInForm onLogin={adminLoginApi} />;
}
