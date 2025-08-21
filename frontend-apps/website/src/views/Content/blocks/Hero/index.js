import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ActionLink from '../../../../components/ActionLink';
// import config from '../../../../config';
import { BlockPropTypes } from '../shared';

export const Hero = ({ content }) => {

    return (
        <Grid container direction="column" justifyContent="center" alignItems="center" data-test="hero" sx={{ py: '4rem', background: 'overlay.gradients.main' }} >
            <Box sx={{ maxWidth: '35rem', }}>
                <Typography align="center" sx={{ py: 4, justifyContent: 'center' }} color="primary" variant="h1" data-test="headline">{content.fields.headline}</Typography>
                <Typography align="center" variant="subtitle1" sx={{ color: 'text.secondary' }} data-test="copy">{content.fields.copy}</Typography>
            </Box>
            {content.fields.ctaLabel &&
                <Button sx={{ my: "3rem" }} component={ActionLink} data-test="ctaLabel" to={content.fields.ctaAction} variant="contained" >{content.fields.ctaLabel}</Button>
            }
            <Paper sx={{ borderRadius: '0.3rem', }} elevation={2} >
                <CardMedia component="img" data-test="heroImage" sx={{ maxWidth: '60rem' }}
                    src={content.fields.image.fields.file.url}
                    title={content.fields.image.fields.description ? `Image of ${content.fields.image.fields.description}` : ""} />
            </Paper>
        </Grid>
    );
}

Hero.propTypes = BlockPropTypes;
Hero.defaultProps = {};