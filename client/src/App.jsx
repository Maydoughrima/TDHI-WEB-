import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

import LogInForm from './pages/LogInForm.jsx';
import UserLogin from './pages/UserLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';

function App() {
  return (
    <div className='bg-bg min-h-screen px-4 py-4 lm:px-8 md:px-10 lg:px-12'>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />          {/* Homepage, no login function */}
          <Route path="/user/login" element={<UserLogin />} />  {/* Login form with onLogin */}
          <Route path="/admin/login" element={<AdminLogin />} />{/* Login form with onLogin */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
