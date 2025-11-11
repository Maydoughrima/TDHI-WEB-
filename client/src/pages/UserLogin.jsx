import LogInForm from "./LogInForm.jsx";

export default function UserLogin() {
  const userLoginAPI = async (username, password) => {
    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  };

  return <LogInForm onLogin={userLoginAPI} />;
}
