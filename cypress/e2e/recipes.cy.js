describe('Recipes Page', () => {
  const baseUrl = 'http://localhost:5173/Recipes'; 

  beforeEach(() => {
    localStorage.setItem('username', 'testuser'); 
    cy.visit(baseUrl);
    cy.get('#categoryFilter').select('All Categories');
    cy.get('#difficultyFilter').select(''); 
  });

  it('checks if the recipe list loads correctly', () => {
    cy.get('ul#recipeList').should('exist'); 
    cy.get('ul#recipeList li').should('have.length.greaterThan', 0); 
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
    cy.get('#searchInput').type('NonExistentRecipe');
    cy.get('#searchInput').type('{enter}'); 
  
    
    cy.contains('No recipes found').should('be.visible');
  });
  

  it('displays planned recipes correctly', () => {
    cy.get('h3').contains('Planned Recipes'); 
    cy.get('ul').should('have.length.greaterThan', 0); 
  });
 

  it('ensures the category dropdown displays options correctly', () => {
    cy.get('#categoryFilter').should('exist');
    cy.get('#categoryFilter option').should('have.length.greaterThan', 1); 
  });
});
