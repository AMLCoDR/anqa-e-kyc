import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
// import Typography from '@material-ui/core/Typography';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DesktopDatePicker from '@material-ui/lab/DesktopDatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

import { useData } from '../Datasource';

export const EnterDetails = () => {
    const [person, setPerson] = useState({ givenNames: '', familyName: '', birthDate: null, relationship: '' });
    const [state] = useData();

    useEffect(() => {
        setPerson(state.people[0]);
    }, [state]);

    return (
        <>
            {/* <Typography variant="h2">Personal Details</Typography> */}
            
            <Box component="form" sx={{ mt: 1 }} noValidate autoComplete="off">
                <FormControl fullWidth margin="normal">
                    <TextField id="given-names" label="Given names" variant="outlined"
                        value={person.givenNames}
                        onChange={e => setPerson(prev => ({ ...prev, givenNames: e.target.value }))}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField id="family-name" label="Family name" variant="outlined"
                        value={person.familyName}
                        onChange={e => setPerson(prev => ({ ...prev, familyName: e.target.value }))}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Date of birth"
                            inputFormat="dd/MM/yyyy"
                            value={person.birthDate}
                            onChange={newVal => setPerson(prev => ({ ...prev, birthDate: newVal }))}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">Relationship</InputLabel>
                    <Select
                        labelId="type-label"
                        id="type"
                        label="Relationship"
                        value={person.relationship}
                        onChange={e => setPerson(prev => ({ ...prev, relationship: e.target.value }))}
                    >
                        <MenuItem value={'Shareholder'}>Shareholder</MenuItem>
                        <MenuItem value={'Director'}>Director</MenuItem>
                        <MenuItem value={'Authorised individual'}>Authorised individual</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>
    );
}

export default EnterDetails;