describe('RecipeInput Page', () => {
    const baseUrl = 'http://localhost:5173/recipe-input'; // Adjust the route as needed
  
    beforeEach(() => {
      localStorage.setItem('username', 'testuser'); // Ensure test user context
      cy.visit(baseUrl);
    });
  
    it('renders the full form with all sections', () => {
      cy.contains('h2', 'Add a Recipe').should('be.visible');
      cy.get('input#recipeName').should('exist');
      cy.get('select#recipeCategory').should('exist');
      cy.get('select#servingSize').should('exist');
      cy.get('#ingredientsContainer').should('exist');
      cy.get('#stepsContainer').should('exist');
      cy.get('textarea#recipeNotes').should('exist');
      cy.get('select#difficultyLevel').should('exist');
      cy.get('input[type="file"]#recipeImage').should('exist');
    });
  
    it('can add additional ingredients and steps dynamically', () => {
      cy.get('.ingredient-item').should('have.length', 1);
      cy.contains('button', 'Add Ingredient').click();
      cy.get('.ingredient-item').should('have.length', 2);
  
      cy.get('#stepsContainer textarea').should('have.length', 1);
      cy.contains('button', 'Add Step').click();
      cy.get('#stepsContainer textarea').should('have.length', 2);
    });
  
    it('shows alert if required fields are missing on submit', () => {
        cy.window().then((win) => {
          cy.stub(win, 'alert').as('alert');
        });
      
        // Disable native HTML5 validation to test JS validation
        cy.get('form').invoke('attr', 'novalidate', 'true');
        
        cy.get('button[type="submit"]').click();
      
        cy.get('@alert').should('have.been.calledWith', 'Please fill in all fields and add at least one ingredient and step.');
      });
      
  
    it('submits the form with valid input (mocked alert)', () => {
      const today = new Date();
      const fakeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
  
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alert');
      });
  
      cy.get('input#recipeName').type('Test Recipe');
      cy.get('select#recipeCategory').select('mainCourse');
      cy.get('select#servingSize').select('4');
      cy.get('.ingredient-item').within(() => {
        cy.get('input[type="text"]').eq(0).type('Tomato');
        cy.get('input[type="text"]').eq(1).type('2 cups');
      });
      cy.get('select#difficultyLevel').select('easy');
      cy.get('#stepsContainer textarea').type('Chop tomatoes and cook.');
  
      // Simulate image upload
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('fake image content'),
        fileName: 'recipe.png',
        mimeType: 'image/png',
        encoding: 'utf8',
      });
  
      cy.get('button[type="submit"]').click();
      cy.get('@alert').should('have.been.calledWith', 'Recipe added successfully!');
    });
  
    it('clears the form after successful submission', () => {
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alert');
      });
  
      cy.get('input#recipeName').type('Pasta');
      cy.get('select#recipeCategory').select('mainCourse');
      cy.get('select#servingSize').select('2');
      cy.get('.ingredient-item').within(() => {
        cy.get('input[type="text"]').eq(0).type('Noodles');
        cy.get('input[type="text"]').eq(1).type('1 pack');
      });
      cy.get('select#difficultyLevel').select('medium');
      cy.get('#stepsContainer textarea').type('Boil noodles.');
  
      cy.get('button[type="submit"]').click();
      cy.get('@alert').should('have.been.called');
  
      // Confirm inputs are reset
      cy.get('input#recipeName').should('have.value', '');
      cy.get('select#recipeCategory').should('have.value', '');
      cy.get('select#servingSize').should('have.value', '');
      cy.get('.ingredient-item input').eq(0).should('have.value', '');
      cy.get('#stepsContainer textarea').eq(0).should('have.value', '');
    });
  });
  