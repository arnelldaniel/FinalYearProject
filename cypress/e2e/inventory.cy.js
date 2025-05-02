describe('Inventory Page', () => {
  const baseUrl = 'http://localhost:5173/Inventory'; 

  beforeEach(() => {
    localStorage.setItem('username', 'testuser'); 
    cy.visit(baseUrl);
  });

  it('renders the inventory form', () => {
    cy.contains('h2', 'Inventory Management').should('be.visible');
    cy.get('input#ingredientName').should('exist');
    cy.get('input[type="date"]').should('exist');
    cy.get('select#category').should('exist');
    cy.get('input#quantity').should('exist'); 
    cy.get('select#unit').should('exist'); 
    cy.contains('button', 'Add to Inventory').should('exist');
  });

  it('displays category options', () => {
    cy.get('select#category').within(() => {
      cy.get('option').should('have.length.greaterThan', 1);
      cy.contains('Fruits').should('exist');
      cy.contains('Vegetables').should('exist');
    });
  });

  it('can type in the form and add an item', () => {
    const testName = 'Milk';
    const testDate = new Date().toISOString().split('T')[0]; 
    const testQuantity = 2;
    const testUnit = 'l';

    cy.get('input#ingredientName').type(testName);
    cy.get('input#expirationDate').type(testDate);
    cy.get('select#category').select('Dairy');
    cy.get('input#quantity').clear().type(testQuantity); 
    cy.get('select#unit').select(testUnit); 
    cy.get('button[type="submit"]').click();

    
    cy.contains(testName).should('exist');
    cy.contains('Dairy').should('exist');
    cy.contains(testQuantity).should('exist'); 
    cy.contains(testUnit).should('exist'); 
  });

  it('shows expiration color label based on date', () => {
   
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 2); 
    const formattedDate = expiredDate.toISOString().split('T')[0]; 
    
    cy.get('input#ingredientName').type('Old Cheese');
    cy.get('input#expirationDate').type(formattedDate); 
    cy.get('select#category').select('Dairy');
    cy.get('input#quantity').clear().type(1); 
    cy.get('select#unit').select('g');
    cy.get('button[type="submit"]').click();
  
   
    cy.contains('Old Cheese')
      .parent()
      .should('contain.text', 'Expired');
  });
  

  it('can delete an inventory item (Old Cheese)', () => {
    
    cy.contains('Old Cheese').should('exist');
  
   
    cy.contains('Old Cheese')
      .parent() 
      .find('button')
      .contains('Delete') 
      .click();
  
   
    cy.wait(2000);
  
   
    cy.contains('Old Cheese').should('not.exist'); 
  });

  it('displays calendar with events', () => {
    cy.get('.fc').should('exist');
    cy.get('.fc-event-title').should('have.length.greaterThan', 0); 
  });
});
