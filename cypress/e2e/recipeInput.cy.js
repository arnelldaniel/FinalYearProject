describe('RecipeInput Page', () => {
  const baseUrl = 'http://localhost:5173/recipe-input';

  beforeEach(() => {
    localStorage.setItem('username', 'testuser');
    cy.visit(baseUrl);
  });

  it('renders the full form with all sections', () => {
    cy.contains('h2', 'Add a Recipe').should('be.visible');
    cy.get('input#recipeName').should('exist');
    cy.get('select#recipeCategory').should('exist');
    cy.get('select#servingSize').should('exist');
    cy.get('.ingredient-item').should('have.length', 1);
    cy.get('select#difficultyLevel').should('exist');
    cy.get('textarea[placeholder*="Step 1"]').should('exist');
    cy.get('input[type="file"]#recipeImage').should('exist');
  });

  it('can add additional ingredients and steps dynamically', () => {
    cy.get('.ingredient-item').should('have.length', 1);
    cy.contains('button', 'Add Ingredient').click();
    cy.get('.ingredient-item').should('have.length', 2);

    cy.get('textarea[placeholder^="Step"]').should('have.length', 1);
    cy.contains('button', 'Add Step').click();
    cy.get('textarea[placeholder^="Step"]').should('have.length', 2);
  });

  it('shows alert if required fields are missing on submit', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('form').invoke('attr', 'novalidate', 'true');
    cy.get('button[type="submit"]').click();

    cy.get('@alert').should('have.been.calledWith', 'Please fill in all fields and add at least one ingredient and step.');
  });

  it('submits the form with valid input (mocked alert)', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('input#recipeName').type('Test Recipe');
    cy.get('select#recipeCategory').select('mainCourse');
    cy.get('select#servingSize').select('4');
    
    cy.get('.ingredient-item').within(() => {
      cy.get('input[type="text"]').eq(0).type('Tomato');
      cy.get('input[type="number"]').eq(0).type('2');
    });

    cy.get('select#difficultyLevel').select('easy');
    cy.get('textarea[placeholder="Step 1"]').type('Chop tomatoes and cook.');

    cy.get('input[type="file"]#recipeImage').selectFile({
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
      cy.get('input[type="number"]').eq(0).type('1');
    });

    cy.get('select#difficultyLevel').select('medium');
    cy.get('textarea[placeholder="Step 1"]').type('Boil noodles.');

    cy.get('button[type="submit"]').click();
    cy.get('@alert').should('have.been.called');

    cy.get('input#recipeName').should('have.value', '');
    cy.get('select#recipeCategory').should('have.value', '');
    cy.get('select#servingSize').should('have.value', '');
    cy.get('.ingredient-item input').eq(0).should('have.value', '');
    cy.get('textarea[placeholder="Step 1"]').should('have.value', '');
  });
});
