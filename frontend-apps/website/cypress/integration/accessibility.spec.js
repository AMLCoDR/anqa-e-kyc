const A11yOptions = {
    runOnly: {
        type: 'tag',
        //Define accessibility rules. NZ Gov web accessibility standard is based on WCAG 2.1
        values: ['wcag21aa']
    }
};

context('A11Y', () => {
    it('Home page passes A11Y test', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.checkA11y('', A11yOptions);
    });

    it('Knowledge hub page passes A11Y test', () => {
        cy.visit('/knowledge-hub', { failOnStatusCode: false });
        cy.injectAxe();
        cy.checkA11y('', A11yOptions);
    });

    it('Signup page passes A11Y test', () => {
        cy.visit('/signup', { failOnStatusCode: false });
        cy.injectAxe();
        cy.checkA11y('', A11yOptions);
    });
});