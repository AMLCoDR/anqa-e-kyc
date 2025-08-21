import * as React from 'react';

import Typography from '@material-ui/core/Typography';

export const SelfOnboard = () => {

    return (
        <>
            <Typography variant="h2" gutterBottom>{'Welcome to {{client}} onboarding'}</Typography>

            <Typography gutterBottom>
                As a key person...
            </Typography>

            <Typography gutterBottom>
                Over the course of the next few minutes you will be asked to verify your identity
                in accordance with New Zealand's AML/CFT legislation.
            </Typography>

            <Typography >
                The process should only take a few minutes...
            </Typography>
        </>
    );
}

export default SelfOnboard;