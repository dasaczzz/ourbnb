describe('Pruebas para la página Profile', () => {
  beforeEach(() => {
    // Configurar el interceptor antes de visitar la página
    cy.intercept('POST', 'http://localhost:4000/login').as('loginRequest');
    
    cy.visit('/login');
    
    cy.log('Checking if login form exists');
    cy.get('[data-testid="login-form"]').should('exist');
    
    cy.log('Typing email');
    cy.get('[data-testid="email-input"]').should('be.visible').type('zorro@gmail.com');
    
    cy.log('Typing password');
    cy.get('[data-testid="password-input"]').should('be.visible').type('zorro123');
    
    cy.log('Clicking login button');
    cy.get('[data-testid="login-button"]').should('be.visible').click();
    
    // Esperar a que la autenticación se complete
    cy.wait('@loginRequest');
    
    // Visitar la página de perfil después del login exitoso
    cy.visit('/profile');
    
    // Esperar a que la página de perfil se cargue completamente
    cy.get('[data-testid="user-form"]', { timeout: 10000 }).should('exist');
  });

  it('debería mostrar la sección de reservas del usuario', () => {
    cy.get('[data-testid="bookings-title"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="bookings-grid"]').should('exist');
  });

  it('debería mostrar la sección de publicaciones del usuario', () => {
    cy.get('[data-testid="posts-title"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="posts-grid"]').should('exist');
  });

  it('debería mostrar el formulario de perfil del usuario', () => {
    cy.get('[data-testid="user-form"]').should('exist');
    cy.get('[data-testid="profile-title"]').should('be.visible');
    cy.get('[data-testid="name-input"]').should('exist');
    cy.get('[data-testid="email-input"]').should('exist');
    cy.get('[data-testid="phone-input"]').should('exist');
    cy.get('[data-testid="password-input"]').should('exist');
  });

  it('debería mostrar el botón de eliminar cuenta', () => {
    cy.get('[data-testid="delete-account-button"]').should('be.visible');
  });

  it('debería mostrar el botón de actualizar información', () => {
    cy.get('[data-testid="update-profile-button"]').should('be.visible');
  });

  it('debería mostrar la imagen de perfil del usuario', () => {
    cy.get('[data-testid="profile-image"]').should('be.visible');
  });

  it('debería mostrar el botón de editar imagen', () => {
    cy.get('[data-testid="edit-image-button"]').should('be.visible');
  });
}); 