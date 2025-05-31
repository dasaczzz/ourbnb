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

}); 