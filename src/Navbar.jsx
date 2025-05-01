import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'; 
import './Navbar.css';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  const navigate = useNavigate(); 

  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    
    localStorage.removeItem('username');
    
    
    navigate('/'); 
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/inventory" className="nav-link">Inventory</Link>
          <Link to="/recipe-input" className="nav-link">Recipe Input</Link>
          <Link to="/recipes" className="nav-link">Recipes</Link>
          <Link to="/shopping" className="nav-link">Shopping</Link>
        </div>

        
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>

      
      <Outlet />
    </div>
  );
}
