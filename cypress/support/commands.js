Cypress.Commands.add('healthCheck', () => {
  cy.request('/ping').then((response) => {
    expect(response.status).to.eq(201);
  });
});

Cypress.Commands.add('createToken', (username, password) => {
  cy.request({
    method: 'POST',
    url: '/auth',
    headers: { 'Content-Type': 'application/json' },
    body: {
      username: username,
      password: password,
    },
  })
    .should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string');
    })
    .then((response) => {
      cy.setCookie('token', response.body.token);
    });
});
