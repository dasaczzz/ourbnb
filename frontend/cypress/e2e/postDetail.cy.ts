describe('Pruebas para PostDetail', () => {
  beforeEach(() => {
    cy.visit('/post/682ca21436225e52a407aef3');
  });

  it('debería mostrar el título y la ubicación del post', () => {
    cy.get('[data-testid="post-title"]').should('be.visible');
    cy.get('[data-testid="post-location"]').should('be.visible');
  });

  it('debería mostrar la imagen principal y las demás', () => {
    cy.get('img').first().should('be.visible');
    
    cy.get('img').should('have.length.at.least', 1);
  });

  it('debería mostrar la información del anfitrión', () => {
    cy.contains('Anfitrión:').should('be.visible');
    cy.get('img[alt="Foto del anfitrión"]').should('be.visible');
  });

  it('debería mostrar los detalles del post', () => {
    cy.contains('Acerca de este lugar').should('be.visible');
    cy.get('[data-testid="post-description"]').should('be.visible');
    cy.contains('Lo que este lugar ofrece').should('be.visible');
  });

  it('debería mostrar el formulario de reserva', () => {
    cy.get('[data-testid="booking-form"]').should('be.visible');
  });

  it('debería mostrar la sección de reseñas', () => {
    cy.get('[data-testid="review-card"]').should('exist');
  });

  it('debería navegar al perfil del anfitrión al hacer clic en el enlace', () => {
    cy.get('[data-testid="host-link"]').click();
    
    cy.url().should('include', '/HostProfile/');
  });

  it('debería mostrar el estado de carga inicialmente', () => {
    cy.get('[data-testid="loading-state"]').should('be.visible');
  });

  it('debería renderizar la página completa de detalle del post', () => {
    cy.get('[data-testid="post-detail-page"]').should('exist');
  });
}); 