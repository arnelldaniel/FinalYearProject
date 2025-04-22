  import React, { useState, useEffect } from 'react';
  import { db } from './firebase'; // Import your Firebase configuration and functions
  import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // For font awesome icons
  import { faHeart as solidHeart, faHeart as regularHeart } from '@fortawesome/free-solid-svg-icons';

  export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [allRecipes, setAllRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedDate, setSelectedDate] = useState(''); // Store the selected date
    const currentUserUsername = localStorage.getItem('username');
    const [plannedRecipes, setPlannedRecipes] = useState([]); // State to hold planned recipes from Firebase
    const [selectedDifficulty, setSelectedDifficulty] = useState('');


    useEffect(() => {
      if (!currentUserUsername) {
        alert('Please log in first');
        window.location.href = 'index.html'; // Redirect to login if no user is logged in
      }

      async function fetchRecipes() {
        try {
          const userRecipesRef = collection(db, 'users', currentUserUsername, 'recipes');
          const querySnapshot = await getDocs(userRecipesRef);
          const fetchedRecipes = [];
          querySnapshot.forEach(docSnapshot => {
            const recipe = docSnapshot.data();
            fetchedRecipes.push({ id: docSnapshot.id, ...recipe });
          });
          setAllRecipes(fetchedRecipes);

          const categoriesList = Array.from(new Set(fetchedRecipes.map(recipe => recipe.category)));
          setCategories(categoriesList);
        } catch (error) {
          console.error('Error retrieving recipes: ', error);
        }
      }

      fetchRecipes();
    }, [currentUserUsername]);

    useEffect(() => {
      const filteredRecipes = allRecipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(searchQuery.toLowerCase())
          );
        const matchesCategory = selectedCategory ? recipe.category === selectedCategory : true;
        const matchesDifficulty = selectedDifficulty ? recipe.difficulty === selectedDifficulty : true;
        return matchesSearch && matchesCategory && matchesDifficulty;
      });
    
      setRecipes(filteredRecipes);
    }, [searchQuery, selectedCategory, selectedDifficulty, allRecipes]);

    useEffect(() => {
      async function fetchPlannedRecipes() {
        try {
          const plannedRecipesRef = collection(db, 'users', currentUserUsername, 'plannedRecipes');
          const querySnapshot = await getDocs(plannedRecipesRef);
          const fetchedPlannedRecipes = [];
          querySnapshot.forEach(docSnapshot => {
            const plannedRecipe = docSnapshot.data();
            fetchedPlannedRecipes.push({ id: docSnapshot.id, ...plannedRecipe });
          });
          setPlannedRecipes(fetchedPlannedRecipes);
        } catch (error) {
          console.error('Error retrieving planned recipes: ', error);
        }
      }

      fetchPlannedRecipes();
    }, [currentUserUsername]);

    const deleteRecipe = async (recipeId) => {
      try {
        const recipeRef = doc(db, 'users', currentUserUsername, 'recipes', recipeId);
        await deleteDoc(recipeRef);
        alert('Recipe deleted successfully!');
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      } catch (error) {
        console.error('Error deleting recipe: ', error);
      }
    };

    const toggleFavorite = async (recipeId, isFavorite) => {
      try {
        const recipeRef = doc(db, 'users', currentUserUsername, 'recipes', recipeId);
        await updateDoc(recipeRef, { favorite: !isFavorite });
        setRecipes(recipes.map(recipe => recipe.id === recipeId ? { ...recipe, favorite: !isFavorite } : recipe));
      } catch (error) {
        console.error('Error updating favorite status: ', error);
      }
    };
    const deletePlannedRecipe = async (plannedRecipeId) => {
      try {
        const plannedRecipeRef = doc(db, 'users', currentUserUsername, 'plannedRecipes', plannedRecipeId);
        await deleteDoc(plannedRecipeRef);
        alert('Planned recipe deleted successfully!');
        
        // Update the plannedRecipes state to reflect the deletion
        setPlannedRecipes(plannedRecipes.filter(recipe => recipe.id !== plannedRecipeId));
      } catch (error) {
        console.error('Error deleting planned recipe: ', error);
      }
    };
    

    const addToShoppingList = async (ingredients) => {
      const shoppingListRef = collection(db, 'users', currentUserUsername, 'shoppingList');
      const inventoryRef = collection(db, 'users', currentUserUsername, 'inventory');

      try {
        const inventorySnapshot = await getDocs(inventoryRef);
        const inventoryItems = inventorySnapshot.docs.map(doc => doc.data().name.toLowerCase());

        let ingredientsAdded = 0;

        for (let ingredient of ingredients) {
          if (!inventoryItems.includes(ingredient.ingredient.toLowerCase())) {
            await addDoc(shoppingListRef, {
              name: ingredient.ingredient,
              quantity: ingredient.quantity,
            });
            ingredientsAdded++;
          }
        }

        if (ingredientsAdded > 0) {
          alert('Ingredients added to shopping list!');
        } else {
          alert('All ingredients are already in inventory!');
        }
      } catch (error) {
        console.error('Error adding ingredient to shopping list: ', error);
      }
    };
    const makeRecipe = async (recipeId) => {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;
    
      const inventoryRef = collection(db, 'users', currentUserUsername, 'inventory');
      const inventorySnapshot = await getDocs(inventoryRef);
      const inventoryItems = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
      // Check if all ingredients are available in the inventory
      const missingIngredients = [];
    
      // Check each ingredient in the recipe against the inventory
      for (let ingredient of recipe.ingredients) {
        const itemInInventory = inventoryItems.find(item => item.name.toLowerCase() === ingredient.ingredient.toLowerCase());
    
        if (!itemInInventory) {
          missingIngredients.push(ingredient.ingredient);
        }
      }
    
      if (missingIngredients.length > 0) {
        // Some ingredients are missing
        alert(`Missing ingredients: ${missingIngredients.join(', ')}`);
        return;
      }
    
      // If all ingredients are available, proceed with making the recipe and removing from inventory
      for (let ingredient of recipe.ingredients) {
        const itemInInventory = inventoryItems.find(item => item.name.toLowerCase() === ingredient.ingredient.toLowerCase());
    
        if (itemInInventory) {
          try {
            // Remove item from inventory
            await deleteDoc(doc(db, 'users', currentUserUsername, 'inventory', itemInInventory.id));
          } catch (error) {
            console.error('Error removing ingredient from inventory:', error);
          }
        }
      }
    
      alert(`Recipe "${recipe.name}" has been made! Ingredients removed from inventory.`);
    };
    const formatCategoryName = (category) => {
      return category
        .replace(/([A-Z])/g, ' $1')  // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase());  // Capitalize the first letter
    };
    

    const planRecipeOnDate = async (recipeId) => {
      if (!selectedDate) {
        alert('Please select a date first!');
        return;
      }

      const recipe = allRecipes.find(r => r.id === recipeId);
      if (recipe) {
        const plannedRecipe = {
          date: selectedDate,
          recipeId: recipe.id,
          name: recipe.name,
          category: recipe.category,
        };

        try {
          const plannedRecipesRef = collection(db, 'users', currentUserUsername, 'plannedRecipes');
          await addDoc(plannedRecipesRef, plannedRecipe);

          alert(`Recipe "${recipe.name}" planned for ${selectedDate}`);
        } catch (error) {
          console.error('Error saving planned recipe: ', error);
        }
      }
    };

    return (
      <div className='recipesPage'>
        <div className="container">
          <h2>Recipe List</h2>

          <input
            type="text"
            id="searchInput"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <select
  id="difficultyFilter"
  value={selectedDifficulty}
  onChange={(e) => setSelectedDifficulty(e.target.value)}
>
  <option value="">All Difficulty Levels</option>
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>

          <select
            id="categoryFilter"
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
  {categories.map(category => (
    <option key={category} value={category}>
      {formatCategoryName(category)}
    </option>
  ))}
</select>

          <ul id="recipeList">
            {recipes.length > 0 ? recipes.map((recipe) => {
              const isFavorite = recipe.favorite || false;

              return (
                <li key={recipe.id}>
                  <h3>{recipe.name}</h3>
                  <p><strong>Category:</strong> {formatCategoryName(recipe.category)}</p>
                  <p><strong>Serving Size:</strong> {recipe.servings}</p>
                  <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                  {recipe.image && <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: 'auto' }} />}


                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient.quantity} of {ingredient.ingredient}</li>
                    ))}
                  </ul>
                  <p><strong>Steps:</strong></p>
  <ol>
    {recipe.steps && recipe.steps.map((step, index) => (
      <li key={index}>{step}</li>
    ))}
  </ol>
                  <p><strong>Notes:</strong> {recipe.notes}</p> {/* Display the notes here */}
                  <button onClick={() => addToShoppingList(recipe.ingredients)}>Add to Shopping List</button>
                  <button onClick={() => toggleFavorite(recipe.id, isFavorite)}>
                    <FontAwesomeIcon icon={isFavorite ? solidHeart : regularHeart} color={isFavorite ? 'red' : ''} />
                  </button>
                  <button onClick={() => deleteRecipe(recipe.id)}>Delete Recipe</button>
                  <button onClick={() => planRecipeOnDate(recipe.id)}>Plan on Calendar</button>
                  <button onClick={() => makeRecipe(recipe.id)}>Make Recipe</button>

                </li>
              );
            }) : (
              <li>No recipes found.</li>
            )}
          </ul>

          <h2>Recipe Planner</h2>
          <label>Select a Date: </label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
          <h3>Planned Recipes</h3>
<ul>
  {plannedRecipes.length > 0 ? plannedRecipes.map((plan, index) => (
    <li key={index}>
      {plan.date}: {plan.name} 
      <button onClick={() => deletePlannedRecipe(plan.id)}>Delete</button> {/* Add the delete button */}
    </li>
  )) : (
    <li>No planned recipes.</li>
  )}
</ul>
        </div>
      </div>
    );
  }
