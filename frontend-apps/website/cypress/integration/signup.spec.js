/// <reference types="cypress" />

const signUpToken = Cypress.env('REACT_APP_SIGN_UP_TOKEN') || 'allow';

const email = 'danny@devito.com';
const org = 'My Org';
const contact = 'Danny DeVito';

context('Signup', () => {

    context('Beta Registration', () => {

        beforeEach(() => {
            cy.visit('/');
            cy.waitForLoadingPlaceholders();
            cy.get('header a').contains('Sign up').click();
        })

        it('should load form correctly', () => {
            cy.get('input[name="fullname"]')
            cy.get('input[name="email"]')
            cy.get('input[name="agree"]')
            cy.get('button[data-cy="submit"]').should('be.disabled');
        })

        it('should enable the submit button when fields are filled', () => {
            cy.get('input[name="fullname"]').type(contact).should('have.value', contact);
            cy.get('input[name="email"]').type(email).should('have.value', email);
            cy.get('input[name="agree"]').check();
            cy.get('button[data-cy="submit"]').should('not.be.be.disabled');
        })
    })

    context('New user', () => {
        beforeEach(() => {
            cy.visit(`/signup/${signUpToken}`, { failOnStatusCode: false });
            cy.waitForLoadingPlaceholders();
        })

        it('should load form correctly', () => {
            cy.get('input[name="email"]')
            cy.get('input[name="organisation"]')
            cy.get('input[name="contact"]')
            cy.get('input[name="password"]')
            cy.get('input[name="confirm"]')
            cy.get('input[name="agree"]')
            cy.get('button[data-cy="submit"]').should('be.disabled');
        })

        it('should show an error when password is too weak', () => {
            const pwd = 'DannyPass';
            cy.get('input[name="email"]').type(email).should('have.value', email);
            cy.get('input[name="organisation"]').type(org).should('have.value', org);
            cy.get('input[name="contact"]').type(contact).should('have.value', contact);
            cy.get('input[name="password"]').type(pwd).should('have.value', pwd);
            cy.get('input[name="confirm"]').type(pwd).should('have.value', pwd);
            cy.get('input[name="agree"]').check();
            cy.get('button[data-cy="submit"]').should('be.disabled');
        })

        it("should show an error when passwords don't match", () => {
            const pwd1 = 'D$nnyP4$$';
            const pwd2 = 'D$nnyP4ss';
            cy.get('input[name="email"]').type(email).should('have.value', email);
            cy.get('input[name="organisation"]').type(org).should('have.value', org);
            cy.get('input[name="contact"]').type(contact).should('have.value', contact);
            cy.get('input[name="password"]').type(pwd1).should('have.value', pwd1);
            cy.get('input[name="confirm"]').type(pwd2).should('have.value', pwd2);
            cy.get('input[name="agree"]').check();
            cy.get('button[data-cy="submit"]').should('be.disabled');
        })

        it('should enable the submit button when fields are filled', () => {
            const pwd = 'D$nnyP4$$';
            cy.get('input[name="email"]').type(email).should('have.value', email);
            cy.get('input[name="organisation"]').type(org).should('have.value', org);
            cy.get('input[name="contact"]').type(contact).should('have.value', contact);
            cy.get('input[name="password"]').type(pwd).should('have.value', pwd);
            cy.get('input[name="confirm"]').type(pwd).should('have.value', pwd);
            cy.get('input[name="agree"]').check();
            cy.get('button[data-cy="submit"]').should('not.be.disabled');
        })
    })
})