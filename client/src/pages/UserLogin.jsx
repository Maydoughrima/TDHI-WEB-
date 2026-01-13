import LogInForm from "./LogInForm.jsx";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();

  const userLoginAPI = async (username, password) => {
    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const json = await res.json();

    if (json.success && json.user) {
      // ✅ STORE LOGGED IN USER (SOURCE OF TRUTH)
      localStorage.setItem("user", JSON.stringify(json.user));

      // optional but recommended
      navigate("/user/dashboard");
    }

    return json;
  };

  return <LogInForm onLogin={userLoginAPI} />;
}
