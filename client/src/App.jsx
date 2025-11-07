import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css'


import LandingPage from './pages/LandingPage.jsx';

function App() {
  return (
    <div className='bg-bg min-h-screen px-4 py-4 lm:px-8 md:px-10 lg:px-12' >
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
