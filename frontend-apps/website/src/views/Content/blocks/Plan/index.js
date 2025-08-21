import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';
import { Link as RouterLink } from 'react-router-dom';

import { Markdown } from '../shared';

export const Plan = ({ content }) => {

    return (
        <Card sx={{ borderRadius: '0.5rem', height: '100%' }} variant="outlined" data-test="plan">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'inherit'
            }}>
                <CardActionArea component={RouterLink} to={content.fields.title === "Enterprise" ? `${content.fields.ctaAction}` : `${content.fields.ctaAction}/${content.fields.slug}`}>
                    <CardHeader sx={{ color: 'info.main', textAlign: 'center', paddingTop: '3rem' }}
                        title={<Typography variant="h6">{content.fields.title}</Typography>} subheader={""} />
                    <CardContent>
                        <Grid container direction="row" justifyContent="center" alignItems="center">
                            <Typography sx={{ color: 'info.main' }} variant="h3">{content.fields.price}</Typography>
                            {content.fields.title !== "Enterprise" && <Typography sx={{ color: 'info.main', pt: '0.5rem' }} >/month</Typography>}
                        </Grid>
                        <Typography variant="body1" sx={{ color: 'info.main' }}>
                            <ReactMarkdown renderers={Markdown.renderers}>
                                {content.fields.features}
                            </ReactMarkdown>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions sx={{ mb: '1rem' }}>
                    <Button variant="contained" fullWidth data-test="ctaPlan"
                        component={RouterLink} to={content.fields.title === "Enterprise" ? `${content.fields.ctaAction}` : `${content.fields.ctaAction}/${content.fields.slug}`} >
                        Choose {content.fields.title}
                    </Button>
                </CardActions>
            </Box>
        </Card>
    )
}

export default Plan;