import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { styled, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Footer from './Footer';
import Header from './Header';
import Nav from './Nav';

const drawerWidth = 240;

const Main = styled('main')(({ theme, open }) => ({
    flexgrow: 1,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
        transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${drawerWidth}px`,
    })
}));

const Viewport = props => {
    const { onLogout } = props;
    const theme = useTheme();
    const largeView = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
    const [open, setOpen] = useState(largeView);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" flexGrow="1">
            <Header onLogout={onLogout} onNavMenu={handleDrawerToggle} open={open} />
            <Box display="flex" flexGrow="1">
                <Nav drawerWidth={drawerWidth} onDrawerToggle={handleDrawerToggle} open={open} />
                <Main>
                    <Container maxWidth="md">
                        {props.children}
                    </Container>
                </Main>
            </Box>
            <Footer />
        </Box>
    );
};

export default Viewport;