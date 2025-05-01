import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore';

export default function RecipeInput() {
  // State to handle form inputs
  const [recipeName, setRecipeName] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient: '', quantity: '', unit: 'g' }]);
  const [recipeNotes, setRecipeNotes] = useState(''); 
  const [difficultyLevel, setDifficultyLevel] = useState(''); 
  const [steps, setSteps] = useState(['']); 
  const [recipeImage, setRecipeImage] = useState(null); 

  
  const currentUserUsername = localStorage.getItem('username');
  
  
  const units = ['g', 'kg', 'ml', 'l', 'pcs'];

  
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  
  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  
  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', quantity: '', unit: 'g' }]);
  };

 
  const addStep = () => {
    setSteps([...steps, '']);
  };

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecipeImage(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipeName || !recipeCategory || !servingSize || ingredients.some(ingredient => !ingredient.ingredient || !ingredient.quantity) || !difficultyLevel || steps.some(step => !step)) {
      alert('Please fill in all fields and add at least one ingredient and step.');
      return;
    }

    try {
      
      const userRecipesRef = collection(db, 'users', currentUserUsername, 'recipes');
      await addDoc(userRecipesRef, {
        name: recipeName,
        category: recipeCategory,
        servings: servingSize,
        ingredients: ingredients,
        notes: recipeNotes, 
        difficulty: difficultyLevel,
        steps: steps, 
        image: recipeImage, 
      });

      alert('Recipe added successfully!');
      
      setRecipeName('');
      setRecipeCategory('');
      setServingSize('');
      setIngredients([{ ingredient: '', quantity: '', unit: 'g' }]);
      setRecipeNotes(''); 
      setDifficultyLevel(''); 
      setSteps(['']); 
      setRecipeImage(null); 
    } catch (error) {
      console.error('Error adding recipe: ', error);
    }
  };

  return (
    <div className="container">
      <h2>Add a Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="recipeName">Recipe Name:</label>
        <input
          type="text"
          id="recipeName"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Enter recipe name"
          required
        />

        <label htmlFor="recipeCategory">Category:</label>
        <select
          id="recipeCategory"
          value={recipeCategory}
          onChange={(e) => setRecipeCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          <option value="appetizer">Appetizer</option>
          <option value="mainCourse">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="beverage">Beverage</option>
          <option value="snack">Snack</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="servingSize">Serving Size:</label>
        <select
          id="servingSize"
          value={servingSize}
          onChange={(e) => setServingSize(e.target.value)}
          required
        >
          <option value="">Select serving size</option>
          <option value="1">1 person</option>
          <option value="2">2 people</option>
          <option value="4">4 people</option>
          <option value="6">6 people</option>
          <option value="8">8 people</option>
          <option value="10">10 people</option>
        </select>

        <div id="ingredientsContainer">
          <h3>Ingredients</h3>
          {ingredients.map((ingredient, index) => (
            <div className="ingredient-item" key={index}>
              <label htmlFor={`ingredient${index}`}>Ingredient {index + 1}:</label>
              <input
                type="text"
                id={`ingredient${index}`}
                value={ingredient.ingredient}
                onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                placeholder="Enter ingredient"
                required
              />
              <label htmlFor={`quantity${index}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity${index}`}
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                placeholder="e.g., 1"
                required
              />
              <label htmlFor={`unit${index}`}>Unit:</label>
              <select
                id={`unit${index}`}
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                required
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button type="button" onClick={addIngredient}>Add Ingredient</button>

        <label htmlFor="difficultyLevel">Difficulty Level:</label>
        <select
          id="difficultyLevel"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
          required
        >
          <option value="">Select difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label htmlFor="steps">Steps:</label>
        {steps.map((step, index) => (
          <div key={index}>
            <textarea
              id={`step${index}`}
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              required
            />
            <button type="button" onClick={addStep}>Add Step</button>
          </div>
        ))}

        <label htmlFor="recipeImage">Recipe Image:</label>
        <input
          type="file"
          id="recipeImage"
          onChange={handleImageChange}
        />

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
}
