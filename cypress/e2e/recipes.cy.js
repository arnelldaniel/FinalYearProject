describe('Recipes Page', () => {
  const baseUrl = 'http://localhost:5173/Recipes'; // Adjust route if different

  beforeEach(() => {
    localStorage.setItem('username', 'testuser'); // Set test user
    cy.visit(baseUrl);
    cy.get('#categoryFilter').select('All Categories'); // Clear category filter before each test
    cy.get('#difficultyFilter').select(''); // Clear difficulty filter
  });

  it('checks if the recipe list loads correctly', () => {
    cy.get('ul#recipeList').should('exist'); // Ensure the recipe list exists
    cy.get('ul#recipeList li').should('have.length.greaterThan', 0); // There should be at least one recipe
  });
  

  it('filters recipes based on search input', () => {
    cy.get('#searchInput').type('Pasta');
    cy.wait(300);
  
    cy.get('ul#recipeList li').should('exist').then($items => {
      const matching = [...$items].filter(li =>
        li.innerText.toLowerCase().includes('pasta')
      );
      expect(matching.length).to.be.greaterThan(0);
    });
  });

  it('filters recipes by category (Main Course)', () => {
    cy.get('#categoryFilter').select('Main Course');
    cy.wait(300);
    cy.get('ul#recipeList li').should('exist').then($items => {
      const matching = [...$items].filter(li =>
        li.innerText.toLowerCase().includes('main course')
      );
      expect(matching.length).to.be.greaterThan(0);
    });
  });

  it('filters recipes by difficulty level (Medium)', () => {
    cy.get('#difficultyFilter').select('medium');
    cy.wait(300);
    cy.get('ul#recipeList li').should('exist').then($items => {
      const matching = [...$items].filter(li =>
        li.innerText.toLowerCase().includes('medium')
      );
      expect(matching.length).to.be.greaterThan(0);
    });
  });
  it('adds ingredients to the shopping list', () => {
    cy.get('ul#recipeList li').first().within(() => {
      cy.contains('button', 'Add Ingredients to Shopping List').click();
    });
  
    cy.on('window:alert', (text) => {
      expect(text).to.match(/(Missing ingredients added to shopping list|All ingredients are already covered)/);
    });
  });

  it('plans a recipe on a selected date', () => {
    const selectedDate = '2025-04-30';
    cy.get('input[type="date"]').type(selectedDate);
    cy.get('ul#recipeList li').first().within(() => {
      cy.contains('button', 'Plan Recipe').click();
    });
  
    cy.on('window:alert', (text) => {
      expect(text).to.contain(`planned for ${selectedDate}`);
    });
  
    cy.get('h3').contains('Planned Recipes');
    cy.get('ul').should('contain', selectedDate);
  });

  it('displays "No recipes found" when search results do not match any recipes', () => {
    cy.get('#searchInput').type('NonExistentRecipe'); // Type the search query
    cy.get('#searchInput').type('{enter}'); // Press Enter to trigger the search
  
    // Ensure that "No recipes found" message is displayed
    cy.contains('No recipes found').should('be.visible');
  });
  

  it('displays planned recipes correctly', () => {
    cy.get('h3').contains('Planned Recipes'); // Ensure the header exists
    cy.get('ul').should('have.length.greaterThan', 0); // Ensure there are planned recipes listed
  });
 

  it('ensures the category dropdown displays options correctly', () => {
    cy.get('#categoryFilter').should('exist');
    cy.get('#categoryFilter option').should('have.length.greaterThan', 1); // Check if there are more than one option
  });
});
