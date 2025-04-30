describe('Shopping List Page', () => {
  const baseUrl = 'http://localhost:5173/Shopping'; // Adjust route if different

  beforeEach(() => {
    localStorage.setItem('username', 'testuser'); // Set test user
    cy.visit(baseUrl);
  });

  it('adds an ingredient to the shopping list', () => {
    // First, navigate to the page where ingredients are added (for example, the Recipes page)
    cy.visit('http://localhost:5173/Recipes'); // Adjust this URL to match the actual recipe page route

    // Simulate adding an ingredient to the shopping list (e.g., clicking a button to add the ingredient)
    cy.get('ul#recipeList li').first().contains('button', 'Add Ingredients to Shopping List').click(); // Click the button to add ingredients to shopping list
    cy.wait(500); // Wait for the action to complete and update the shopping list in Firebase
  });

  it('checks if the shopping list loads correctly', () => {
    cy.get('#shoppingList').should('exist'); // Ensure the shopping list exists
    cy.get('#shoppingList li').should('have.length.greaterThan', 0); // There should be at least one item
  });

  it('fetches shopping list after page reload', () => {
    cy.reload(); // Reload the page
    cy.get('#shoppingList').should('exist');
    cy.get('#shoppingList li').should('have.length.greaterThan', 0); // Ensure shopping list is fetched and displayed
  });

  it('deletes an item from the shopping list', () => {
    // Ensure there's at least one item to delete
    cy.get('#shoppingList li').first().within(() => {
      cy.get('button').contains('Delete').click(); // Click delete button
    });
  });

  it('displays "No items found" after deleting all items', () => {
    cy.get('#shoppingList li').contains('No items found in your shopping list.').should('be.visible');
  });
});
