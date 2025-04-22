describe('Shopping List Page', () => {
  const baseUrl = 'http://localhost:5173/Shopping'; // Adjust route if different

  beforeEach(() => {
    localStorage.setItem('username', 'testuser'); // Set test user
    cy.visit(baseUrl);
  });

  it('checks if the shopping list loads correctly', () => {
    cy.get('#shoppingList').should('exist'); // Ensure the shopping list exists
    cy.get('#shoppingList li').should('have.length.greaterThan', 0); // There should be at least one item
  });

  it('displays shopping list items correctly', () => {
      cy.get('#shoppingList li').first().should('exist'); // Ensure at least one item exists
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
