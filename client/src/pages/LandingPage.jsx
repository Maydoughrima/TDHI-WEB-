import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/user/login"); // general login page (can adjust to /admin/login later)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <button
        onClick={goToLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Start Now
      </button>
    </div>
  );
}
