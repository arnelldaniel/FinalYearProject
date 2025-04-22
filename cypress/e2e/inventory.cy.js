describe('Inventory Page', () => {
    const baseUrl = 'http://localhost:5173/Inventory'; // Adjust route if different
  
    beforeEach(() => {
      localStorage.setItem('username', 'testuser'); // Set test user
      cy.visit(baseUrl);
    });
  
    it('renders the inventory form', () => {
      cy.contains('h2', 'Inventory Management').should('be.visible');
      cy.get('input[placeholder="Enter ingredient name"]').should('exist');
      cy.get('input[type="date"]').should('exist');
      cy.get('select#category').should('exist');
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
      const testDate = new Date().toISOString().split('T')[0];
  
      cy.get('input#ingredientName').type(testName);
      cy.get('input#expirationDate').type(testDate);
      cy.get('select#category').select('Dairy');
      cy.get('button[type="submit"]').click();
  
      // Assumes `loadInventory` works correctly and shows added item
      cy.contains(testName).should('exist');
      cy.contains('Dairy').should('exist');
    });
  
    it('shows expiration color label based on date', () => {
      const expiredDate = '2020-01-01';
      cy.get('input#ingredientName').type('Old Cheese');
      cy.get('input#expirationDate').type(expiredDate);
      cy.get('select#category').select('Dairy');
      cy.get('button[type="submit"]').click();
  
      // After reload, the color label should be red (Expired)
      cy.contains('Old Cheese')
        .parent()
        .should('contain.text', 'Expired');
    });
  
    it('can delete an inventory item', () => {
      const itemName = 'Test Delete Item';
      const testDate = new Date().toISOString().split('T')[0];
  
      // Add item to delete
      cy.get('input#ingredientName').type(itemName);
      cy.get('input#expirationDate').type(testDate);
      cy.get('select#category').select('Others');
      cy.get('button[type="submit"]').click();
  
      // Wait for item to show
      cy.contains(itemName).should('exist');
  
      // Delete item
      cy.contains(itemName).parent().contains('Delete').click();
  
      // Ensure item is gone
      cy.contains(itemName).should('not.exist');
    });
  
    it('displays calendar with events', () => {
      cy.get('.fc').should('exist'); // FullCalendar root element
      cy.get('.fc-event-title').should('have.length.greaterThan', 0); // At least one event loaded
    });
  });
  