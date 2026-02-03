import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export default function TopCard({ title }) {
  const [dropDowned, setDropDowned] = useState(false);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  /* ===============================
     LOAD USER (WITH LIVE UPDATE)
  =============================== */
  useEffect(() => {
    const loadMe = () => {
      const storedMe = localStorage.getItem("me");
      if (storedMe) {
        setMe(JSON.parse(storedMe));
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setMe(JSON.parse(storedUser));
      }
    };

    // initial load
    loadMe();

    // 🔥 listen for live profile updates
    window.addEventListener("profile-updated", loadMe);

    return () => {
      window.removeEventListener("profile-updated", loadMe);
    };
  }, []);

  /* ===============================
     LOGOUT
  =============================== */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("me");
    navigate("/login");
  };

  return (
    <div className="topCard-container relative bg-bg p-4 hidden md:flex shadow-md rounded-md items-center justify-between">
      {/* PAGE TITLE */}
      <div className="Pg-name">
        <p className="text-secondary text-xl font-heading font-semibold">
          {title}
        </p>
      </div>

      {/* USER INFO */}
      <div className="user-dets flex items-center relative">
        <div className="user-name flex items-center">
          <span className="text-fontc text-sm font-heading font-medium">
            {me?.fullname || "User"}
          </span>

          <button
            onClick={() => setDropDowned((v) => !v)}
            className="flex items-center ml-2"
          >
            {dropDowned ? (
              <IoChevronUp className="text-gray-500" />
            ) : (
              <IoChevronDown className="text-gray-500" />
            )}
          </button>

          {/* PROFILE IMAGE */}
          <div className="img-container ml-4">
            <img
              src={
                me?.profile_image
                  ? `${me.profile_image}?v=${Date.now()}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      me?.fullname || "User"
                    )}&background=ddd&color=555`
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border"
            />
          </div>
        </div>

        {/* DROPDOWN MENU */}
        {dropDowned && (
          <div className="absolute top-full right-0 mt-2 bg-bg shadow-lg rounded-md py-2 w-40 border border-gray-200 z-50">
            <Link
              to="/user/profile"
              className="block px-4 py-2 text-sm text-primary hover:bg-gray-100"
              onClick={() => setDropDowned(false)}
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
