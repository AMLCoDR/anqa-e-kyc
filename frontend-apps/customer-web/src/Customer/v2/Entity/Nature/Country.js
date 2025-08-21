import React, { forwardRef, useImperativeHandle } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GroupHeading, RefSelect, TextInput, useForm, numeric } from 'components/Form';
import cloneDeep from 'lodash.clonedeep';

import { Customer } from '../../../../proto/customer/v1beta1/customer_pb';

const parseCountries = countryList => {
    try {
        return JSON.parse(countryList);
    } catch {
        return '';
    }
};

const Country = forwardRef((props, ref) => {
    const { customer, onValidate } = props;
    const [form, setForm] = useForm(
        {
            regCountry: { label: 'Country of company registration', value: customer ? customer.getRegCountry() : '' },
            busCountry: { label: 'Principle country of business', value: customer ? customer.getBusCountry() : '' },
            tradeCountries: { label: 'Key trading countries', value: customer ? parseCountries(customer.getTradeCountries()) : '' },
            payCountries: { label: 'Countries payments made to', value: customer ? parseCountries(customer.getPayCountries()) : '' },
            receiveCountries: { label: 'Countries payments recieved from', value: customer ? parseCountries(customer.getReceiveCountries()) : '' },
            domTransValue: { label: 'Expected annual value', value: customer ? customer.getDomTransValue() : '', validators: [numeric] },
            domTransVolume: { label: 'Expected annual volume', value: customer ? customer.getDomTransVolume() : '', validators: [numeric] },
            domTransFreq: { label: 'Expected annual frequency', value: customer ? customer.getDomTransFreq() : '' },
            intTransValue: { label: 'Expected annual value', value: customer ? customer.getIntTransValue() : '', validators: [numeric] },
            intTransVolume: { label: 'Expected annual volume', value: customer ? customer.getIntTransVolume() : '', validators: [numeric] },
            intTransFreq: { label: 'Expected annual frequency', value: customer ? customer.getIntTransFreq() : '' },
        },
        onValidate
    );

    useImperativeHandle(ref, () => ({
        unpack() {
            let cust = new Customer();
            if (customer != null) {
                cust = cloneDeep(customer);
            }
            cust.setRegCountry(form.regCountry.value);
            cust.setBusCountry(form.busCountry.value);
            cust.setTradeCountries(JSON.stringify(form.tradeCountries.value));
            cust.setPayCountries(JSON.stringify(form.payCountries.value));
            cust.setReceiveCountries(JSON.stringify(form.receiveCountries.value));
            cust.setDomTransValue(form.domTransValue.value);
            cust.setDomTransVolume(form.domTransVolume.value);
            cust.setDomTransFreq(form.domTransFreq.value);
            cust.setIntTransValue(form.intTransValue.value);
            cust.setIntTransVolume(form.intTransVolume.value);
            cust.setIntTransFreq(form.intTransFreq.value);

            return cust;
        }
    }));

    const setCountries = event => {
        if (event.target) {
            const { name, value } = event.target;
            const countries = value ? value.filter(v => v !== '') : null;
            setForm({ target: { name, value: countries } });
        }
    };

    return (
        <Grid container spacing={1} data-test="country-edit">
            <Grid item xs={12}>
                <Typography variant="h2">Countries & Transactions</Typography>
            </Grid>
            <Grid item xs={12}>
                <RefSelect name="regCountry" field={form.regCountry} onChange={setForm} dataType="country" />
            </Grid>
            <Grid item xs={12}>
                <RefSelect name="busCountry" field={form.busCountry} onChange={setForm} dataType="country" />
            </Grid>
            <Grid item xs={12}>
                <RefSelect name="tradeCountries" field={form.tradeCountries} onChange={setCountries} dataType="country" multiple={true} />
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="What countries will payments be made to?" />
                <RefSelect name="payCountries" field={form.payCountries} onChange={setCountries} dataType="country" multiple={true} />
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="What countries will payments be received from?" />
                <RefSelect name="receiveCountries" field={form.receiveCountries} onChange={setCountries} dataType="country" multiple={true} />
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="What is the nature of domestic transactions?" />
                <TextInput name="domTransValue" field={form.domTransValue} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="domTransVolume" field={form.domTransVolume} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="domTransFreq" field={form.domTransFreq} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="What is the nature of international transactions?" />
                <TextInput name="intTransValue" field={form.intTransValue} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="intTransVolume" field={form.intTransVolume} onChange={setForm} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name="intTransFreq" field={form.intTransFreq} onChange={setForm} />
            </Grid>
        </Grid>
    );
});

export default Country;