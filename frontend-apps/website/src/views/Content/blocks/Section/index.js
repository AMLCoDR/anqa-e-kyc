import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import clsx from 'clsx';

import { Factory } from '../Factory';
import { BlockPropTypes } from '../shared';


export const Section = ({ content, className }) => {
    return (
        <Box sx={{ my: '5rem', className, px: 2 }} data-test="section">
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">

                <Typography sx={{ maxWidth: { xs: '20rem', sm: '35rem' } }} align='center' variant="h2" color="primary">
                    {content.fields.title}
                </Typography>

                {content.fields.introduction &&
                    <Typography align='center' variant="h5" color="textSecondary" data-test='subtitle'>
                        {content.fields.introduction}
                    </Typography>
                }
                {/* render blocks */}
                {content.fields.blocks.map((block, index) =>
                    <React.Fragment key={index}>
                        {index === 0 && block.sys.contentType.sys.id !== 'assembly'
                            ? <Factory content={block} sx={{ marginTop: 4, boxShadow: '0 0', flexDirection: 'row', '& > img': { width: '45%', height: 'auto' } }} />
                            : <Factory content={block} />
                        }
                    </React.Fragment>
                )}
            </Grid>
            <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start">
                {content.fields.ctaTitle &&
                    <Button variant="contained" href={content.fields.ctaAction} >{content.fields.ctaTitle}</Button>
                }
            </Grid>
        </Box>
    );
}

Section.propTypes = BlockPropTypes;
Section.defaultProps = {};