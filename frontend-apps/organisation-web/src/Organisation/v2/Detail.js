import React, { useEffect, useCallback } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/system';
import { GroupHeading } from 'components/Form';
import { ProgressButton } from 'components/Form';
import { RefSelect } from 'components/Form';
import { TextInput } from 'components/Form';
import { useForm, required } from 'components/Form';
import { useResource } from 'components/Resource';
import { debounce } from 'lodash';

import { useOrganisation } from './context';
import { isDetailValid } from './context/validators';
import Warning from './Warning';

const CustomTableRow = styled(TableRow)({
    '& [class*="MuiTableCell-root"]': {
        paddingLeft: 0,
    },
    '& [class*="MuiTableCell-body"]': {
        color: 'tableData',
    }
});

const Detail = props => {
    const { edit, org } = props;
    // const { state: { labels } } = useResource();

    return (
        <Box data-test="organisation-details">
            <Typography variant="h2" gutterBottom noWrap>Organisation Details</Typography>
            {!isDetailValid(org) &&
                <Warning title="Organisation Details" />
            }
            {edit
                ? <DetailEdit {...props} />
                : <DetailView {...props} />
            }
        </Box>
    );
};

export default Detail;

const DetailEdit = ({ org, onSubmit, onNext, pending }) => {
    const { state: { labels } } = useResource();
    const { saveDraft } = useOrganisation();
    const [form, setForm, isValid] = useForm({
        name: { label: labels.org.step1.organisationName, value: org.name, validators: [required] },
        tradingAs: { label: labels.org.step1.tradingAs, value: org.tradingAs },
        businessNumber: { label: labels.org.step1.businessNo, value: org.businessNumber },
        orgType: { label: labels.org.step1.type, value: org.orgType },
        size: { label: labels.org.step1.numberOfEmployees, value: org.size },
        address: { label: labels.org.step1.address, value: org.address },
        city: { label: labels.org.step1.townCity, value: org.city },
        region: { label: labels.org.step1.stateRegion, value: org.region },
        postCode: { label: labels.org.step1.zip, value: org.postCode },
        country: { label: labels.org.step1.country, value: org.country },
        phoneNumber: { label: labels.org.step1.phoneNumber, value: org.phoneNumber },
        websiteUri: { label: labels.org.step1.url, value: org.websiteUri },
        contactName: { label: labels.org.step1.fullName, value: org.contactName },
        contactPhone: { label: labels.org.step1.phoneNumber, value: org.contactPhone },
        contactEmail: { label: labels.org.step1.email, value: org.contactEmail }
    });

    const unpack = useCallback(() => {
        const organisation = { ...org }
        Object.keys(form).forEach(k => {
            organisation[k] = form[k].value;
        });
        return organisation;
    }, [org, form]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSaveDraft = useCallback(debounce(() => {
        saveDraft(unpack());
    }, 500), [saveDraft, unpack]);

    useEffect(() => {
        if (isValid) {
            debouncedSaveDraft();
        }
    }, [isValid, debouncedSaveDraft, form]);

    const handleSubmit = event => {
        event.preventDefault();
        onSubmit(unpack());
    };

    const handleNext = event => {
        event.preventDefault();
        onNext(unpack());
    };

    return (
        <Grid container data-test="edit-details" sx={{ marginTop: '2' }}>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading title={labels.org.step1.title} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="name" field={form.name} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="tradingAs" field={form.tradingAs} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="businessNumber" field={form.businessNumber} onChange={setForm} />
            </Grid>
            <Grid item xs={12} >
                <RefSelect dataType="reportingEntity" name="orgType" field={form.orgType} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <RefSelect dataType="orgSize" name="size" field={form.size} onChange={setForm} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading title="Contact Details" />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="address" field={form.address} onChange={setForm} />
            </Grid>
            <Grid item xs={6} sx={{ paddingRight: '0.5rem' }}>
                <TextInput name="city" field={form.city} onChange={setForm} />
            </Grid>
            <Grid item xs={6} sx={{ paddingLeft: '0.5rem' }}>
                <TextInput name="region" field={form.region} onChange={setForm} />
            </Grid>
            <Grid item xs={6} sx={{ paddingRight: '0.5rem' }}>
                <TextInput name="postCode" field={form.postCode} onChange={setForm} />
            </Grid>
            <Grid item xs={6} sx={{ paddingLeft: '0.5rem' }}>
                <RefSelect name="country" dataType="country" field={form.country} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="phoneNumber" field={form.phoneNumber} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="websiteUri" field={form.websiteUri} onChange={setForm} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading title="Contact Person" />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="contactName" field={form.contactName} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="contactPhone" field={form.contactPhone} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="contactEmail" field={form.contactEmail} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="flex-end" paddingTop={2}>
                    <Button onClick={handleSubmit} sx={{ color: 'heading' }} disabled={!isValid} data-test="form-save">
                        {labels.buttons.saveForLater}
                    </Button>
                    <ProgressButton

                        disabled={!isValid}
                        loading={pending}
                        onButtonClick={handleNext}
                        title={labels.buttons.next}
                        data-test="form-next"
                    />
                </Box>
            </Grid>
        </Grid>
    );
};


const DetailView = ({ org }) => {

    return (
        <Card elevation={0} sx={{ marginTop: '2' }}>
            <CardContent>
                <Table>
                    <TableBody>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Name</Typography>
                            </TableCell>
                            <TableCell align="right">{org.name}</TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Trading as</Typography>
                            </TableCell>
                            <TableCell align="right">{org.tradingAs}</TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Business number</Typography>
                            </TableCell>
                            <TableCell align="right">{org.businessNumber}</TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Company type</Typography>
                            </TableCell>
                            <TableCell align="right">{org.orgType}</TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Address</Typography>
                            </TableCell>
                            <TableCell align="right">
                                {org.address}<br />
                                {org.city}<br />
                                {org.region} {org.postCode}<br />
                                {org.country}
                            </TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Phone</Typography>
                            </TableCell>
                            <TableCell align="right">{org.phoneNumber}</TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Website</Typography>
                            </TableCell>
                            <TableCell align="right">{org.websiteUri}</TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Contact person</Typography>
                            </TableCell>
                            <TableCell align="right">{org.contactName}</TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Phone</Typography>
                            </TableCell>
                            <TableCell align="right">{org.contactPhone}</TableCell>
                        </CustomTableRow>
                        <CustomTableRow>
                            <TableCell>
                                <Typography variant='h4'>Email</Typography>
                            </TableCell>
                            <TableCell align="right">{org.contactEmail}</TableCell>
                        </CustomTableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};