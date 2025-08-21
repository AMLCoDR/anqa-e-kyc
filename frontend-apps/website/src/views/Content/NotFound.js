import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WarningIcon from '@material-ui/icons/Warning';
import { Link as RouterLink } from 'react-router-dom';


export const NotFound = (props) => {
    const [open] = React.useState(true);


    return (
        <Dialog open={open}>
            <Box sx={{ textAlign: 'center' }}>
                <DialogContent>
                    <WarningIcon alt="" fontSize="large" />
                    <DialogTitle>404 Page not found</DialogTitle>
                    <DialogContentText id="alert-dialog-description">
                        The page you tried to find doesn't exist
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ mt: 1.5 }} component={RouterLink} fullWidth to="/" variant="contained" href="/" >
                        Return Home
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
