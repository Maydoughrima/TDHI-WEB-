import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

/**
 * LandingPage component
 * - Can be used for homepage or login page
 * - Receives `onLogin` prop when used for login
 */
export default function LogInForm({ onLogin }) {
  const navigate = useNavigate();
  // State for login inputs and message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  /**
   * Handle form submission
   * - Calls the role-specific login function passed via onLogin
   * - Displays success or error message
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login form submitted:", username, password);

    // Make sure onLogin exists before calling
    if (!onLogin) {
      setMessage("Login function not available on this page.");
      return;
    }

    try {
      const result = await onLogin(username, password); // call API
      console.log("API response:", result);

      if (result.success) {
        // Display welcome message (can later redirect to dashboard)
        setMessage(`Welcome, ${result.admin?.fullname || result.user?.fullname}`);

        //navigate to dashboard if completed
        navigate("/user/dashboard");
        // TODO: Add JWT/localStorage and navigation
      } else {
        setMessage(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <main>
      <div className="wrapper bg-bgshade flex flex-col items-center justify-center min-h-screen max-w-[700px] mx-auto gap-4">
        {/* Logo */}
        <div className="logo-wrapper w-32 h-32 mb-4 md:w-40 md:h-40 lg:w-48 lg:h-48">
          <img
            src={logo}
            alt="logo"
            className="LogoLogin h-full w-full object-contain"
          />
        </div>

        {/* Login Form */}
        <div className="Login-forms w-full">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="p-[0.625rem] text-sm w-full border border-gray-300 rounded font-heading focus:outline-none focus:ring-2 focus:ring-accent mb-2"
            />

            <input
              type="password"
              id="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="p-[0.625rem] text-sm w-full border border-gray-300 rounded font-body focus:outline-none focus:ring-2 focus:ring-accent"
            />

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-primary text-bg text-base font-heading p-2 rounded-md mt-4"
            >
              Login
            </button>

            {/* Optional Signup / Forgot Password links */}
            {/* 
            <div className="mt-2 text-center text-sm">
              <Link to="/signup" className="text-primary">Sign Up</Link>
            </div>
            <div className="mt-1 text-center text-sm">
              <Link to="/forgot-password" className="text-accent">Forgot Password?</Link>
            </div>
            */}
          </form>

          {/* Message area */}
          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}
