import React, { forwardRef, useImperativeHandle } from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GroupHeading, TextInput, useForm, required } from 'components/Form';
import cloneDeep from 'lodash.clonedeep';

import { Customer } from '../../../../proto/customer/v1beta1/customer_pb';

const Institution = forwardRef((props, ref) => {
    const { customer, onValidate } = props;
    const [form, setForm] = useForm(
        {
            exposureUnregulated: { label: 'Exposure', value: customer ? customer.getExposureUnregulated() : '', validators: [required] },
            exposureShellCo: { label: 'Exposure', value: customer ? customer.getExposureShellCo() : '', validators: [required] },
            exposureShellBank: { label: 'Exposure', value: customer ? customer.getExposureShellBank() : '', validators: [required] },
        },
        onValidate
    );

    useImperativeHandle(ref, () => ({
        unpack() {
            let cust = new Customer();
            if (customer !== null) {
                cust = cloneDeep(customer);
            }
            cust.setExposureUnregulated(form.exposureUnregulated.value);
            cust.setExposureShellCo(form.exposureShellCo.value);
            cust.setExposureShellBank(form.exposureShellBank.value);

            return cust;
        }
    }));

    return (
        <Grid container spacing={1} data-test="institution-edit">
            <Grid item xs={12}>
                <Typography variant="h2">Institutional Exposure</Typography>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex' }} data-ele='unregulated-financial-institutions'>
                    <GroupHeading title="What is the overall exposure to unregulated financial institutions?" />
                </Box>
                <TextInput name="exposureUnregulated" field={form.exposureUnregulated} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex' }} data-ele='shell-corporation'>
                    <GroupHeading title="What is the overall exposure to shell companies?" />
                </Box>
                <TextInput name="exposureShellCo" field={form.exposureShellCo} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex' }} data-ele='shell-banks'>
                    <GroupHeading title="What is the overall exposure to shell banks?" />
                </Box>
                <TextInput name="exposureShellBank" field={form.exposureShellBank} onChange={setForm} />
            </Grid>
        </Grid>
    );
});

export default Institution;
