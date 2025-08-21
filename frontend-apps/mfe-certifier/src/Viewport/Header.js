import React, { useState } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import MuiAppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { styled } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { Link as RouterLink } from 'react-router-dom';

import config from '../config';
import LogoIcon from './LogoIcon';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));

const Header = props => {
    const { onNavMenu, open } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const { logout } = useAuth0();

    const accMenuId = 'account-menu';
    const handleAccMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleAccMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        setAnchorEl(null);
        logout({ returnTo: config.webUrl });
    };

    return (<>
        <AppBar position="static" color="primary">
            <Toolbar>
                <IconButton
                    aria-label="show main navigation"
                    edge="start"
                    onClick={onNavMenu}
                    color="inherit"
                    sx={{ mr: 2 }}
                >
                    {open ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
                <Link component={RouterLink} to="/">
                    <LogoIcon alt="Avid AML Logo" sx={{ fontSize: '1.5rem' }} />
                </Link>
                <Box display="flex" flexGrow="1" pl={1}>
                    <Typography variant="h6" noWrap component="div">Avid AML</Typography>
                </Box>
                <IconButton size="large" edge="end" color="inherit"
                    aria-label="account of current user"
                    aria-controls={accMenuId}
                    aria-haspopup="true"
                    onClick={handleAccMenuOpen}
                >
                    <AccountCircleIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={accMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleAccMenuClose}
        >
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
        </Menu>
    </>);
};

export default Header;