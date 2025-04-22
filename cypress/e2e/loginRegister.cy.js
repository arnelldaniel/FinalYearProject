describe('LoginRegisterPage', () => {
    const baseUrl = 'http://localhost:5173';
  
    beforeEach(() => {
      cy.visit(baseUrl);
    });
  
    it('shows the Register form by default', () => {
      cy.contains('h2', 'Register').should('be.visible');
      cy.get('input[placeholder="Username"]').should('exist');
      cy.get('input[placeholder="Password"]').should('exist');
      cy.contains('button', 'Register').should('exist');
    });
  
    it('switches to Login form when clicking login link', () => {
      cy.contains('Already have an account?').contains('Login').click();
      cy.contains('h2', 'Login').should('be.visible');
      cy.get('input[placeholder="Username"]').should('exist');
      cy.get('input[placeholder="Password"]').should('exist');
      cy.contains('button', 'Login').should('exist');
    });
  
    it('switches back to Register form from Login', () => {
      cy.contains('Already have an account?').contains('Login').click();
      cy.contains('Don’t have an account?').contains('Register').click();
      cy.contains('h2', 'Register').should('be.visible');
    });
  
    it('can type in Register form fields', () => {
      cy.get('input[placeholder="Username"]').type('testuser');
      cy.get('input[placeholder="Password"]').type('password123');
    });
  
    it('can type in Login form fields after switching', () => {
      cy.contains('Login').click();
      cy.get('input[placeholder="Username"]').type('testuser');
      cy.get('input[placeholder="Password"]').type('password123');
    });
  
    it('shows alert on Register click (mocked)', () => {
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alert');
      });
  
      cy.get('input[placeholder="Username"]').type('newuser');
      cy.get('input[placeholder="Password"]').type('newpass');
      cy.contains('button', 'Register').click();
  
      cy.get('@alert').should('have.been.called');
    });
  
    it('shows alert on Login click (mocked)', () => {
      cy.contains('Login').click();
  
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alert');
      });
  
      cy.get('input[placeholder="Username"]').type('newuser');
      cy.get('input[placeholder="Password"]').type('newpass');
      cy.contains('button', 'Login').click();
  
      cy.get('@alert').should('have.been.called');
    });
  });