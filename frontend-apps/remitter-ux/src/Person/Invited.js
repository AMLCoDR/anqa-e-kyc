import * as React from 'react';

import Button from '@material-ui/core/Button';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { useView } from '../Controller';

export const Invited = () => {
    const { exit, next } = useView();

    return (
        <>
            <Stack spacing={1} direction="row" justifyContent="space-between">
                {/* <Typography variant="h2" gutterBottom>Invitation Sent</Typography> */}
                <CheckCircleIcon color="success" sx={{ fontSize: 50 }} />
            </Stack>

            <Typography gutterBottom>
                Your onboarding invitation has been sent. You will be notifed when onboarding is complete.
            </Typography>

            <Stack spacing={1} direction="row" justifyContent="flex-end" sx={{ mt: 1, mb: 5 }}>
                <Button onClick={() => exit()} variant="contained">Done</Button>
            </Stack>

            <Typography variant="caption" color="text.secondary">
                <Button onClick={() => next()} sx={{ p: 0 }}>Click here</Button>
                {' '}to act as the receiver of the invitiation.
            </Typography>
        </>
    );
}

export default Invited;