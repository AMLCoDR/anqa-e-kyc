import React from 'react';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const Footer = props => {
    return (
        <Box display="flex" component="footer" justifyContent="center" py={3} px={2} mt="auto" ml="auto" mr="auto">
            <Typography variant="body2" color="text.secondary">
                Copyright &copy;&nbsp;
                <Link color="inherit" href="https://anqaml.com">
                    Avid AML
                </Link>&nbsp;
                {new Date().getFullYear()}.
            </Typography>
        </Box>
    );
};

export default Footer;
