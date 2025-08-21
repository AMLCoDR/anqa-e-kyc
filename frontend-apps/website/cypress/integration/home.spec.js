/// <reference types="cypress" />

context('Home', () => {
    before(() => {
        cy.visit('/');
        cy.waitForLoadingPlaceholders();
        cy.get('[data-cy="menu-md"]').contains('Product').click();
    })

    it('should have the correct title', () => {
        cy.get('head title').contains('Avid AML')
    })

    it('should load components correctly', () => {
        cy.get('[data-cy="hero"]').should('exist').and('be.visible')
        cy.get('[data-cy="stickySection"]').should('exist').and('be.visible')
        cy.get('[data-cy="plan"]').should('exist').and('be.visible')
    })

    it('should enable the plan button', () => {
        cy.get('[data-cy="ctaPlan"]').contains('Choose Starter').click()
    })

    context('Contact Us', () => {
        beforeEach(() => {
            cy.visit('/home#contact', { failOnStatusCode: false });
        })

        it('should load form correctly', () => {
            cy.get('input[name="email"]')
            cy.get('input[name="fullname"]')
            cy.get('[data-cy="enquiry"]')
            cy.get('button[data-cy="contact"]').should('be.disabled');
        })
        it('should enable the contact button when fields are filled', () => {
            const email = 'danny@devito.com';
            const fullname = 'Danny';
            const enquiry = 'Hello';
            cy.get('input[name="email"]')
                .type(email)
                .should('have.value', email);
            cy.get('input[name="fullname"]')
                .type(fullname)
                .should('have.value', fullname);
            cy.get('[data-cy="enquiry"] textarea')
                .type(enquiry)
                .should('have.value', enquiry);
            cy.get('button[data-cy="contact"]').should('not.be.disabled');
        })
    })

})