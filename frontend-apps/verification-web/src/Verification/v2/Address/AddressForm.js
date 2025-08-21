import React from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import * as PropTypes from 'prop-types';

const AddressForm = ({ entity, onValid }) => {
    const [params, setParams] = React.useState({
        unitNumber: '',
        streetNumber: '',
        streetName: '',
        streetType: '',
        suburb: '',
        city: entity.getCity(),
        // postCode: entity.getPostCode(),
    });

    const handleChange = (e) => {
        params[e.target.name] = e.target.value;
        setParams({ ...params });
        onValid(params);
        updateParams({ ...params });
    };

    const handleNumberChange = (event) => {
        updateParams({ ...params, streetNumber: event.target.value, });
    };

    const handleSreetChange = (event) => {
        updateParams({ ...params, streetName: event.target.value, });
    };

    const handleTypeChange = (event) => {
        updateParams({ ...params, streetType: event.target.value, });
    };

    const handleSuburbChange = (event) => {
        updateParams({ ...params, suburb: event.target.value, });
    };

    const updateParams = (params) => {
        setParams(params);
        if (params.streetNumber && params.streetName && params.streetType && params.suburb) {
            onValid({ ...params });
        } else {
            onValid(null);
        }
    }

    return (
        <React.Fragment>
            <Typography variant="body2">
                To verify, please re-enter the entity address below:
            </Typography>
            <Typography variant="caption" display="block" sx={{ padding: 1 }}>
                {entity.getAddressLine1()}<br />
                {entity.getAddressLine2() && <React.Fragment> {entity.getAddressLine2()}<br /> </React.Fragment>}
                {entity.getSuburb()}<br />
                {entity.getCity()}<br />
                {entity.getRegion()}
                {/* {entity.getPostCode()} */}
            </Typography>

            <Grid container sx={{
                '& > *': {
                    pr: 1,
                }
            }}>
                <Grid item xs={6} >
                    <TextField name="unitNumber" label="Unit number" value={params.unitNumber} onChange={handleChange}
                        variant="outlined" margin="dense" fullWidth data-test="address-unit-number" />
                </Grid>
                <Grid item xs={6} >
                    <TextField required={true} name="streetNumber" label="Street number" value={params.streetNumber} onChange={handleNumberChange}
                        variant="outlined" margin="dense" fullWidth data-test="address-street-number" />
                </Grid>
                <Grid item xs={6} >
                    <TextField required={true} name="streetName" label="Street name" value={params.streetName} onChange={handleSreetChange}
                        variant="outlined" margin="dense" fullWidth data-test="address-street-name" />
                </Grid>
                <Grid item xs={6} >
                    <TextField required={true} name="streetType" label="Street type" value={params.streetType} onChange={handleTypeChange}
                        variant="outlined" margin="dense" fullWidth data-test="address-street-type" />
                </Grid>
                <Grid item xs={12}>
                    <TextField required={true} name="suburb" label="Suburb" value={params.suburb} onChange={handleSuburbChange}
                        variant="outlined" margin="dense" fullWidth data-test="address-suburb" />
                </Grid>
                <Grid item xs={12} >
                    <TextField disabled={true} name="city" label="City" value={params.city} onChange={handleChange}
                        variant="outlined" margin="dense" fullWidth data-test="address-city" />
                </Grid>
                {/* <Grid item xs={3} >
                    <TextField name="postCode" label="Post code" value={params.postCode} onChange={handleChange}
                        variant="outlined" margin="dense" fullWidth data-test="address-post-code" />
                </Grid> */}
            </Grid>
        </React.Fragment>
    );
};

AddressForm.propTypes = {
    entity: PropTypes.object,
    onValid: PropTypes.func.isRequired,
};

export default AddressForm;