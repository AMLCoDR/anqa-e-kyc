import React from 'react';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import { useFooter } from '../../api';
import ActionLink from '../../components/ActionLink';


export const Footer = () => {
    const { footerItems } = useFooter();
    const getYear = () => {
        return new Date().getFullYear();
    }

    return (
        <Box sx={{ backgroundColor: 'secondary.main' }}>
            <Box sx={{ padding: '4rem', flexDirection: 'column' }} >
                <Typography variant='h3' sx={{ paddingBottom: '2rem', color: 'background.default' }}>Avid AML</Typography>
                {footerItems && footerItems[0].fields.resources.map((res, index) =>
                    <Typography key={index} gutterBottom sx={{ paddingBottom: '0.8rem', color: 'background.default' }}>
                        <Link sx={{ color: 'background.default' }} component={ActionLink} to={res.fields.action}>
                            {res.fields.value}
                        </Link>
                    </Typography>
                )}
                <Box sx={{ paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }} >
                    <Typography sx={{ color: 'background.default' }}>
                        <Link sx={{ color: 'background.default' }} target="_blank" rel="noopener" component={ActionLink} to={`/document/terms-of-service`}>
                            Terms of Service
                        </Link> &nbsp;| &nbsp;
                        <Link sx={{ color: 'background.default' }} target="_blank" rel="noopener" component={ActionLink} to={`/document/privacy-policy`}>
                            Privacy Policy
                        </Link>
                    </Typography>
                    <Typography sx={{ color: 'background.default' }}>© {getYear()} Avid AML. All Rights Reserved.</Typography>
                </Box>
            </Box>
        </Box>
    );
}