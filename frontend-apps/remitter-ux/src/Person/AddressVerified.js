import * as React from 'react';

import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export const AddressVerified = () => {

    return (
        <>
            <Stack spacing={1} direction="row">
                <Typography variant="h6" gutterBottom>Success</Typography>
                <CheckCircleIcon color="success" />
            </Stack>

            <Typography sx={{ my: 2 }}>
                John Alexander Doe
            </Typography>

            <Stack sx={{ mb: 1 }}>
                <Typography variant="body2">2/45 Some Way</Typography>
                <Typography variant="body2">Auckland 1025</Typography>
                <Typography variant="body2">Auckland</Typography>
                <Typography variant="body2">New Zealand</Typography>
            </Stack>
        </>
    );
}

export default AddressVerified;