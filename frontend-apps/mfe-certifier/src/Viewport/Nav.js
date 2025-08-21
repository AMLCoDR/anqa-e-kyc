import React, { Fragment, useState } from 'react';

import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useMatch, useNavigate } from 'react-router-dom';

const navItems = [
    { path: "/", label: "Dashboard" },
    // To display a navigation Section do this:
    // (Leave out "path" to display section header that does not navigate to a route)
    // {
    //     label: "Section",
    //     children: [
    //         { path: 'section/list', label: "List" },
    //         { path: 'section/item', label: "Item" },
    //     ],
    // }
]

const NavItem = props => {
    const { navItem, nested, onClick } = props;
    const match = useMatch(navItem.path || '');
    const selected = Boolean(match) && Boolean(navItem.path);

    return (
        <ListItem button selected={selected} onClick={navItem.path ? () => onClick(navItem.path) : null}>
            <ListItemText primary={navItem.label} sx={{ ml: nested ? 3 : 0 }} />
        </ListItem>
    );
};

const NavSection = props => {
    const { id, onClick, navItem } = props;
    const match = useMatch(navItem.path || '');
    const [expanded, setExpanded] = useState(false);
    const selected = Boolean(match) && Boolean(navItem.path);

    const handleExpanded = () => {
        setExpanded(!expanded);
        if (navItem.path) {
            onClick(navItem.path);
        }
    };

    return (<>
        <ListItem button selected={selected} onClick={handleExpanded}>
            <ListItemText primary={navItem.label} primaryTypographyProps={{ fontWeight: 700 }} />
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            {navItem.children.map((r, i) => (
                <NavItem key={`${id}_${i}`} navItem={r} onClick={onClick} nested={true} />
            ))}
        </Collapse>
    </>);
};

const Menu = props => {
    const { id, onDrawerToggle } = props;
    const navigate = useNavigate();
    const theme = useTheme();
    const smallView = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

    const handleNav = loc => {
        if (smallView) {
            onDrawerToggle();
        };
        navigate(loc);
    };

    return (
        <List>
            {navItems.map((r, i) => (<Fragment key={i}>
                {r.children
                    ? <NavSection id={`${id}_${i}`} navItem={r} onClick={handleNav} />
                    : <NavItem navItem={r} onClick={handleNav} />
                }
            </Fragment>))}
        </List>
    );
};

const Nav = props => {
    const { drawerWidth, onDrawerToggle, open } = props;

    return (
        <nav>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={open}
                    onClose={onDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    PaperProps={{ sx: { width: `${drawerWidth}px` } }}
                >
                    <Menu id={'mobileMenu'} onDrawerToggle={onDrawerToggle} />
                </Drawer>
            </Hidden>
            <Hidden mdDown>
                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={open}
                    onClose={onDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    PaperProps={{ sx: { width: open ? `${drawerWidth}px` : 0 } }}
                    sx={{ width: open ? `${drawerWidth}px` : 0 }}
                >
                    <Toolbar />
                    <Menu id={'desktopMenu'} onDrawerToggle={onDrawerToggle} />
                </Drawer>
            </Hidden>
        </nav>
    );
};

export default Nav;