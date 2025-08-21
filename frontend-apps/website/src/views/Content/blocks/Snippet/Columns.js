import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';

import { BlockPropTypes, Markdown } from '../shared';

export const Columns = ({ content }) => {

    return (
        <Box sx={{ py: 7 }}>
            <Typography variant="h2">{content.fields.title}</Typography>
            <ReactMarkdown sx={{ marginTop: 0.5, '&>* img': { maxWidth: '100%' }, paddingTop: 2, breakpoints: { sm: 100 }, columnCount: '2', '& p:first-of-type': { marginTop: 0 }, columnGap: 40, wordBreak: 'break-word', whiteSpace: 'normal' }} renderers={Markdown.renderers}>
                {content.fields.copy}
            </ReactMarkdown>
        </Box>
    );
}
//className={clsx(classes.copy, classes.columns)}
Columns.propTypes = BlockPropTypes;
Columns.defaultProps = {};