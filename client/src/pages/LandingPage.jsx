import React from "react";
import Navbar from "../components/Navbar.jsx";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main>
      <div className="wrapper bg-bg flex flex-col items-center justify-center min-h-screen max-w-[700px] mx-auto gap-4">
        <div className="logo-wrapper w-32 h-32 mb-4">
          <img
            src={logo}
            alt="logo"
            className="LogoLogin h-full w-full object-contain "
          />
        </div>

        <div className="Login-forms w-full">
          <form action="">
            <input
              type="text"
              id="Username"
              placeholder="Username"
              className="p-[0.625rem] text-sm w-full border border-gray-300 rounded font-heading focus:outline-none focus:ring-2 focus:ring-accent mb-2"
            />

            <input
              type="password"
              id="Password"
              placeholder="Password"
              className="p-[0.625rem] text-sm w-full border border-gray-300 rounded font-body focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="text-complimentary w-full text-right text-sm mt-2 font-body">
              <Link>
                <p>Forgot Password?</p>
              </Link>
            </div>
          </form>
        </div>

        <div className="sbmit-wrapper w-full flex flex-col gap-2">
          <button type="submit"
          className="w-full bg-primary text-bg txt-base font-heading p-2 rounded-md"
          >
            Login
          </button>

          <button type="submit"
          className="w-full border border-primary text-primary text-base font-heading p-2 rounded-md"
          >
            Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
