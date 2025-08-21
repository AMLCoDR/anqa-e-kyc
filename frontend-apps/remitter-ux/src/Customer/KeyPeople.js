import React from 'react';

import Button from '@material-ui/core/Button';
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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MarkEmailReadIcon from '@material-ui/icons/MarkEmailRead';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { useView } from '../Controller';
import { useData } from '../Datasource';

export const KeyPeople = () => {
    const { start } = useView();
    const [state] = useData();
    const [anchorEl, setAnchorEl] = React.useState(null);

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
            <Typography variant="h2">Key People</Typography>
            <Typography variant="subtitle1" gutterBottom>
                Add key people in your organisation: shareholders, directors, and
                anyone with financial authority.
            </Typography>
            <Stack direction="row" justifyContent="flex-end">
                <Button onClick={() => start('/person/add')}
                    startIcon={<AddCircleIcon />} variant="contained" color="secondary"
                >
                    Onboard
                </Button>
            </Stack>
            <TableContainer component={Paper} sx={{ my: 2 }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ '& th': { fontWeight: 600 } }}>
                            <TableCell>Name</TableCell>
                            <TableCell>Relationship</TableCell>
                            <TableCell align="center">Ownership %</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.people && state.people.map((p, index) => (
                            <TableRow key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {p.givenNames} {p.familyName}
                                </TableCell>
                                <TableCell>{p.relationship}</TableCell>
                                <TableCell align="center">{p.ownership}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" justifyContent="flex-end">
                                        {p.status === 'sent' &&
                                            <Tooltip title="sent">
                                                <MarkEmailReadIcon sx={{ my: 1 }} color="info" />
                                            </Tooltip>
                                        }
                                        {p.status === 'verified' &&
                                            <Tooltip title="verified">
                                                <CheckCircleIcon sx={{ my: 1 }} color="success" />
                                            </Tooltip>
                                        }
                                        <IconButton onClick={handleMenuOpen}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Stack>
                                    {renderMenu}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default KeyPeople;