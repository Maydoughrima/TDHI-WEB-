import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

export default function LogInForm({ onLogin }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onLogin) {
      setMessage("Login service unavailable.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await onLogin(username, password);

      if (!result || !result.success) {
        setMessage(result?.message || "Invalid username or password");
        return;
      }

      const loggedUser = result.user || result.admin;

      if (!loggedUser?.id) {
        setMessage("Invalid login response.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(loggedUser));
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20" />

      {/* SUBTLE OVERLAY */}
      <div className="absolute inset-0 bg-bgshade/60 backdrop-blur-sm" />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8"
      >
        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Tagum Doctors Hospital"
            className="w-20 h-20 object-contain mb-3"
          />
          <h1 className="text-xl font-bold text-primary">
            Payroll Management System
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure access for authorized personnel
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* USERNAME */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="px-4 py-2.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 rounded-md border pr-12 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              {/* SHOW / HIDE TOGGLE */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-gray-500 hover:text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 text-center"
            >
              {message}
            </motion.p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary/90 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Tagum Doctors Hospital · All rights reserved
        </div>
      </motion.div>
    </main>
  );
}
