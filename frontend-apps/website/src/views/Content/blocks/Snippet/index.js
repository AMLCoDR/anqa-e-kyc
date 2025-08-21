import React from 'react';

import { BlockPropTypes } from '../shared';
import { Centred } from './Centred';
import { Columns } from './Columns';
import { TextImage } from './TextImage';

export const Snippet = (props) => {
    let Component = null;
    switch (props.content.fields.layout) {
        case 'Centred':
            Component = Centred;
            break;
        case 'Columns':
            Component = Columns;
            break;
        default:
            Component = TextImage;
    }

    return <Component {...props} data-test="snippet" />;
};

Snippet.propTypes = BlockPropTypes;
Snippet.defaultProps = {};