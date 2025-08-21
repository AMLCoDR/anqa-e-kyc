import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { format, parseISO } from 'date-fns';
import * as PropTypes from 'prop-types';

const EddReport = ({ entity, idCheck }) => {



    let checkDetails;
    try {
        checkDetails = JSON.parse(idCheck.detail);
    } catch (error) {
        console.error(`Impossible to retrieve the due diligence details: ${idCheck.detail}`);
    }
    const { data, dateOfBirth, firstName, lastName } = checkDetails || {};
    const watchlistAML = (data && data.watchlistAML) || []
    const person = entity.getPerson();

    return checkDetails
        ? (
            <Grid item xs={12} container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={6} >
                    <Typography variant="subtitle1">First name:</Typography>
                </Grid>
                <Grid item xs={6} >
                    <Typography variant="body1" sx={firstName ? null : { color: 'error.main' }} data-test="edd-first-name">{person.getFirstName() || 'First Name is incorrect'}</Typography>
                </Grid>
                <Grid item xs={6} >
                    <Typography variant="subtitle1">Last name:</Typography>
                </Grid>
                <Grid item xs={6} >
                    <Typography variant="body1" sx={lastName ? null : { color: 'error.main' }} data-test="edd-last-name">{person.getLastName() || 'Last Name is incorrect'}</Typography>
                </Grid>
                <Grid item xs={6} >
                    <Typography variant="subtitle1">Date of Birth:</Typography>
                </Grid>
                <Grid item xs={6} >
                    <Typography variant="body1" sx={dateOfBirth ? null : { color: 'error.main' }} data-test="edd-date-of-birth">{person.getBirthDate() ? format(parseISO(person.getBirthDate()), 'do MMMM, yyyy') : "Date of birth is incorrect"}</Typography>
                </Grid>

                {watchlistAML.map((entry, index) =>
                    <Card key={`watchlist_${index}`} variant="outlined" square data-test="edd-data">
                        <CardContent>
                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="body1">
                                        <Link href={entry.additionalInfoURL} rel="noopener" target="_blank" data-test="edd-full-report">
                                            Download the full report
                                        </Link>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="subtitle1">Category:</Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1" data-test="edd-category">{entry.category}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="subtitle1">Gender:</Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="body1" data-test="edd-gender">{entry.gender}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="subtitle1">Death Index:</Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="body1" data-test="edd-death">{entry.deathIndex}</Typography>
                                </Grid>
                                {entry.otherNames
                                    ? (
                                        <Grid item xs={12} sm={3}>
                                            <Typography variant="subtitle1">Other Names:</Typography>
                                        </Grid>
                                    )
                                    : null}
                                {entry.otherNames
                                    ? (
                                        <Grid item xs={12} sm={9}>
                                            {entry.otherNames.map((name, index) =>
                                                <Typography key={`name_${index}`} variant="body1" data-test="edd-other-name">{name}</Typography>
                                            )}
                                        </Grid>
                                    )
                                    : null}
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </Grid>
        )
        : null;
}

EddReport.propTypes = {
    idCheck: PropTypes.object.isRequired
};

export default EddReport;
