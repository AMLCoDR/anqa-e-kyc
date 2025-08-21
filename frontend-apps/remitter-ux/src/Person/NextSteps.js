import * as React from 'react';

import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';

import { useData } from '../Datasource';

export const NextSteps = () => {
    const [state] = useData();

    return (
        <>
            <Stack sx={{ my: 2 }}>
                <Typography>Details</Typography>
                <Typography variant="body2">{state.people[0].givenNames} {state.people[0].familyName}</Typography>
                <Typography variant="body2">Born {state.people[0].birthDate}</Typography>
                <Typography variant="body2">{state.people[0].relationship}</Typography>
                {/* <Typography variant="body2">Owns {state.people[0].ownership}</Typography> */}
            </Stack>

            <Stack sx={{ my: 2 }}>
                <Typography>NZ Passport</Typography>
                <Typography variant="body2">{state.id.number}</Typography>
                <Typography variant="body2">{state.id.expiryDate}</Typography>
            </Stack>

            <Stack sx={{ my: 2 }}>
                <Typography>Address</Typography>
                <Typography variant="body2">2/45 Some Way</Typography>
                <Typography variant="body2">Auckland 1025</Typography>
                <Typography variant="body2">Auckland</Typography>
                <Typography variant="body2">New Zealand</Typography>
            </Stack>
        </>
    );
}

export default NextSteps;