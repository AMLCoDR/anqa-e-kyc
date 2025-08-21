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

export const EnterId = () => {
    const [id, setId] = useState({ method: '', number: '', expiryDate: null });
    const [state] = useData();

    useEffect(() => {
        setId(state.id);
    }, [state]);

    return (
        <>
            {/* <Typography variant="h2">Verify ID</Typography> */}

            <Box component="form" sx={{ mt: 1 }} noValidate autoComplete="off">
                <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">Verification method</InputLabel>
                    <Select
                        labelId="type-label"
                        id="type"
                        label="Verification method"
                        value={id.method}
                        onChange={e => setId(prev => ({ ...prev, method: e.target.value }))}
                    >
                        <MenuItem value={'Passport'}>Passport</MenuItem>
                        <MenuItem value={'Drivers Licence'}>Drivers Licence</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField id="passport-number" label="Passport number" variant="outlined"
                        value={id.number}
                        onChange={e => setId(prev => ({ ...prev, number: e.target.value }))}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Expiry date"
                            inputFormat="dd/MM/yyyy"
                            value={id.expiryDate}
                            onChange={newVal => setId(prev => ({ ...prev, expiryDate: newVal }))}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
            </Box>
        </>
    );
}

export default EnterId;