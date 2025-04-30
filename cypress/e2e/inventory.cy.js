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
    // Get the current date and subtract 2 days to simulate an expired item
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 2); // Subtract 2 days from today
    const formattedDate = expiredDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    
    cy.get('input#ingredientName').type('Old Cheese');
    cy.get('input#expirationDate').type(formattedDate); // Use the calculated expired date
    cy.get('select#category').select('Dairy');
    cy.get('input#quantity').clear().type(1); // Added quantity field interaction
    cy.get('select#unit').select('g');
    cy.get('button[type="submit"]').click();
  
    // After reload, the color label should be red (Expired)
    cy.contains('Old Cheese')
      .parent()
      .should('contain.text', 'Expired');
  });
  

  it('can delete an inventory item (Old Cheese)', () => {
    // First, ensure the "Old Cheese" item is present in the list
    cy.contains('Old Cheese').should('exist');
  
    // Click the delete button for the "Old Cheese" item
    cy.contains('Old Cheese')
      .parent() // Find the parent element that contains the "Old Cheese" item
      .find('button')
      .contains('Delete') // Find the delete button inside this parent element
      .click();
  
    // Wait for Firebase to update and for the item to be removed
    cy.wait(2000); // Adjust wait time if necessary for Firebase to reflect the change
  
    // Ensure that the "Old Cheese" item is no longer in the list
    cy.contains('Old Cheese').should('not.exist'); // Verify "Old Cheese" has been removed
  });

  it('displays calendar with events', () => {
    cy.get('.fc').should('exist'); // FullCalendar root element
    cy.get('.fc-event-title').should('have.length.greaterThan', 0); // At least one event loaded
  });
});
