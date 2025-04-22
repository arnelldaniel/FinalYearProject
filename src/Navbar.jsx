import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './Navbar.css';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  const navigate = useNavigate(); // Use useNavigate for navigation

  // Toggle dark mode class on the body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    // Remove username from localStorage to "log out" the user
    localStorage.removeItem('username');
    
    // Redirect the user to the login page after logout
    navigate('/'); // Change '/login' to the actual login route in your app
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

        {/* Dark Mode Toggle Button */}
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>

      {/* Outlet here to render nested routes */}
      <Outlet />
    </div>
  );
}
