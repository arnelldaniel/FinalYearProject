import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 



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
        
        <Route path="/" element={<LoginRegisterPage />} />

        
        <Route path="/" element={<Navbar />}>
          
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
