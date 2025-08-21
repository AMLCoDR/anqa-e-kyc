import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';

import { BlockPropTypes } from '../shared';

export const Summary = ({ content }) => {

    return (
        <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} data-test="profile-summary">
            {content.fields.picture &&
                <CardMedia sx={{ width: 'auto', height: 140, '& img': { objectFit: 'contain', maxWidth: '100%' } }}
                    image={content.fields.picture.fields.file.url}
                    component="img"
                    title=""
                    alt={content.fields.picture.fields.description ? `Image of ${content.fields.picture.fields.description}` : ""}
                />
            }
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'inherit', width: '100%', '& button': { alignItems: 'flex-start' } }}>
                <CardContent>
                    <Typography align="left" variant="h4" component="h3">{content.fields.name}</Typography>
                    <Typography align="left" variant="h5">{content.fields.title}</Typography>
                    <Typography variant="body1">{content.fields.summary}</Typography>
                </CardContent>
                <CardActions>
                    <Button component={RouterLink} to={`/profile/${content.fields.slug}`} size="small">
                        Read more
                    </Button>
                </CardActions>
            </Box>
        </Card>
    );
}

Summary.propTypes = BlockPropTypes;
Summary.defaultProps = {};
