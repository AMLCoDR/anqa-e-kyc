import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { styled } from '@material-ui/core/styles';

import AppBar from './AppBar';
import Drawer, { DrawerHeader } from './Drawer';
import Footer from './Footer';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: `${drawerWidth}px`
        }),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3, 0),
        },
    }),
);

export const Viewport = ({ children }) => {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
        }}
        >
            <AppBar open={open} onClick={handleDrawerOpen} />
            <Drawer open={open} onClick={handleDrawerClose} />
            <Main open={open}>
                <DrawerHeader />
                <Container maxWidth="md">
                    {children}
                </Container>
            </Main>
            <Footer />
        </Box>
    );
}

export default Viewport;