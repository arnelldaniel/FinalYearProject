describe('Shopping List Page', () => {
  const baseUrl = 'http://localhost:5173/Shopping'; 

  beforeEach(() => {
    localStorage.setItem('username', 'testuser'); 
    cy.visit(baseUrl);
  });

  it('adds an ingredient to the shopping list', () => {
    
    cy.visit('http://localhost:5173/Recipes'); 

    
    cy.get('ul#recipeList li').first().contains('button', 'Add Ingredients to Shopping List').click();
    cy.wait(500); 
  });

  it('checks if the shopping list loads correctly', () => {
    cy.get('#shoppingList').should('exist'); 
    cy.get('#shoppingList li').should('have.length.greaterThan', 0);
  });

  it('fetches shopping list after page reload', () => {
    cy.reload(); 
    cy.get('#shoppingList').should('exist');
    cy.get('#shoppingList li').should('have.length.greaterThan', 0); 
  });

  it('deletes an item from the shopping list', () => {
    
    cy.get('#shoppingList li').first().within(() => {
      cy.get('button').contains('Delete').click(); 
    });
  });

  it('displays "No items found" after deleting all items', () => {
    cy.get('#shoppingList li').contains('No items found in your shopping list.').should('be.visible');
  });
});
