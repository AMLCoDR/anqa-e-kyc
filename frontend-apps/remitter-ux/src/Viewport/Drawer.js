import React from 'react';

import Divider from '@material-ui/core/Divider';
import MuiDrawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { styled, useTheme } from '@material-ui/core/styles';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import GroupIcon from '@material-ui/icons/Group';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SettingsIcon from '@material-ui/icons/Settings';

const drawerWidth = 240;
const mainMenu = [
    { title: 'Onboarding', icon: <PersonAddIcon /> },
    { title: 'Insights', icon: <InboxIcon /> },
    { title: 'Customers', icon: <GroupIcon /> },
    { title: 'Transactions', icon: <AttachMoneyIcon /> }
];

const optionsMenu = [
    { title: 'Settings', icon: <SettingsIcon /> },
]

const Header = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export const DrawerHeader = ({ children }) => {
    return (
        <Header>
            {children}
        </Header>
    );
}

export const Drawer = ({ open, onClick }) => {
    const theme = useTheme();

    return (
        <MuiDrawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={onClick}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {mainMenu.map(item =>
                    <ListItem key={item.title} button>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItem>
                )}
            </List>
            <Divider />
            <List>
                {optionsMenu.map(item =>
                    <ListItem key={item.title} button>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItem>
                )}
            </List>
        </MuiDrawer>
    );
}

export default Drawer;