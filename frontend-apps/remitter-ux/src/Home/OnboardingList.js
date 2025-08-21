import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Stack from '@material-ui/core/Stack';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import FactCheckIcon from '@material-ui/icons/FactCheck';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MarkEmailReadIcon from '@material-ui/icons/MarkEmailRead';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import WarningIcon from '@material-ui/icons/Warning';

import { useData } from '../Datasource';

export const OnboardingList = ({ sx }) => {
    const [{ customers }] = useData();

    return (
        <TableContainer component={Paper} sx={sx}>
            <Table size="medium" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Customer</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="center">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customers.map(c =>
                        <Customer key={c.name} customer={c} />
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default OnboardingList;

const Customer = (props) => {
    const { customer } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuOpen = Boolean(anchorEl);
    const menuId = menuOpen ? 'menu' : undefined;

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={menuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Resend invitation</MenuItem>
        </Menu>
    );
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)} aria-label="expand row">
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell scope="row">{customer.name}</TableCell>
                <TableCell scope="row">{customer.type}</TableCell>
                <TableCell align="center">
                    <Stack direction="row" justifyContent="flex-end">
                        <Status status={customer.status} />
                        <IconButton size="small" onClick={handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>
                    </Stack>
                    {renderMenu}
                </TableCell>
            </TableRow>
            <TableRow
                sx={{
                    bgcolor: 'background.default',
                    '& > *': { border: 'unset' }
                }}>
                <TableCell colSpan={4} sx={{ py: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <People people={customer.people} />
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

const People = (props) => {
    const { people } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    // const [open, setOpen] = useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuOpen = Boolean(anchorEl);
    const menuId = menuOpen ? 'menu' : undefined;

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={menuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Resend invitation</MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ mx: 2, my: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
                Key People
            </Typography>
            <Table size="small" aria-label="purchases">
                <TableBody>
                    {people.map((p, i) => (
                        <TableRow key={i} sx={{ '& .MuiTableCell-root': { borderBottom: 'unset' } }}>
                            <TableCell component="th" scope="row">
                                {p.givenNames} {p.familyName}
                            </TableCell>
                            <TableCell>{p.relationship}</TableCell>
                            <TableCell>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Status status={p.status} />
                                    <IconButton size="small" onClick={handleMenuOpen}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Stack>
                                {renderMenu}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

const Status = (props) => {
    const { status } = props;

    switch (status) {
        case 'Invited':
            return (
                <Tooltip title="invited">
                    <MarkEmailReadIcon sx={{ my: 'auto' }} color="info" />
                </Tooltip>
            );
        case 'In progress':
            return (
                <Tooltip title="in progress">
                    <AutorenewIcon sx={{ my: 'auto' }} color="info" />
                </Tooltip>
            );
        case 'Verified':
            return (
                <Tooltip title="id verified">
                    <FactCheckIcon sx={{ my: 'auto' }} color="info" />
                </Tooltip>
            );
        case 'Escalated':
            return (
                <Tooltip title="escalated">
                    <WarningIcon sx={{ my: 'auto' }} color="warning" />
                </Tooltip>
            );
        case 'Certified':
            return (
                <Tooltip title="certified">
                    <VerifiedUserIcon sx={{ my: 'auto' }} color="success" />
                </Tooltip>
            );
        default:
            break;
    }
}