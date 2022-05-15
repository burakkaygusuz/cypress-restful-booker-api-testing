declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * @description Confirms whether the API is up and running.
     * @example
     *   cy.healthCheck()
     * @see https://restful-booker.herokuapp.com/apidoc/index.html#api-Ping-Ping
     */
    healthCheck(): Chainable<any>;

    /**
     * @description Allows to create a new auth token to use for access to the PUT and DELETE /booking
     * @param {string} username - The username to log in with.
     * @param {string} password - The password to log in with.
     * @example
     *    cy.createToken('username', 'password')
     * @see https://restful-booker.herokuapp.com/apidoc/index.html#api-Auth-CreateToken
     */
    createToken(username: string, password: string): Chainable<any>;
  }
}
