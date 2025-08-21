import React from 'react';

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import { Link as RouterLink } from 'react-router-dom';

import { BlockPropTypes, Markdown } from '../shared';


export const Detail = ({ content }) => {

    return (
        <Container maxWidth="md">
            <Box sx={{
                my: '10rem',
                '&>* img': {
                    maxWidth: '100%',
                }
            }} data-test="article-detail">
                <Breadcrumbs sx={{ mb: 0.5 }}>
                    <Link underline="hover" color="primary" href="/knowledge-hub">
                        Knowledge Hub
                    </Link>
                    <Typography color="inherit">{content.fields.title}</Typography>
                </Breadcrumbs>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="h2" gutterBottom>{content.fields.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', my: 1, color: 'text.secondary' }}>
                    <AccessTimeIcon fontSize="2rem" />
                    <Typography sx={{ pl: 0.5 }} variant="body2" >{moment(content.sys.createdAt).format(" MMMM D, YYYY")}</Typography>
                </Box>
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle1" gutterBottom data-test="pullQuote">{content.fields.pullQuote}</Typography>
                {content.fields.author &&
                    <Link component={RouterLink} to={`/profile/${content.fields.author.fields.slug}`} >
                        <Typography variant="subtitle2" data-test="author">Written by {content.fields.author.fields.name}</Typography>
                    </Link>
                }
                <Box sx={{ color: 'text.secondary', '& h1,h2,h3': { color: 'info.main' } }}>
                    <ReactMarkdown renderers={Markdown.renderers}>
                        {content.fields.body}
                    </ReactMarkdown>
                </Box>
                {content.fields.tags &&
                    <>
                        <Divider />
                        <Typography sx={{ mt: 1 }}  >Tags</Typography>
                        {content.fields.tags.map((item, key) =>
                            <Chip sx={{ m: '0.25rem' }} key={key} label={item} />
                        )}
                    </>
                }
            </Box>
        </Container>
    );
}

Detail.propTypes = BlockPropTypes;
Detail.defaultProps = {};