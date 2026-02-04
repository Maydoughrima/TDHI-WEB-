import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";

/* AUTH */
import RequireRole from "./components/Auth/RequireRole";

/* PAGES */
import LandingPage from "./pages/LandingPage.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

/* USER / SHARED */
import UserDashboard from "./pages/UserDashboard.jsx";
import EmployeeProfile from "./pages/EmployeeProfile.jsx";
import Profile from "./pages/Profile.jsx";

/* USER ONLY */
import GenerateFiles from "./pages/GenerateFile.jsx";
import Ledger from "./pages/Ledger.jsx";
import Reports from "./pages/Reports.jsx";
import ReqLeave from "./pages/ReqLeave.jsx";

/* PAYROLL CHECKER ONLY */
import AppLeave from "./pages/ApproveLeave.jsx";
import Transactions from "./pages/Transactions.jsx";

/* SHARED */
import PayslipView from "./components/Composite/PayslipView.jsx";

function App() {
  return (
    <div className="bg-bgshade min-h-screen">
      <Router>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* DASHBOARD (USER + PAYROLL_CHECKER) */}
          <Route
            path="/user/dashboard"
            element={
              <RequireRole allowedRoles={["USER", "PAYROLL_CHECKER"]}>
                <UserDashboard />
              </RequireRole>
            }
          />

          {/* EMPLOYEE PROFILE (USER + PAYROLL_CHECKER) */}
          <Route
            path="/user/employeeprofile"
            element={
              <RequireRole allowedRoles={["USER", "PAYROLL_CHECKER"]}>
                <EmployeeProfile />
              </RequireRole>
            }
          />

          {/* 🔥 PROFILE (USER + PAYROLL_CHECKER) */}
          <Route
            path="/user/profile"
            element={
              <RequireRole allowedRoles={["USER", "PAYROLL_CHECKER"]}>
                <Profile />
              </RequireRole>
            }
          />

          {/* USER ONLY ROUTES */}
          <Route
            path="/user/generatefile"
            element={
              <RequireRole allowedRoles={["USER"]}>
                <GenerateFiles />
              </RequireRole>
            }
          />

          <Route
            path="/user/ledger"
            element={
              <RequireRole allowedRoles={["USER"]}>
                <Ledger />
              </RequireRole>
            }
          />

          <Route
            path="/user/reports"
            element={
              <RequireRole allowedRoles={["USER"]}>
                <Reports />
              </RequireRole>
            }
          />

          <Route
            path="/user/reqleave"
            element={
              <RequireRole allowedRoles={["USER"]}>
                <ReqLeave />
              </RequireRole>
            }
          />

          {/* PAYROLL CHECKER ONLY ROUTES */}
          <Route
            path="/user/appleave"
            element={
              <RequireRole allowedRoles={["PAYROLL_CHECKER"]}>
                <AppLeave />
              </RequireRole>
            }
          />

          <Route
            path="/user/transactions"
            element={
              <RequireRole allowedRoles={["USER", "PAYROLL_CHECKER"]}>
                <Transactions />
              </RequireRole>
            }
          />

          {/* SHARED (INTERNAL) */}
          <Route
            path="/payroll-files/:payrollFileId/payslips"
            element={
              <RequireRole allowedRoles={["USER", "PAYROLL_CHECKER"]}>
                <PayslipView />
              </RequireRole>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
