import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';


const AddressReport = ({ idCheck }) => {
    const checkDetails = JSON.parse(idCheck.detail);
    const { city, data, suburb, street } = checkDetails || {};

    return checkDetails
        ? (
            <>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
                    <Typography variant="subtitle1">Address:</Typography>
                    <Typography variant="body1" sx={street ? null : { color: 'error.main' }} data-test="address-street">{data.street || 'Incorrect address'}</Typography>
                </Grid>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
                    <Typography variant="subtitle1">Suburb:</Typography>
                    <Typography variant="body1" sx={suburb ? null : { color: 'error.main' }} data-test="address-suburb">{data.suburb || 'Incorrect suburb'}</Typography>
                </Grid>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
                    <Typography variant="subtitle1">City:</Typography>
                    <Typography variant="body1" sx={city ? null : { color: 'error.main' }} data-test="address-city">{data.city || 'Incorrect city'}</Typography>
                </Grid>
                {/* <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
                    <Typography variant="subtitle1">Postcode:</Typography>
                    <Typography variant="body1" sx={postCode ? null : { color: 'error.main' }} data-test="address-postcode">{data.postCode || 'Incorrect Post Code'}</Typography>
                </Grid> */}
            </>
        )
        : null;
}

AddressReport.propTypes = {
    idCheck: PropTypes.object.isRequired,
};

export default AddressReport;
