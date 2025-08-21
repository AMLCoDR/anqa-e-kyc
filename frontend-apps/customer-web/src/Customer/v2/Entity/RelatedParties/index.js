import React, { useEffect, useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useTracker } from 'components/Instana';
import RiskBadge from 'components/RiskBadge';
import { useNavigate } from 'react-router-dom';

import { useEntity } from '../../context';
import MultiSelect from './MultiSelect';


const outbound = ['In control of', 'Key manager of', 'Associate of'];
const inbound = ['Controlled by', 'Managed by', 'Associate of'];

export const RelatedParties = props => {

    const [unlinked, setUnlinked] = useState([]);
    const { state, query, link, unlink } = useEntity();
    const navigate = useNavigate();
    const { error: logError } = useTracker();

    useEffect(() => {
        const callback = (err, rsp) => {
            if (err) {
                logError(err.message, { method: 'RelatedParties query' })
                console.error(err.message);
                return;
            }

            // filter out entities that are already linked to the primary entity
            let vals = [];
            const parties = state.entity.getRelatedPartiesList();

            rsp.getDataList().forEach(e => {
                const entityId = e && e.getId()
                const organisation = e && e.getOrganisation();
                const person = e && e.getPerson();
                const index = parties.findIndex(rp => rp.getTargetEntity() && rp.getTargetEntity().getId() === entityId)
                if (index === -1) {
                    const name = organisation
                        ? organisation.getName()
                        : person ? `${person.getFirstName()} ${person.getLastName()}` : null;
                    if (name) {
                        vals.push({ title: name, entity: e });
                    } else {
                        logError('Failed get the name of the entity', { method: 'RelatedParties query' })
                        console.error('Failed get the name of the entity', entityId);
                    }
                }
            });
            setUnlinked([...vals]);
        }

        query({ isCustomer: false }, { limit: 100 }, callback);
    },
        [state.entity, query, logError]
    );

    /* link an entity */
    const handleLink = (selected, relType) => {
        selected.forEach(item => {
            link(state.entity, item.entity, relType)
        });
    };

    const handleUnlink = (rln) => {
        unlink(rln.getSourceEntity(), rln.getTargetEntity(), rln.getType());
    };

    const handleOpenRelated = id => {
        navigate(`/customers/${id}`);
    };

    return (
        <Card elevation={0} data-test="business-nature">
            <CardHeader
                data-ele='business-nature'
                title="Related Parties"
            />
            <CardContent>
                <MultiSelect options={unlinked} onAction={(val, reln) => handleLink(val, reln)} />
                <TableContainer elevation={0} component={Paper} data-test="customer-unlinked" sx={{
                    '& [class*="MuiTableCell-head"]': {
                        backgroundColor: 'grey.50',
                        color: 'text.secondary',
                    },
                    '& [class*="MuiTableCell-body"]': {
                        color: 'grey[800]'
                    },
                }}>
                    <Table stickyHeader size="small" aria-label="customer unlinked">
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">Name</TableCell>
                                <TableCell component="th" align="center">Relationship</TableCell>
                                <TableCell component="th" align="center">Risk</TableCell>
                                <TableCell component="th" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state.entity.getRelatedPartiesList().map((rln, index) => {
                                let e = rln.getTargetEntity();
                                let typeDesc = outbound[rln.getType()];
                                if (!e.getOrganisation() && !e.getPerson()) {
                                    e = rln.getSourceEntity()
                                    typeDesc = inbound[rln.getType()]
                                }

                                const org = e.getOrganisation();
                                const per = e.getPerson();

                                return (
                                    <TableRow key={index} hover data-test="customer-item">
                                        <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleOpenRelated(e.getId())}>
                                            {org
                                                ? org.getName()
                                                : per ? `${per.getFirstName()} ${per.getLastName()}` : null
                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            {typeDesc}
                                        </TableCell>
                                        <TableCell align="center">
                                            <RiskBadge risk={e.getRisk()} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Related Parties">
                                                <IconButton aria-label="graph" size="small" onClick={() => handleUnlink(rln)}>
                                                    <HighlightOffIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}

export default RelatedParties