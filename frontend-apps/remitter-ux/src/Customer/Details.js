import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useData } from '../Datasource';

export const NewCustomer = () => {
    const [customer, setCustomer] = useState({ name: '', type: '', purpose: '' });
    const [state] = useData();

    useEffect(() => {
        setCustomer(state.customer);
    }, [state]);

    return (
        <>
            <Typography variant="h2">Customer Details</Typography>
            <Typography variant="subtitle1">
                To get started we need to know a little about you and the main reason
                for using us
            </Typography>

            <Box component="form" sx={{ my: 1 }} noValidate autoComplete="off">
                <FormControl fullWidth margin="normal">
                    <TextField id="name" label="Customer name" variant="outlined"
                        value={customer.name}
                        onChange={e => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                        helperText="If an individual, use your name. Otherwise, add your organisation's legal name"
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">Customer type</InputLabel>
                    <Select
                        labelId="type-label"
                        id="type"
                        label="Customer type"
                        value={customer.type}
                        onChange={e => setCustomer(prev => ({ ...prev, type: e.target.value }))}
                    >
                        <MenuItem value={'Individual'}>Individual</MenuItem>
                        <MenuItem value={'Company'}>Company</MenuItem>
                        <MenuItem value={'Trust'}>Trust</MenuItem>
                        <MenuItem value={'Listed Company'}>Listed Company</MenuItem>
                        <MenuItem value={'Nominee Registry'}>Nominee Registry</MenuItem>
                        <MenuItem value={'Government Entity'}>Government Entity</MenuItem>
                        <MenuItem value={'Public/Private Enterprise'}>Public/Private Enterprise</MenuItem>
                    </Select>
                    <FormHelperText>
                        Select the option that most accurately describes you or your organisation
                    </FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField multiline={true} minRows={2} id="purpose" label="Relationship purpose" variant="outlined"
                        value={customer.purpose}
                        onChange={e => setCustomer(prev => ({ ...prev, purpose: e.target.value }))}
                        helperText="Describe the main reason you want to use our services"
                    />
                </FormControl>
            </Box>
        </>
    );
}

export default NewCustomer;