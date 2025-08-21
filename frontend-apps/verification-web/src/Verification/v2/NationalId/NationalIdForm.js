import React, { useState } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import * as PropTypes from 'prop-types';

export const NationalIdForm = ({ onValid }) => {
    const matchCountries = COUNTRY_LIST;

    const [params, setParams] = useState({
        countryCode: matchCountries[0].code,
        nationalId: ''
    });

    const handleCountryChange = (event) => {
        updateParams({ ...params, countryCode: event.target.value, });
    };
    const handleNationalIdChange = (event) => {
        updateParams({ ...params, nationalId: event.target.value, });
    };

    const updateParams = (params) => {
        setParams(params);

        if (params.countryCode && params.nationalId) {
            onValid(params);
        } else {
            onValid(null);
        }
    }

    return (
        <React.Fragment>
            <TextField select label='Country' value={params.countryCode} onChange={handleCountryChange}
                variant="outlined" margin="dense" fullWidth data-test="national-id-country" >
                {COUNTRY_LIST.map((c) => (
                    <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>
                ))}
            </TextField>
            <TextField label="National ID" value={params.nationalId} onChange={handleNationalIdChange}
                variant="outlined" margin="dense" fullWidth data-test="national-id-number" />
        </React.Fragment>
    )
};

NationalIdForm.propTypes = {
    entity: PropTypes.object,
    onValid: PropTypes.func.isRequired,
};

export default NationalIdForm;

const COUNTRY_LIST = [
    { code: 'AU', name: 'Australia' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BR', name: 'Brazil' },
    { code: 'CA', name: 'Canada' },
    { code: 'CN', name: 'China' },
    { code: 'DK', name: 'Denmark' },
    { code: 'EG', name: 'Egypt' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'IN', name: 'India' },
    { code: 'IE', name: 'Ireland' },
    { code: 'JP', name: 'Japan' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MX', name: 'Mexico' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PT', name: 'Portugal' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russia' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SG', name: 'Singapore' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'SE', name: 'Sweden' },
    { code: 'TR', name: 'Turkey' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' }
];