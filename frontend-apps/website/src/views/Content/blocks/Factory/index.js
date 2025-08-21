import React from 'react';

import { Article } from '../Article';
import { SignUp } from '../BetaRegistration';
import { ContactUs } from '../ContactUs';
import { Document } from '../Document'
import { Hero } from '../Hero';
import { LayoutGrid } from '../LayoutGrid';
import { LayoutScroll } from '../LayoutScroll';
import { Plan } from '../Plan'
import { Profile } from '../Profile'
import { Section } from '../Section';
import { BlockPropTypes } from '../shared';
import { Snippet } from '../Snippet';

const blocks = { Article, Hero, LayoutGrid, LayoutScroll, Plan, Profile, Section, Snippet, Document, ContactUs, SignUp }
const block = (content) => {
    let name;
    if (content.sys.contentType.sys.id === 'assembly') {
        name = `Layout${(content.fields.layout || 'Grid')}`;
    } else {
        name = content.sys.contentType.sys.id;
    }

    return blocks[name.charAt(0).toUpperCase() + name.slice(1)];
}

export const Factory = props => {
    return React.createElement(block(props.content), props);
}

Factory.propTypes = BlockPropTypes;
Factory.defaultProps = {};