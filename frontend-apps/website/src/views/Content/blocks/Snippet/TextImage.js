import React from 'react';

import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';

import { BlockPropTypes } from '../shared';

export const TextImage = (props) => {
    const { content, hideImage } = props;

    return (
        <Box sx={{ py: 5, breakpoints: { sm: 100, maxWidth: '45rem', margin: '0, auto, 0' } }}>
            <Grid container spacing={2}>
                <Grid item md={hideImage ? 10 : 6} >
                    <Typography variant="h5" color="primary">{content.fields.title}</Typography>
                    {/* <Box height="0.25rem" /> */}
                    <Typography variant="h3" color="primary">{content.fields.subTitle}</Typography>
                    <Box height="0.5rem" />
                    <Typography variant="body1" color="primary">
                        {content.fields.copy}
                    </Typography>
                    {content.fields.ctaCopy &&
                        <Typography sx={{ marginTop: 6 }} variant="h3" component="p">{content.fields.ctaCopy}</Typography>
                    }
                </Grid>
                {!hideImage && content.fields.image &&
                    <Hidden mdDown>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ height: 64, width: '100vw', position: 'absolute', left: 0, zIndex: -1, overflow: 'hidden' }}>
                                <CardMedia
                                    component="img" sx={{ maxWidth: 'calc(20em + 24vw)', flex: 1, position: 'absolute', right: 'min(-10vw, -120px)', borderRadius: 2 }}
                                    image={content.fields.image.fields.file.url}
                                    title={content.fields.image.fields.description ? `Image of ${content.fields.image.fields.description}` : ""}
                                />
                            </Box>
                        </Grid>
                    </Hidden>
                }
            </Grid>
        </Box>
    );
}

TextImage.propTypes = {
    ...BlockPropTypes,
    hideImage: PropTypes.bool,
};
TextImage.defaultProps = {};