import React from 'react';

import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';

import { BlockPropTypes, Markdown } from '../shared';


export const Detail = ({ content }) => {

    return (
        <>
            <Grid container sx={{ padding: '3rem' }} data-test="profile-detail">
                <Grid item xs={12} sm={6}>
                    <Typography variant="h1">{content.fields.name}</Typography>
                    <Typography variant="subtitle1">{content.fields.title}</Typography>
                    <ReactMarkdown renderers={Markdown.renderers}>
                        {content.fields.bio}
                    </ReactMarkdown>
                </Grid>
                <Grid item xs={12} sm={6} container justify="flex-end">
                    <CardMedia
                        image={content.fields.picture.fields.file.url}
                        component="img"
                        title=""
                        alt={content.fields.picture.fields.description ? `Image of ${content.fields.picture.fields.description}` : ""}
                    />
                </Grid>
            </Grid>
        </>
    );
}

Detail.propTypes = BlockPropTypes;
Detail.defaultProps = {};
