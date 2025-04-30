describe('Inventory Page', () => {
  const baseUrl = 'http://localhost:5173/Inventory'; // Adjust route if different

  beforeEach(() => {
    localStorage.setItem('username', 'testuser'); // Set test user
    cy.visit(baseUrl);
  });

  it('renders the inventory form', () => {
    cy.contains('h2', 'Inventory Management').should('be.visible');
    cy.get('input#ingredientName').should('exist');
    cy.get('input[type="date"]').should('exist');
    cy.get('select#category').should('exist');
    cy.get('input#quantity').should('exist'); // Added quantity input check
    cy.get('select#unit').should('exist'); // Added unit dropdown check
    cy.contains('button', 'Add to Inventory').should('exist');
  });

  it('displays category options', () => {
    cy.get('select#category').within(() => {
      cy.get('option').should('have.length.greaterThan', 1);
      cy.contains('Fruits').should('exist');
      cy.contains('Vegetables').should('exist');
    });
  });

  it('can type in the form and add an item (mocked success)', () => {
    const testName = 'Milk';
    const testDate = new Date().toISOString().split('T')[0]; // Correct date format
    const testQuantity = 2;
    const testUnit = 'l';

    cy.get('input#ingredientName').type(testName);
    cy.get('input#expirationDate').type(testDate);
    cy.get('select#category').select('Dairy');
    cy.get('input#quantity').clear().type(testQuantity); // Updated to handle quantity
    cy.get('select#unit').select(testUnit); // Handle unit selection
    cy.get('button[type="submit"]').click();

    // Assumes `loadInventory` works correctly and shows added item
    cy.contains(testName).should('exist');
    cy.contains('Dairy').should('exist');
    cy.contains(testQuantity).should('exist'); // Added to check quantity
    cy.contains(testUnit).should('exist'); // Added to check unit
  });

  it('shows expiration color label based on date', () => {
    const expiredDate = '2020-01-01';
    cy.get('input#ingredientName').type('Old Cheese');
    cy.get('input#expirationDate').type(expiredDate);
    cy.get('select#category').select('Dairy');
    cy.get('input#quantity').clear().type(1); // Added quantity field interaction
    cy.get('select#unit').select('g');
    cy.get('button[type="submit"]').click();

    // After reload, the color label should be red (Expired)
    cy.contains('Old Cheese')
      .parent()
      .should('contain.text', 'Expired');
  });

  it('can delete an inventory item', () => {
    // Click the delete button of the first item
    cy.contains('button', 'Delete').first().click();
  
    // Wait for Firebase to update before checking if the item is gone
    cy.wait(2000); // Adjust the wait time if necessary for Firebase to reflect the change
  
    // Ensure the item is deleted and no longer in the DOM
    cy.get('li').should('have.length', 1); // Ensure the list is empty or adjust the check as needed
  });

  it('displays calendar with events', () => {
    cy.get('.fc').should('exist'); // FullCalendar root element
    cy.get('.fc-event-title').should('have.length.greaterThan', 0); // At least one event loaded
  });
});
