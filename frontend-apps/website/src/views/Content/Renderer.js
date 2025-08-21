import React from 'react';

import Box from '@material-ui/core/Box';
import { useTheme, createTheme, ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';

import { Factory } from './blocks/Factory';

// page-level theme
const makeTheme = (theme, style) => createTheme({
    ...theme,
    background: style
});


export const Renderer = ({ content }) => {
    const theme = useTheme();

    // block background
    let bg = 'inherit';
    const background = (block) => {
        switch (block.sys.contentType.sys.id) {
            case 'assembly':
                return { background: block.fields.style };
            case 'snippet':
                bg = block.fields.style || (bg ? null : theme.palette.background.paper);
                return { background: bg };
            default:
                return {};
        }
    }

    return (
        <ThemeProvider theme={theme => makeTheme(theme, content.fields.style)}>
            {content.sys.contentType.sys.id === 'assembly'
                ?
                <>
                    {/* page or section layout */}
                    {content.fields.blocks.map((block, index) =>
                        <Box key={index} id={block.fields.slug} data-test={block.fields.slug} sx={{ margin: '0 calc(50% - 50vw)', padding: '0 calc(50vw - 50%)' }} style={background(block)}>
                            <Factory content={block} />
                        </Box>
                    )}

                </>
                :
                // individual component
                <Factory content={content} detail={true} />
            }
        </ThemeProvider>
    );
}

Renderer.propTypes = {
    content: PropTypes.object,
};
Renderer.defaultProps = {};