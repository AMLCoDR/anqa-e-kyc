import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';


const PassportReport = ({ idCheck }) => {


    let checkDetails;
    try {
        checkDetails = JSON.parse(idCheck.detail);
    } catch (error) {
        console.error(`Impossible to retrieve the passport check details: ${idCheck.detail}`);
    }
    const { data, passportNo } = checkDetails || {};

    return checkDetails
        ? (
            <>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
                    <Typography variant="subtitle1">Passport number:</Typography>
                    <Typography variant="body1" sx={passportNo ? null : { color: 'error.main' }} data-test="passport-number">{data.passportNo || 'Incorrect Passport Number'} </Typography>
                </Grid>
                <Grid container direction="row" justifyContent="space-between" alignItems="center"  >
                    <Typography variant="subtitle1">Expiry date:</Typography>
                    <Typography variant="body1" sx={passportNo ? null : { color: 'error.main' }} data-test="passport-expiry">{data.passportNo || 'Incorrect Passport Expiry'}</Typography>
                </Grid>
            </>
        )
        : null;
}

PassportReport.propTypes = {
    idCheck: PropTypes.object.isRequired
};

export default PassportReport;
