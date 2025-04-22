import React, { useState } from 'react';
import { db } from './firebase'; // Assuming Firebase config is correctly initialized in firebase.js
import { collection, addDoc } from 'firebase/firestore';

export default function RecipeInput() {
  // State to handle form inputs
  const [recipeName, setRecipeName] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient: '', quantity: '' }]);
  const [recipeNotes, setRecipeNotes] = useState(''); // New state for notes
  const [difficultyLevel, setDifficultyLevel] = useState(''); // New state for difficulty level
  const [steps, setSteps] = useState(['']); // New state for steps (array of steps)
  const [recipeImage, setRecipeImage] = useState(null); // State for the image (base64)

  // Get the current user's username from localStorage
  const currentUserUsername = localStorage.getItem('username');
  
  // Function to handle ingredient changes
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  // Function to handle step changes
  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  // Function to add a new ingredient input field
  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', quantity: '' }]);
  };

  // Function to add a new step input field
  const addStep = () => {
    setSteps([...steps, '']);
  };

  // Handle image file change and convert it to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecipeImage(reader.result);  // Save the base64 string
      };
      reader.readAsDataURL(file);  // Convert image to base64
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipeName || !recipeCategory || !servingSize || ingredients.some(ingredient => !ingredient.ingredient || !ingredient.quantity) || !difficultyLevel || steps.some(step => !step)) {
      alert('Please fill in all fields and add at least one ingredient and step.');
      return;
    }

    try {
      // Add recipe to Firestore under the current user's subcollection
      const userRecipesRef = collection(db, 'users', currentUserUsername, 'recipes');
      await addDoc(userRecipesRef, {
        name: recipeName,
        category: recipeCategory,
        servings: servingSize,
        ingredients: ingredients,
        notes: recipeNotes, // Include notes when adding the recipe
        difficulty: difficultyLevel, // Include difficulty level
        steps: steps, // Include steps
        image: recipeImage, // Save the base64 image string
      });

      alert('Recipe added successfully!');
      // Clear the form after submission
      setRecipeName('');
      setRecipeCategory('');
      setServingSize('');
      setIngredients([{ ingredient: '', quantity: '' }]);
      setRecipeNotes(''); // Clear the notes field
      setDifficultyLevel(''); // Clear the difficulty level field
      setSteps(['']); // Clear the steps field
      setRecipeImage(null); // Clear the image state
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
                type="text"
                id={`quantity${index}`}
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                placeholder="e.g., 1 cup"
                required
              />
            </div>
          ))}
        </div>

        <button type="button" onClick={addIngredient}>Add Ingredient</button>

        {/* Notes Section */}
        <label htmlFor="recipeNotes">Recipe Notes (Optional):</label>
        <textarea
          id="recipeNotes"
          value={recipeNotes}
          onChange={(e) => setRecipeNotes(e.target.value)}
          placeholder="Enter any additional notes or tips for this recipe"
        />

        {/* Difficulty Level Section */}
        <label htmlFor="difficultyLevel">Difficulty Level:</label>
        <select
          id="difficultyLevel"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
          required
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Steps Section */}
        <label htmlFor="steps">Recipe Steps:</label>
        <div id="stepsContainer">
          {steps.map((step, index) => (
            <div key={index}>
              <label htmlFor={`step${index}`}>Step {index + 1}:</label>
              <textarea
                id={`step${index}`}
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>

        <button type="button" onClick={addStep}>Add Step</button>

        {/* Image Upload Section */}
        <label htmlFor="recipeImage">Recipe Image:</label>
        <input 
          type="file" 
          id="recipeImage" 
          onChange={handleImageChange} 
          accept="image/*" 
        />
        
        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
}
