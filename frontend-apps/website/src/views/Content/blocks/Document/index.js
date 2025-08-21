import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';

import { BlockPropTypes, Markdown } from '../shared';

export const Document = ({ content }) => {

    return (
        <Box sx={{ paddingTop: 3, paddingBottom: 3, '& h1, h6': { margin: '0, 0, 2' }, '&>* img': { maxWidth: '100%' } }} data-test="document">
            <Typography variant="h3" gutterBottom align='center'>{content.fields.title}</Typography>
            <ReactMarkdown renderers={Markdown.renderers}>
                {content.fields.body}
            </ReactMarkdown>
        </Box>
    );
}

Document.propTypes = BlockPropTypes;
Document.defaultProps = {};