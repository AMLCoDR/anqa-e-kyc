/// <reference types="cypress" />

context('Knowledge Hub', () => {
    before(() => {
        cy.visit('/knowledge-hub', { failOnStatusCode: false })
    })

    it('should have the correct title', () => {
        cy.get('head').find('title').should('have.text', "Knowledge Hub - Avid AML")
    })

    it('should load components correctly', () => {
        // check article
        cy.get('[data-cy="article-summary"]').should('exist').and('be.visible')
    })

    it('should have a Read more button', () => {
        cy.get('[data-cy="article-summary"]').find('[data-cy="readMore"]').each(($el) => {
            const href = $el.attr('href');
            expect(href.length).to.not.equal(0);
        });
    })
})