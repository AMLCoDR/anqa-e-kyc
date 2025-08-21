import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import BusinessIcon from '@material-ui/icons/Business';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import { ListOutline } from 'components/Outline';
import RiskBadge from 'components/RiskBadge';
import { TablePager } from 'components/TablePager';
import { useMockData, CustomersTutorial } from 'components/Tutorial';
import * as PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";


import { useEntity } from '../context';

const pageSize = 50;

export const ListBody = ({ filter }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState({ offset: 0, limit: pageSize });
    const { state, query, deleteEntity } = useEntity();
    const { state: { hasData } } = useMockData();

    useEffect(() => {
        query(filter, page);
    }, [query, filter, page, hasData]);

    const handleEntity = (id) => {
        navigate(`/customers/${id}`);
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        deleteEntity(id);
    };

    const handlePage = () => {
        setPage(prev => ({ ...prev, limit: prev.limit + pageSize }))
    };

    return (
        <TableContainer elevation={0} component={Paper} data-test="customer-list"
            sx={{
                '& [class*="MuiTableCell-head"]': {
                    backgroundColor: 'grey.50',
                    color: 'text.secondary',
                },
                '& [class*="MuiTableCell-body"]': {
                    color: 'grey.800'
                }
            }}
        >
            <Table stickyHeader size="small" aria-label="customer list" >
                <TableHead>
                    <TableRow>
                        <TableCell component="th" />
                        <TableCell component="th">Name</TableCell>
                        <TableCell component="th">Industry</TableCell>
                        <TableCell component="th">Country</TableCell>
                        <TableCell component="th" align="center">Risk</TableCell>
                        <TableCell component="th">&nbsp;</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.entities.map((ent, index) =>
                        <TableRow key={index} hover sx={{ cursor: 'pointer' }} data-test="customer-item">
                            <TableCell align="right">
                                <IconButton size="small" onClick={() => handleEntity(ent.getId())}>
                                    {ent.getOrganisation()
                                        ? <BusinessIcon fontSize="small" color={ent.getCustomerId() ? "primary" : "action"} />
                                        : <PersonIcon fontSize="small" color={ent.getCustomerId() ? "primary" : "action"} />
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell onClick={() => handleEntity(ent.getId())} data-test="entity-name">
                                {ent.getOrganisation() &&
                                    ent.getOrganisation().getName()
                                }
                                {
                                    ent.getPerson() &&
                                    `${ent.getPerson().getFirstName()} ${ent.getPerson().getLastName()}`
                                }
                            </TableCell>
                            <TableCell onClick={() => handleEntity(ent.getId())}>
                                {ent.getOrganisation() ? ent.getOrganisation().getIndustry() : null}
                            </TableCell>
                            <TableCell onClick={() => handleEntity(ent.getId())}>
                                {ent.getCountry()}
                            </TableCell>
                            <TableCell align="center" onClick={() => handleEntity(ent.getId())}>
                                <RiskBadge risk={ent.getRisk()} />
                            </TableCell>
                            <TableCell align="center">
                                <IconButton size="small" onClick={(e) => handleDelete(e, ent.getId())}>
                                    <DeleteIcon fontSize="small" color="action" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )}
                    {state.entities.length === 0 &&
                        <TableRow style={{ minHeight: 53 * 2 }}>
                            <TableCell colSpan="6" align="center">
                                {state.pending &&
                                    <ListOutline visible={state.pending} />
                                }
                                {!state.pending && <>
                                    {hasData
                                        ? <Box sx={{ py: "10rem" }} >
                                            <Grid container direction="column" justify="center" alignItems="center" >
                                                <Typography>No matching records</Typography>
                                            </Grid>
                                        </Box>
                                        : <CustomersTutorial />
                                    }
                                </>}
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
                <TablePager count={state.entities.length} total={state.matches}
                    colSpan={6} onPage={handlePage}
                />
            </Table>
        </TableContainer>
    );
};

ListBody.propTypes = {
    filter: PropTypes.object.isRequired,
};

ListBody.defaultProps = {
    filter: {}
}

export default ListBody;