import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';


import UserLogin from './pages/UserLogin.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';

function App() {
  return (
    <div className='bg-bgshade min-h-screen '>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />          {/* Homepage, no login function */}
          <Route path="/user/login" element={<UserLogin />} />  {/* Login form with onLogin */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
