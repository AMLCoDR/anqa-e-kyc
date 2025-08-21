import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const RiskSelector = props => {
    const { risk, onChange } = props;

    return (
        <FormControl size="small">
            <InputLabel id="risk-selector-label">Risk</InputLabel>
            <Select
                labelId="risk-selector-label"
                id="risk-selector"
                value={risk}
                label="Risk"
                onChange={event => onChange(event.target.value)}
            >
                <MenuItem value={0}>Not set</MenuItem>
                <MenuItem value={1}>Low</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>High</MenuItem>
            </Select>
        </FormControl>
    );
};

export default RiskSelector;