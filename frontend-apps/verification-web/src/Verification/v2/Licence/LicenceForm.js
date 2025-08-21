import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import * as PropTypes from 'prop-types';

export const LicenceForm = ({ onValid }) => {
    const [params, setParams] = useState({
        number: null,
        version: null,
    });

    const handleNumberChange = (event) => {
        updateParams({ ...params, number: event.target.value, });
    };

    const handleVersionChange = (event) => {
        updateParams({ ...params, version: event.target.value, });
    };

    const updateParams = (params) => {
        setParams(params);

        if (params.number && params.version) {
            onValid(params);
        } else {
            onValid(null);
        }
    }

    return (
        <React.Fragment>
            <TextField id='licence-number' label='Licence Number' onChange={handleNumberChange}
                variant='outlined' margin='dense' fullWidth data-test="licence-number" />
            <TextField id='version-number' label='Version Number' onChange={handleVersionChange}
                variant='outlined' margin='dense' fullWidth data-test="licence-version" />
        </React.Fragment>
    )
};

LicenceForm.propTypes = {
    entity: PropTypes.object,
    onValid: PropTypes.func.isRequired,
};

export default LicenceForm;