const { faker } = require('@faker-js/faker');

before('Health Check', () => {
  cy.healthCheck();
});

beforeEach('Create a new token', () => {
  cy.createToken(Cypress.env('username'), Cypress.env('password'));
});

afterEach('Delete the token', () => {
  cy.clearCookie('token');
});

after('Delete the bookingId', () => {
  cy.clearLocalStorage('bookingid');
});

describe('Booker', () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  it('should create a new booking', () => {
    cy.request({
      method: 'POST',
      url: '/booking',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '2022-01-01',
          checkout: '2022-01-02',
        },
        additionalneeds: 'Breakfast',
      },
    })
      .should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('bookingid');
      })
      .then(({ body }) => {
        cy.log(`**BookingId**: ${body.bookingid}`);
        cy.window().then((win) => {
          win.sessionStorage.setItem('bookingid', body.bookingid);
        });
      });
  });

  it('should update the created booking', () => {
    cy.getCookie('token')
      .should('exist')
      .then((token) => {
        cy.window().then((win) => {
          const bookingid = win.sessionStorage.getItem('bookingid');
          cy.request({
            method: 'PUT',
            url: `/booking/${bookingid}`,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Cookie: `token=${token.value}`,
            },
            body: {
              firstname: firstName,
              lastname: lastName,
              totalprice: 110,
              depositpaid: false,
              bookingdates: {
                checkin: '2022-01-02',
                checkout: '2022-01-03',
              },
              additionalneeds: 'Dinner',
            },
          }).should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.totalprice).to.eq(110);
            expect(response.body.depositpaid).to.eq(false);
            expect(response.body.additionalneeds).to.eq('Dinner');
          });
        });
      });
  });

  it('should even update partially the updated booking', () => {
    cy.getCookie('token')
      .should('exist')
      .then((token) => {
        cy.window().then((win) => {
          const bookingid = win.sessionStorage.getItem('bookingid');
          cy.request({
            method: 'PATCH',
            url: `/booking/${bookingid}`,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Cookie: `token=${token.value}`,
            },
            body: {
              firstname: firstName,
              lastname: lastName,
            },
          }).should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.firstname).to.eq(firstName);
            expect(response.body.lastname).to.eq(lastName);
          });
        });
      });
  });

  it('should recieve a booking information by id', () => {
    cy.window().then((win) => {
      const bookingid = win.sessionStorage.getItem('bookingid');
      cy.request({
        method: 'GET',
        url: `/booking/${bookingid}`,
        headers: {
          'Content-Type': 'application/json',
        },
      }).should((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it('should find booking by firstname and lastname', () => {
    cy.window().then((win) => {
      const bookingid = win.sessionStorage.getItem('bookingid');
      cy.request({
        method: 'GET',
        url: '/booking',
        qs: {
          firstname: firstName,
          lastname: lastName,
        },
        headers: { 'Content-Type': 'application/json' },
      }).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body[0].bookingid).to.eq(parseInt(bookingid));
      });
    });
  });

  it('should delete the created booking by id', () => {
    cy.getCookie('token')
      .should('exist')
      .then((token) => {
        cy.window().then((win) => {
          const bookingid = win.sessionStorage.getItem('bookingid');
          cy.request({
            method: 'DELETE',
            url: `/booking/${bookingid}`,
            headers: {
              'Content-Type': 'application/json',
              Cookie: `token=${token.value}`,
            },
          }).should((response) => {
            expect(response.status).to.eq(201);
          });
        });
      });
  });
});
