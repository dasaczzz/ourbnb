describe('Pruebas para la página Index', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería mostrar el botón de filtro', () => {
    cy.contains('Filtrar').should('be.visible');
  });

  it('debería abrir el panel de filtros al hacer clic en el botón', () => {
    cy.contains('Filtrar').click();
    cy.get('input[placeholder="City"]').should('be.visible');
    cy.get('input[placeholder="Country"]').should('be.visible');
    cy.get('input[placeholder="Min Price"]').should('be.visible');
    cy.get('input[placeholder="Max Price"]').should('be.visible');
  });

  it('debería filtrar por ciudad', () => {
    cy.contains('Filtrar').click();
    cy.get('input[placeholder="City"]').type('Bogota');
    cy.get('.container').should('exist');
  });

  it('debería filtrar por país', () => {
    cy.contains('Filtrar').click();
    cy.get('input[placeholder="Country"]').type('Colombia');
    cy.get('.container').should('exist');
  });

  it('debería filtrar por precio mínimo', () => {
    cy.contains('Filtrar').click();
    cy.get('input[placeholder="Min Price"]').type('100000');
    cy.get('.container').should('exist');
  });

  it('debería filtrar por precio máximo', () => {
    cy.contains('Filtrar').click();
    cy.get('input[placeholder="Max Price"]').type('500000');
    cy.get('.container').should('exist');
  });

  it('debería mostrar las tarjetas de alojamiento', () => {
    cy.get('.container').should('exist');
  });

  it('debería mostrar los filtros activos como etiquetas', () => {
    cy.contains('Filtrar').click();
    cy.get('input[placeholder="City"]').type('Bogota');
    cy.contains('City: Bogota').should('be.visible');
  });

  it('debería poder eliminar un filtro', () => {
    cy.contains('Filtrar').click();
    cy.get('input[placeholder="City"]').type('Bogota');
    cy.contains('City: Bogota').should('be.visible');
    cy.contains('City: Bogota').find('button').click();
    cy.contains('City: Bogota').should('not.exist');
  });
}); 