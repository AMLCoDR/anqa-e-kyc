import React, { useEffect, useState } from 'react';

// import DateFnsUtils from "@date-io/date-fns";
import AdapterDateFns from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import DatePicker from '@material-ui/lab/DatePicker'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { ProgressButton } from 'components/Form';
import { GroupHeading, RefSelect, TextInput, useForm, required, phoneNumber, date } from 'components/Form';
import { format, parseISO } from 'date-fns';
import cloneDeep from 'lodash.clonedeep';
import mixpanel from 'mixpanel-browser';
// import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';


import { Entity as pbEntity, Person, Organisation } from '../../../../proto/entity/v1/entity_pb';
import { useEntity } from '../../context';


export const Edit = () => {
    const [valid, setValid] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const { state, get, add, update } = useEntity();
    const [submitted, setSubmitted] = useState(false);

    const { entity, pending } = state
    const entityId = entity && entity.getId()
    const organisation = entity && entity.getOrganisation();
    const person = entity && entity.getPerson();

    useEffect(() => {
        id && get(id);
    }, [get, id]);

    const handleSave = () => {
        let e = new pbEntity();
        if (entity !== null) {
            e = cloneDeep(entity);
        }

        if (entityType === "o") {
            const org = new Organisation();
            org.setName(form.orgName.value);
            org.setNumber(form.orgNumber.value);
            const otype = parseInt(form.orgType.value);
            if (isNaN(otype)) {
                org.setType(0);
            } else {
                org.setType(otype);
            }
            org.setIndustry(form.industry.value);
            e.setOrganisation(org)
        } else {
            const pers = new Person();
            pers.setFirstName(form.firstName.value);
            pers.setMiddleName(form.middleName.value);
            pers.setLastName(form.lastName.value);
            form.birthDate.value && pers.setBirthDate(format(form.birthDate.value, 'yyyy-MM-dd'));
            e.setPerson(pers)
        }

        e.setAddressLine1(form.addressLine1.value);
        e.setAddressLine2(form.addressLine2.value);
        e.setSuburb(form.suburb.value);
        e.setCity(form.city.value);
        e.setRegion(form.region.value);
        e.setPostCode(form.postCode.value);
        e.setCountry(form.country.value);
        e.setPhoneNumber(form.phoneNumber.value);

        (entityId) ? update(e) : add(e);
        !entity && mixpanel.track('Add an entity');
        setSubmitted(true);
    };

    useEffect(() => {
        if (submitted && entityId) {
            navigate(`/customers/${entityId}`);
        }
    }, [navigate, entityId, submitted]);

    const entityName = () => {
        if (!entity) {
            return '';
        }
        if (organisation) {
            return organisation.getName();
        }
        if (person) {
            return person.getFirstName() + ' ' + person.getLastName();
        }
        return '';
    };

    const [entityType, setEntityType] = useState("p");
    const [form, setForm] = useForm(
        () => {
            const org = entity ? entity.getOrganisation() : null;
            const pers = entity ? entity.getPerson() : null;

            if (org) {
                setEntityType("o")
            }

            return {
                // organisation
                orgName: { label: 'Name', value: org ? org.getName() : '' },
                orgNumber: { label: 'Number', value: org ? org.getNumber() : '' },
                orgType: { label: 'Organisation Type', value: org ? org.getType().toString() : '0' },
                industry: { label: 'Industry', value: org ? org.getIndustry() : '' },
                // person
                firstName: { label: 'First Name', value: pers ? pers.getFirstName() : '' },
                middleName: { label: 'Middle Name', value: pers ? pers.getMiddleName() : '' },
                lastName: { label: 'Last Name', value: pers ? pers.getLastName() : '' },
                birthDate: { label: 'Date of Birth', value: pers ? (pers.getBirthDate() ? parseISO(pers.getBirthDate()) : null) : null, validators: [date] },
                // common
                addressLine1: { label: 'Address', value: entity ? entity.getAddressLine1() : '', validators: [required] },
                addressLine2: { label: '', value: entity ? entity.getAddressLine2() : '' },
                suburb: { label: 'Suburb', value: entity ? entity.getSuburb() : '' },
                city: { label: 'Town/City', value: entity ? entity.getCity() : '', validators: [required] },
                region: { label: 'State/Region', value: entity ? entity.getRegion() : '', validators: [required] },
                postCode: { label: 'ZIP/Postal', value: entity ? entity.getPostCode() : '' },
                country: { label: 'Country', value: entity ? entity.getCountry() : '', validators: [required] },
                phoneNumber: { label: 'Phone', value: entity ? entity.getPhoneNumber() : '', validators: [phoneNumber] },
            }
        },
        setValid
    );

    return (<>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", py: 2 }} >
            <Breadcrumbs>
                <Link component={RouterLink} to="/customers">Customers</Link>
                {(entityId) && <Link component={RouterLink} to={`/customers/${entityId}`}>{entityName()}</Link>}
                {(entityId) && <Typography color="textPrimary" variant="body2">Edit Details</Typography>}
                {(id === undefined) && <Typography color="textPrimary" variant="body2">Add</Typography>}
            </Breadcrumbs>
            <Button variant="contained"
                component={RouterLink} to={entity ? `/customers/${entityId}` : '/customers'}
                startIcon={<CancelIcon fontSize="small" />}
                data-test="cancel-button"
            >
                Cancel
            </Button>
        </Box>
        <Container maxWidth="sm">
            <Grid container spacing={1} data-test="entity-edit">
                <Grid item xs={12}>
                    {(entity || id === undefined) &&
                        // <EntityEdit state={state} onValidate={v => setValid(v)} ref={formRef} />
                        <Grid container spacing={1} sx={{ display: 'flex' }} data-test="edit-details">
                            <Grid item xs={12}>
                                <Typography variant="h2">Details</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonGroup aria-label="entity type button group">
                                    <Button
                                        variant={entityType === "p" ? 'contained' : ''}
                                        onClick={() => setEntityType("p")}
                                        data-test="person"
                                    >
                                        Person
                                    </Button>
                                    <Button
                                        variant={entityType === "o" ? 'contained' : ''}
                                        onClick={() => setEntityType("o")}
                                        data-test="organisation"
                                    >
                                        Organisation
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            {entityType === "o" &&
                                <Grid item xs={12}>
                                    <GroupHeading title="Organisation" />
                                    <TextInput name="orgName" field={form.orgName} onChange={setForm} />
                                    <TextInput name="orgNumber" field={form.orgNumber} onChange={setForm} />
                                    <RefSelect name="orgType" dataType="orgType" field={form.orgType} onChange={setForm} />
                                    <RefSelect name="industry" dataType="industry" field={form.industry} onChange={setForm} />
                                </Grid>
                            }
                            {entityType === "p" &&
                                <>
                                    <Grid item xs={12}>
                                        <GroupHeading title="Person" />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextInput name="firstName" field={form.firstName} onChange={setForm} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextInput name="middleName" field={form.middleName} onChange={setForm} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextInput name="lastName" field={form.lastName} onChange={setForm} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Date of Birth"
                                                name="birthDate"
                                                inputFormat="dd/MM/yyyy"
                                                value={form.birthDate.value}
                                                onChange={d => setForm({ target: { name: 'birthDate', value: d } })}
                                                renderInput={(params) => <TextField size="small" fullWidth {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </>
                            }
                            <Grid item xs={12}>
                                <GroupHeading title="Address" />
                                <TextInput name="addressLine1" field={form.addressLine1} onChange={setForm} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextInput name="addressLine2" field={form.addressLine2} onChange={setForm} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextInput name="suburb" field={form.suburb} onChange={setForm} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextInput name="city" field={form.city} onChange={setForm} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextInput name="postCode" field={form.postCode} onChange={setForm} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextInput name="region" field={form.region} onChange={setForm} />
                            </Grid>
                            <Grid item xs={12} >
                                <RefSelect name="country" dataType="country" field={form.country} onChange={setForm} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextInput name="phoneNumber" field={form.phoneNumber} onChange={setForm} />
                            </Grid>
                        </Grid>
                    }
                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 1 }} >
                        <ProgressButton
                            onButtonClick={handleSave}
                            data-test="save-details"
                            title="Save"
                            disabled={!valid}
                            loading={pending}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    </>);
}

export default Edit;
