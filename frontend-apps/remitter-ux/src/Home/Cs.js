import * as React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { useView } from '../Controller';
import OnboardStatus from './OnboardingList';

export const CsHome = () => {
    const { start } = useView();

    return (
        <>
            <Typography variant="h2">
                Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ pb: 3 }}>
                Customer Service Representative
            </Typography>

            <Grid spacing={2} container>
                <Grid item xs={6} sm={6}>
                    <Typography variant="h6" gutterBottom>
                        Onboarding
                    </Typography>
                    <Card>
                        <CardContent>
                            <Typography component="p">
                                Self-onboard
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Create a shareable link for customers to self-onboard
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ pb: 2, justifyContent: 'center' }}>
                            <Button variant="contained" onClick={() => start("/customer/create")}>Create link</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={6}>
                    <Card sx={{ mt: 5 }}>
                        <CardContent>
                            <Typography component="p">
                                Enter details
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Enter customer details directly to the system
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ pb: 2, justifyContent: 'center' }}>
                            <Button onClick={() => start("/customer/onboarder/add")} variant="contained">
                                Add customer
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <OnboardStatus sx={{ mt: 2 }} />
        </>
    );
}

export default CsHome;