import * as React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import PersonSearchIcon from '@material-ui/icons/PersonSearch';
import WarningAmberIcon from '@material-ui/icons/WarningAmber';

import { useView } from '../Controller';

const inbox = [
    {
        title: 'High risk individual',
        date: '02-Jul',
        customer: 'John Doe',
        description: 'potential ML/TF risk identified',
        risk: 'error'
    },
    {
        title: 'Investigation required',
        date: '14-Jul',
        customer: 'Dodgy',
        description: 'potential ML/TF risk identified',
        risk: 'warning'
    },
]

export const Home = () => {
    const { start } = useView();

    const handleInvestigate = () => {
        // alert("here");
    }

    return (
        <>
            <Typography variant="h2">
                Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ pb: 3 }}>
                Compliance Officer
            </Typography>

            <Grid spacing={2} container>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                        Inbox
                    </Typography>
                    <List sx={{
                        bgcolor: 'background.paper',
                        mt: 1,
                        borderRadius: 1,
                        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
                    }}>
                        {inbox.map(item =>
                            <>
                                <ListItem alignItems="flex-start" button onClick={handleInvestigate}
                                    secondaryAction={
                                        <IconButton edge="end" onClick={handleInvestigate} aria-label="investigate" >
                                            <PersonSearchIcon fontSize="large" />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar alt="EDD required" sx={{ bgcolor: `${item.risk}.main` }}>
                                            {item.risk === 'warning' ? <WarningAmberIcon /> : <ErrorOutlineIcon />}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.title}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    {`${item.customer} - `}
                                                </Typography>
                                                {item.description}
                                                <Typography component="p" variant="caption">
                                                    [{item.date}]
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </>
                        )}
                    </List>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                        Onboarding
                    </Typography>
                    <Card>
                        <CardContent>
                            <Typography component="p">
                                Share link
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

                {/* <Grid item xs={6} sm={3}>
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
                </Grid> */}
            </Grid>
        </>
    );
}

export default Home;