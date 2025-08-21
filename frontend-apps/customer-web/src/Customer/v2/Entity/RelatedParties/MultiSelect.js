import React, { useState } from 'react';

import Autocomplete from '@material-ui/core/Autocomplete';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Stack from '@material-ui/core/Stack';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CheckIcon from '@material-ui/icons/Check';
import * as PropTypes from 'prop-types';


const relationships = ['In control', 'Key manager', 'Associate'];

export const MultiSelect = ({ options, onAction }) => {
    const [relationship, setRelationship] = useState(0);
    const [pendingValue, setPendingValue] = useState([]);

    const handleChange = (event) => {
        setRelationship(event.target.value);
    };

    const handleAdd = () => {
        setPendingValue([]);
        onAction(pendingValue, relationship)
    }

    return (
        <Stack direction="row" spacing={1} paddingBottom={1}>
            <Autocomplete
                size="small"
                sx={{ width: 200 }}
                // disableCloseOnSelect
                value={pendingValue}
                onChange={(event, newValue) => {
                    setPendingValue(newValue);
                }}
                multiple
                options={options}
                getOptionLabel={(option) => option.title}
                renderInput={params =>
                    <TextField {...params} variant="outlined" label="Link a party" />
                }
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip key={index} size="small" variant="outlined" label={option.title} {...getTagProps({ index })} />
                    ))
                }
                renderOption={(props, option, { selected }) => (
                    <MenuItem key={option.value} {...props}>
                        {option.title}{selected && <CheckIcon fontSize="small" sx={{ color: 'success.main', pl: 1 }} />}
                    </MenuItem>
                )
                }
            />
            <Box sx={{ display: 'flex', height: '2.5rem' }} >
                <FormControl size="small" variant="outlined" >
                    <InputLabel id="relationship-label">Relationship</InputLabel>
                    <Select
                        labelId="relationship-label"
                        label="Relationship"
                        value={relationship}
                        onChange={handleChange}
                    >
                        {relationships.map((name, index) =>
                            <MenuItem key={index} value={index}>{name}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <Box sx={{ pl: 1 }}>
                    <Button sx={{ pl: 1, height: '100%' }} variant="contained" onClick={() => handleAdd()}
                        startIcon={<AddCircleOutlineIcon fontSize="large" />}
                    >
                        Link
                    </Button>
                </Box>
            </Box>
        </Stack>
    );
}

export default MultiSelect;

MultiSelect.defaultProps = {
    options: [],
}

MultiSelect.propTypes = {
    options: PropTypes.array.isRequired,
    onAction: PropTypes.func.isRequired,
};
