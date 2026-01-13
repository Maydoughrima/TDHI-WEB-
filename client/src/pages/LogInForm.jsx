import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function LogInForm({ onLogin }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onLogin) {
      setMessage("Login function not available.");
      return;
    }

    try {
      const result = await onLogin(username, password);

      // ❌ Login failed
      if (!result || !result.success) {
        setMessage(result?.message || "Login failed");
        return;
      }

      // ✅ SUPPORT BOTH user/admin (future-proof)
      const loggedUser = result.user || result.admin;

      if (!loggedUser || !loggedUser.id) {
        setMessage("Invalid login response.");
        return;
      }

      // 🔐 STORE USER FOR ENTIRE APP (AUDIT LOGS DEPEND ON THIS)
      localStorage.setItem("user", JSON.stringify(loggedUser));

      setMessage(`Welcome, ${loggedUser.fullname}`);
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <main>
      <div className="wrapper bg-bgshade flex flex-col items-center justify-center min-h-screen max-w-[700px] mx-auto gap-4">
        {/* Logo */}
        <div className="logo-wrapper w-32 h-32 mb-4">
          <img
            src={logo}
            alt="logo"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className="p-2 w-full border rounded mb-2"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="p-2 w-full border rounded"   
          />

          <button
            type="submit"
            className="w-full bg-primary text-bg p-2 rounded mt-4"
          >
            Login
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-red-500">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
