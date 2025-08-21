import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';


const LicenceReport = ({ idCheck }) => {
    let checkDetails;
    try {
        checkDetails = JSON.parse(idCheck.detail);
    } catch (error) {
        console.error(`Impossible to retrieve the licence check details: ${idCheck.detail}`);
    }
    const { data, licenceNo } = checkDetails || {};

    return checkDetails
        ? (
            <>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
                    <Typography variant="subtitle1">Licence Number:</Typography>
                    <Typography variant="body1" sx={licenceNo ? null : { color: 'error.main' }} data-test="licence-number">{data.licenceNo || 'Incorrect Licence Number'}</Typography>
                </Grid>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" >
                    <Typography variant="subtitle1">Version Number:</Typography>
                    <Typography variant="body1" sx={licenceNo ? null : { color: 'error.main' }} data-test="licence-version">{data.licenceNo || 'Incorrect Licence Version'}</Typography>
                </Grid>
            </>
        )
        : null;
}

LicenceReport.propTypes = {
    idCheck: PropTypes.object.isRequired
};

export default LicenceReport;
