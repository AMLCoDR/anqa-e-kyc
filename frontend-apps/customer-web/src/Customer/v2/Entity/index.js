import React, { useEffect } from 'react';

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Stack from '@material-ui/core/Stack';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import cloneDeep from 'lodash.clonedeep';
import { Link as RouterLink, useParams, useLocation } from 'react-router-dom';
import Verification from 'verification/Verification';

import { riskLevels, findByID } from '../../../types/risklevels';
import { useEntity, useCustomer } from '../context';
import Detail from './Details';
import { Documents } from './Documents';
import { MakeCustomer, RemoveCustomer } from './MakeCustomer';
import Nature from './Nature';
import Purpose from './Purpose';
import RelatedParties from './RelatedParties';

const RiskDropdown = ({ value, onChange }) => {
    const r = findByID(value);
    const options = riskLevels.slice(0, 4);
    const riskColor = `risk.${r.key.toLowerCase()}.main`;


    return (
        <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0.5} sx={{ border: 1, borderRadius: 4, borderColor: riskColor }}>
            <FiberManualRecordIcon sx={{ color: riskColor }} />
            <Select
                variant='standard'
                disableUnderline
                value={value}
                onChange={e => onChange(e.target.value)}
                displayEmpty
                sx={{
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    color: riskColor,
                }}>
                {options.map((o, index) =>
                    <MenuItem key={index} value={o.value} aria-label={o.label}>
                        {`${o.label} risk`}
                    </MenuItem>
                )}
            </Select>
        </Stack>
    );
}

const Entity = () => {
    const { id } = useParams();
    const { state: { entity }, get, update, updateRisk } = useEntity();
    const { state: { customer }, get: getCustomer, add: addCustomer, update: updateCustomer, deleteCustomer } = useCustomer();
    const query = new URLSearchParams(useLocation().search);

    const entityId = entity && entity.getId()
    const organisation = entity && entity.getOrganisation();
    const person = entity && entity.getPerson();

    useEffect(() => {
        if (entity && entity.getCustomerId()) {
            getCustomer(entity.getCustomerId());
        }
    }, [entity, getCustomer]);

    useEffect(() => {
        if (!customer || !entity) {
            return;
        }

        if (customer.getId() !== entity.getCustomerId()) {
            const e = cloneDeep(entity);
            e.setCustomerId(customer.getId());
            update(e);
        }
    }, [entity, update, customer]);

    useEffect(() => {
        get(id);
    }, [get, id]);

    const handleUpdate = (risk) => {
        updateRisk(risk);
    };

    const handleSaveCustomer = c => {
        if (c.getId()) {
            updateCustomer(c);
        } else {
            addCustomer(c);
        }
    };

    const handleRemoveCustomer = () => {
        deleteCustomer(customer.getId());
    };

    return (
        <Box data-test="profile-view">
            {entity &&
                <>
                    {!query.has("noAppBar") &&
                        <Breadcrumbs>
                            <Link component={RouterLink} to="/customers">Customers</Link>
                            {person &&
                                <Typography color="textPrimary" variant="body2">
                                    {person.getFirstName()} {person.getLastName()}
                                </Typography>
                            }
                            {organisation &&
                                <Typography color="textPrimary" variant="body2">
                                    {organisation.getName()}
                                </Typography>
                            }
                        </Breadcrumbs>
                    }
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", py: 2 }}>
                        {person &&
                            <Typography variant="h2" color="secondary" data-test="entity-name">
                                {person.getFirstName()} {person.getLastName()}
                            </Typography>
                        }
                        {organisation &&
                            <Typography variant="h2" color="secondary" data-test="entity-name">
                                {organisation.getName()}
                            </Typography>
                        }
                        <RiskDropdown value={entity.getRisk()} onChange={handleUpdate} />
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item sm={12} md={6} sx={{
                            borderRight: {
                                md: 1,
                            },
                            borderColor: {
                                md: '#E5E7EC'
                            },
                        }}>
                            <Detail entity={entity} />
                            {person &&
                                <Verification entity={entity} />
                            }
                            <Card elevation={0} data-test="entity-documentation">
                                <CardHeader title="Documentation" data-ele="entity-documentation" />
                                <CardContent>
                                    <Documents scope={`entity/${entityId}`} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            {customer
                                ? <>
                                    <Purpose entity={entity} customer={customer} />
                                    <Nature entity={entity} customer={customer} />
                                    <RemoveCustomer
                                        entityType={person ? 'person' : (organisation ? 'organisation' : 'entity')}
                                        onRemove={handleRemoveCustomer}
                                    />
                                </>
                                : <MakeCustomer
                                    entityType={person ? 'person' : (organisation ? 'organisation' : 'entity')}
                                    onSave={handleSaveCustomer}
                                />
                            }
                            <RelatedParties />
                        </Grid>
                    </Grid>
                </>
            }
        </Box>

    );
};

Entity.propTypes = {};

export default Entity;



