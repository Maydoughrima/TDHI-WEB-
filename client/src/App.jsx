import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';


import UserLogin from './pages/UserLogin.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
import GenerateFiles from './pages/GenerateFile.jsx';
import EmployeeProfile from './pages/EmployeeProfile.jsx';
import Transactions from './pages/Transactions.jsx';
import Ledger from './pages/Ledger.jsx';
import Reports from './pages/Reports.jsx';

function App() {
  return (
    <div className='bg-bgshade min-h-screen '>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />          {/* Homepage, no login function */}
          <Route path="/user/login" element={<UserLogin />} />  {/* Login form with onLogin */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path ="/user/generatefile" element={<GenerateFiles/>}/>
          <Route path ="/user/employeeprofile" element={<EmployeeProfile/>}/>
          <Route path ="/user/ledger" element={<Ledger/>}/>
          <Route path ="/user/reports" element={<Reports/>}/>
          <Route path ="/user/transactions" element={<Transactions/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
