import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';

import { BlockPropTypes } from '../shared';




export const Summary = ({ content }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);



    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} data-test="article-summary">
            <CardHeader title={
                <Typography sx={{ pb: 1 }} variant="body1">{content.fields.title}</Typography>} subheader={<Typography color="textSecondary" variant="body2" sx={{ pb: 1 }}>
                    {moment(content.sys.createdAt).format(" MMMM D, YYYY")}
                </Typography>}
                action={
                    <>
                        <IconButton onClick={handleClick} size="small" aria-label="settings">
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                        <Popover
                            id="popover"
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >

                            <Box sx={{ alignContent: 'flex-start', maxWidth: '20rem', p: 1 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Typography>Tags</Typography>
                                    <IconButton onClick={handleClose} size="small" aria-label="settings">
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                                {content.fields.tags.map((item, key) => <Chip sx={{ m: '0.25rem' }} key={key} label={item} />)}
                            </Box>

                        </Popover>
                    </>}
            />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'inherit',
                width: '100%',
                alignItems: 'flex-start'
            }}>
                {content.fields.coverImage &&
                    <CardMedia image={content.fields.coverImage.fields.file.url}
                        component="img"
                        title=""
                        alt={content.fields.coverImage.fields.description ? `Image of ${content.fields.coverImage.fields.description}` : ""}
                    />
                }
                <CardContent>
                    <Typography variant="body1" color="textSecondary">{content.fields.pullQuote}</Typography>
                </CardContent>
                <CardActions>
                    <Button
                        data-test="readMore" component={RouterLink} to={`/article/${content.fields.slug}`}
                        size="small"
                        aria-label={`More on ${content.fields.title}`}>
                        Read more
                    </Button>
                </CardActions>
            </Box>
        </Card>
    );
}

Summary.propTypes = BlockPropTypes;
Summary.defaultProps = {};