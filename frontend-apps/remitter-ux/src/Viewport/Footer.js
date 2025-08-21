import * as React from 'react';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link color="inherit" href="https://anqaml.com">
                Avid AML
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Footer() {
    return (
        <Box display="flex" component="footer" justifyContent="center"
            sx={{ py: 3, px: 2, mt: 'auto', ml: 'auto', mr: 'auto' }}
        >
            <Copyright />
        </Box >
    );
}