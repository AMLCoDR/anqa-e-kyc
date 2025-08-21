import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Stack from '@material-ui/core/Stack';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useView } from '../Controller';
import { useData } from '../Datasource';

export const Invite = () => {
    const [person, setPerson] = useState({ name: '', email: '' });
    const [state] = useData();
    const { exit, next } = useView();

    useEffect(() => {
        const p = state.people[0];
        setPerson({ name: `${p.givenNames} ${p.familyName}`,email:p.email } );
    }, [state]);

    return (
        <>
            <Typography variant="h2">Invite Key Person</Typography>
            <Typography variant="subtitle1">
                Send a key person a self-onboarding link
            </Typography>

            <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
                <FormControl fullWidth margin="normal">
                    <TextField id="name" label="Name" variant="outlined"
                        value={person.name}
                        onChange={e => setPerson(prev => ({ ...prev, name: e.target.value }))}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField id="email" label="Email" variant="outlined"
                        value={person.email}
                        onChange={e => setPerson(prev => ({ ...prev, email: e.target.value }))}
                    />
                </FormControl>

                <Stack spacing={1} direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Button onClick={() => exit()} variant="outlined">Cancel</Button>
                    <Button onClick={()=>next()} variant="contained">Send</Button>
                </Stack>
            </Box>
        </>
    );
}

export default Invite;