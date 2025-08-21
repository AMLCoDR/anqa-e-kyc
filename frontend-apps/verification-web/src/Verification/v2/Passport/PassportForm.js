import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DatePicker from '@material-ui/lab/DatePicker';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import * as PropTypes from 'prop-types';

export const PassportForm = ({ onValid }) => {
    const [params, setParams] = useState({
        number: null,
        expiry: null,
    });

    const dateFns = new AdapterDateFns();

    const handleNumberChange = (event) => {
        updateParams({ ...params, number: event.target.value, });
    };

    const handleDateChange = (date) => {
        updateParams({ ...params, expiry: date, });
    };

    const updateParams = (params) => {
        setParams(params);
        if (params.number && params.expiry && dateFns.isValid(params.expiry)) {
            onValid({ ...params, expiry: dateFns.formatByString(params.expiry, 'yyyy-MM-dd') });
        } else {
            onValid(null);
        }
    }

    return (
        <React.Fragment>
            <TextField id="passport-number" label="Passport number" onChange={handleNumberChange}
                variant="outlined" margin="dense" fullWidth data-test="passport-number" />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    id="expiry-date"
                    label="Expiry date"
                    onChange={handleDateChange}
                    value={params.expiry}
                    data-test="passport-expiry"
                    renderInput={(params) => <TextField fullWidth  {...params} />}
                    inputFormat="dd/MM/yyyy"
                />
            </LocalizationProvider>
        </React.Fragment>
    )
};

PassportForm.propTypes = {
    entity: PropTypes.object,
    onValid: PropTypes.func.isRequired,
};

export default PassportForm;