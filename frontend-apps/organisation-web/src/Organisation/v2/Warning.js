import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';

const Warning = (props) => {
    const { title } = props;

    return (
        <Box sx={{
            padding: '0.25rem',
            borderColor: 'warning.main',
            backgroundColor: 'rgba(245, 109, 50, 0.04)',
            width: { sm: '85%', xs: '100%', md: 'auto' }
        }} display="flex" alignItems="center" border={1} borderRadius={1}>
            <ErrorIcon sx={{ color: 'warning.main' }} />
            <Box display="flex" flexWrap="wrap" paddingLeft="0.5rem">
                <Typography sx={{ color: 'warning.main' }} variant="subtitle2">
                    Complete your Organisation's {title} to use ID Verification Services
                </Typography>
            </Box>
        </Box>
    );
}
export default Warning;