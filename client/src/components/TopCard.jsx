import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import pfpimg from "../assets/ds1232.jpg";

export default function TopCard({title}) {
  const [dropDowned, setDropDowned] = useState(false);

  return (
    <div className="topCard-container relative bg-bg p-4 hidden md:flex shadow-md rounded-md items-center justify-between">
      <div className="Pg-name">
        <p className="text-primary text-xl font-heading font-semibold">
          {title}
        </p>
      </div>

      <div className="user-dets flex items-center">
        <div className="user-name flex items-center">
          <Link className="text-fontc text-sm font-heading font-medium">
            Admin
          </Link>

          <button
            onClick={() => setDropDowned(!dropDowned)}
            className="flex items-center ml-2"
          >
            {dropDowned ? (
              <IoChevronUp className="text-gray-500" />
            ) : (
              <IoChevronDown className="text-gray-500" />
            )}
          </button>

          <div className="img-container ml-4">
            <img
              src={pfpimg}
              alt=""
              className="w-10 h-auto rounded-full object-cover"
            />
          </div>
        </div>

        {/* DROPDOWN MENU */}
        {dropDowned && (
          <div
            className="absolute top-full right-4 mt-2 bg-bg shadow-lg rounded-md py-2 w-40 border border-gray-200 z-50"
          >
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-primary hover:bg-gray-100"
            >
              Profile
            </Link>

            <Link
              to="/logout"
              className="block px-4 py-2 text-sm text-primary hover:bg-gray-100"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
