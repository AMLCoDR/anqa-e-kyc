import React, { useState } from 'react';

import { useAuth0 } from "@auth0/auth0-react";
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import MenuIcon from '@material-ui/icons/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';


import { useMenu } from '../../api';
import ActionLink from '../../components/ActionLink';
import config from '../../config';
import { HomeIcon } from '../../icons/HomeIcon';




export const Header = () => {
    const { menuItems } = useMenu();
    const { loginWithRedirect, logout, user } = useAuth0();
    const [anchorEl, setAnchorEl] = useState(null);

    const title = useLocation().pathname
    const selected = title.split("/")[1];

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };


    let level = 0;
    if (title) {
        level = (title.match(/\//g) || []).length;
    }

    return (<>
        <ElevationScroll level={level}>
            <AppBar color="inherit" position="fixed" elevation={0}>
                <Toolbar variant="dense">
                    <Link component={ActionLink} to="/" sx={{
                        display: 'flex',
                        '& svg': {
                            margin: '1rem',
                            fontSize: '3rem',
                        }
                    }} aria-label="Home" data-test="menu-home" name="Home">
                        <HomeIcon alt="Home" />
                    </Link>
                    {/* sm+ full menu */}
                    <Hidden mdDown>
                        <Box flexGrow={1}>
                            {menuItems && menuItems.map((item, index) => {
                                let title, uri
                                if (item.sys.contentType.sys.id === 'resource') {
                                    title = item.fields.value
                                    uri = item.fields.action
                                } else {
                                    title = item.fields.title
                                    uri = item.fields.slug
                                }
                                return (

                                    title &&

                                    <Button key={index}
                                        component={ActionLink} to={`/${uri}`}
                                        sx={selected === uri ? { borderBottom: 2, mx: 1 } : {
                                            borderBottom: 2,
                                            mx: 1,
                                            borderColor: 'transparent',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                background: 'transparent'
                                            }
                                        }}
                                        aria-label={title}
                                        data-test="menu-md" >
                                        {title}
                                    </Button>

                                )
                            })}
                        </Box>
                        {!user &&
                            <>
                                <Button
                                    component={RouterLink} to={`/signup`}
                                    sx={selected === 'signup' ? { borderBottom: 2, mx: 1 } : {
                                        borderBottom: 2,
                                        mx: 1,
                                        borderColor: 'transparent',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            background: 'transparent'
                                        }
                                    }}
                                    aria-label="pricing">
                                    Sign up
                                </Button>
                                <Button
                                    sx={{
                                        borderBottom: 2,
                                        mx: 1,
                                        borderColor: 'transparent',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            background: 'transparent'
                                        }
                                    }}
                                    onClick={() => loginWithRedirect()}
                                    aria-label="log in">
                                    Login
                                </Button>
                            </>
                        }
                        {/* profile menu */}
                        {user &&
                            <Button
                                onClick={() => logout({ returnTo: window.location.origin })}
                                aria-label="Logout" >
                                Logout
                            </Button>
                        }
                    </Hidden>
                    {/* xs popup menu */}
                    <Hidden mdUp>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton edge="start"
                            color="primary"
                            onClick={openMenu}
                            aria-haspopup="true"
                            aria-label="menu"
                            aria-controls="simple-menu">
                            <MenuIcon />
                        </IconButton >
                        <Menu
                            elevation={1}
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={closeMenu}
                        >
                            <MenuList>
                                {menuItems && menuItems.map((item, index) => {
                                    let title, uri
                                    if (item.sys.contentType.sys.id === 'resource') {
                                        title = item.fields.value
                                        uri = item.fields.action
                                    } else {
                                        title = item.fields.title
                                        uri = item.fields.slug
                                    }
                                    return (
                                        title &&
                                        <MenuItem key={index} component={ActionLink} to={`/${uri}`}
                                            aria-label={title} onClick={closeMenu} >
                                            {title}
                                        </MenuItem>
                                    )
                                })}
                                {!user &&
                                    <MenuItem component={RouterLink} to={`/signup`} aria-label="pricing">
                                        Sign up
                                    </MenuItem>
                                }
                                {!user &&
                                    <MenuItem onClick={() => loginWithRedirect({ redirectUri: config.appUrl })} aria-label="log in">
                                        Login
                                    </MenuItem>
                                }
                                {user &&
                                    <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>
                                        Log out
                                    </MenuItem>
                                }
                            </MenuList>
                        </Menu>
                    </Hidden>
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    </>);
}

const ElevationScroll = ({ level, children }) => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 1 : 0,
    });
}