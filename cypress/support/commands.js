Cypress.Commands.add('logResponse', (response) => {
    if (response.status !== 200) {
      cy.log(`Request failed with status ${response.status}`);
      cy.log(`${JSON.stringify(response.body)}`);
    }
  });