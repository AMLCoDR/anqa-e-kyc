import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';


const NationalIdReport = ({ idCheck }) => {


    let checkDetails;
    try {
        checkDetails = JSON.parse(idCheck.detail);
    } catch (error) {
        console.error(`Impossible to retrieve the national id check details: ${idCheck.detail}`);
    }
    const { data, idCardNo } = checkDetails || {};

    return checkDetails
        ? (
            <>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
                    <Typography variant="subtitle1">National ID:</Typography>
                    <Typography variant="body1" sx={idCardNo ? null : { color: 'error.main' }} data-test="national-id-number">{data.idCardNo || 'Incorrect ID Number'}</Typography>
                </Grid>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" >
                    <Typography variant="subtitle1">Address:</Typography>
                    <Typography variant="body1" data-test="national-id-address">{data.address}</Typography>
                </Grid>
            </>
        )
        : null;
}

NationalIdReport.propTypes = {
    idCheck: PropTypes.object.isRequired
};

export default NationalIdReport;
