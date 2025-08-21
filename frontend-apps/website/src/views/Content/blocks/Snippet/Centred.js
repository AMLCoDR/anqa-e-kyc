import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';

import { BlockPropTypes, Markdown } from '../shared';

export const Centred = ({ content }) => {

    return (
        <Box sx={{ paddingTop: 7, paddingBottom: 7 }}>
            <Typography align="center" variant="h2">{content.fields.title}</Typography>
            <ReactMarkdown sx={{ marginTop: 0.5, '&>* img': { maxWidth: '100%' } }} renderers={Markdown.renderers}>
                {content.fields.copy}
            </ReactMarkdown>
        </Box>
    );
}

Centred.propTypes = BlockPropTypes;
Centred.defaultProps = {};