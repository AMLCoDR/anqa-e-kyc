import React from 'react';

import mediaQuery from 'css-mediaquery';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";

import content from '../../../data/cardGrid';
import { LayoutGrid } from './index';

const createMatchMedia = (width) => {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => { },
        removeListener: () => { },
    });
}

let container = null;

describe('LayoutGrid component', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it("should render LayoutGrid", () => {
        act(() => {
            render(
                <Router>
                    <LayoutGrid content={content} />
                </Router>,
                container
            );
        });

        expect(container.querySelector("div.MuiBox-root h2").textContent).toBe(content.fields.title);
        expect(container.querySelector("[data-cy=cardGrid-blocks]").childElementCount).toBe(content.fields.blocks.length);
    });
});