import * as React from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';

import { useView } from '../Controller';
import { useData } from '../Datasource';

export const SelfOnboard = () => {   
    const [state] = useData();
    const { start } = useView();

    return (
        <>
            <Typography variant="h2">Welcome</Typography>
            <Typography variant="subtitle1" gutterBottom>
                {`Welcome to ${state.tenant} onboarding.`}
            </Typography>

            <Typography sx={{ mt: 3 }}>
                To properly onboard you, we require you to verify your identity.
            </Typography>
            <Typography sx={{ mb: 3 }}>
                If you have previously registered and have an <Link to="#">Avid wallet</Link> you're almost there.
                Otherwise, we need you to provide proof of both your identity and address
            </Typography>

            <Typography variant="h4">
                {'I have an Avid wallet'}
            </Typography>
            <Typography gutterBottom>
                If you have your phone handy we can use your wallet to verify you.
            </Typography>
            <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button onClick={() => start('/person/onboarder/qr')} variant="contained">Use wallet</Button>
            </Stack>

            <Typography variant="h4">
                {'I don\'t have a wallet (yet)'}
            </Typography>
            <Typography gutterBottom>
                We will ask you a number of questions to verify your identity.
            </Typography>
        </>
    );
}

export default SelfOnboard;