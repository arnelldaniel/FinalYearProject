import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes for React Router v6+


// Import components
import LoginRegisterPage from './LoginRegisterPage';
import Inventory from './Inventory';
import RecipeInput from './RecipeInput';
import Recipes from './Recipes';
import Shopping from './Shopping';
import Navbar from './Navbar.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login/Register Page - No Navbar */}
        <Route path="/" element={<LoginRegisterPage />} />

        {/* Navbar layout route */}
        <Route path="/" element={<Navbar />}>
          {/* Nested routes under the Navbar layout */}
          <Route path="inventory" element={<Inventory />} />
          <Route path="recipe-input" element={<RecipeInput />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="shopping" element={<Shopping />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
