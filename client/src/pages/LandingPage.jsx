import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import Hero1 from "../assets/hero1.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("in"));
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden text-[#03045e]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00B4D8]/20 via-transparent to-[#FF6B6B]/20 blur-3xl" />

      {/* HEADER */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Tagum Doctors Hospital"
            className="h-12 w-auto object-contain"
          />
          <div className="leading-tight">
            <div className="font-semibold">Tagum Doctors Hospital</div>
            <div className="text-xs text-slate-500">
              Payroll & HR System
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/user/login")}
          className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/70 backdrop-blur border border-white shadow hover:scale-[1.03] transition"
        >
          Access System
        </button>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-14 items-center">
        {/* LEFT */}
        <div data-reveal>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/70 border backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#00B4D8]" />
            Internal Payroll Platform
          </span>

          <h1 className="mt-6 text-[3rem] lg:text-[4.2rem] font-black leading-[1.05] tracking-tight">
         HEALARY built for
            <span className="block bg-gradient-to-r from-[#03045e] via-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">
              accuracy and trust.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-600">
            A controlled payroll system designed for hospital operations —
            with reliable computations, locked finalization, and
            print-ready outputs.
          </p>

          <div className="mt-10 flex gap-6">
            <Stat label="Payroll Runs" value="Structured" />
            <Stat label="Adjustments" value="Controlled" />
            <Stat label="Payslips" value="Audit-safe" />
          </div>
        </div>

        {/* RIGHT — FULL PHOTO */}
        <div data-reveal className="relative">
          <div className="relative rounded-[28px] overflow-hidden shadow-[0_30px_100px_rgba(3,4,94,.25)]">
            <img
              src={Hero1}
              alt="Payroll System Preview"
              className="w-full h-[520px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03045e]/50 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* FEATURES / BENTO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <Card
            title="Audit-Ready Payroll"
            desc="Snapshots, finalization locks, and consistent totals ensure every payroll run remains traceable."
          />

          <Card
            title="Reliable Reports"
            desc="Department summaries, deduction breakdowns, and totals that always match the payroll file."
          />

          <Card
            title="Print-Clean Payslips"
            desc="Designed for real-world printing with no missing values or post-finalization changes."
          />
        </div>
      </section>

      {/* MISSION / VISION (TEMP) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28 grid lg:grid-cols-2 gap-10">
        <Mission
          title="Mission"
          text="TDHI is commited in delivering altruistic and excellent healthcare service to the public regardlesss of race, 
          creed and socio-economic standing."
        />
        <Mission
          title="Vision"
          text="Leading-off holistic extraordinaire healthcare beyond time."
        />
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 text-center text-sm text-slate-500 pb-8">
        © {new Date().getFullYear()} Tagum Doctors Hospital Inc. • Internal Use
      </footer>

      {/* ANIMATIONS */}
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(18px);
          transition: all .9s cubic-bezier(.2,.8,.2,1);
        }
        [data-reveal].in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

/* ===== UI PARTS ===== */

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function Card({ title, desc }) {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur border border-white p-6 shadow hover:-translate-y-1 transition">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="mt-3 text-slate-600">{desc}</p>
    </div>
  );
}

function Mission({ title, text }) {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur border border-white p-8 shadow">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="mt-4 text-2xl font-extrabold">{text}</div>
    </div>
  );
}
