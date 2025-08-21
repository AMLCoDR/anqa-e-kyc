/// <reference types="cypress" />

// Redirection to auth0 is redirecting to chrome-error://chromewebdata/
context.skip('Login', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.waitForLoadingPlaceholders();
        cy.get('header button').contains('Login').click();
        cy.wait(2000);
    })

    it('should redirect to auth0', () => {
        cy.url().then(currentUrl => {
            expect(currentUrl).to.include('anqa.au.auth0.com');
        });
    })

    it('should redirect to the webapp after successful login', () => {
        const user = 'integration@anqaml.com';
        const pass = 'Gac@H4@oByy6';
        cy.get('.input[name="username"]')
            .type(user)
            .should('have.value', user);
        cy.get('.input[name="password"]')
            .type(pass)
            .should('have.value', pass);
        cy.get('button[type="submit"]').click();

        cy.wait(5000);

        cy.url().then(currentUrl => {
            expect(currentUrl).to.include('app.anqaml.com');
        });
    });
})