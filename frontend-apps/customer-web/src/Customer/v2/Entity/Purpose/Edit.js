import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { MultilineInput, useForm, required } from 'components/Form';
import cloneDeep from 'lodash.clonedeep';

export const PurposeEdit = props => {
    const { customer, onSave } = props;
    const [valid, setValid] = useState(true);

    const [form, setForm] = useForm(
        {
            purpose: { label: 'Purpose', value: customer ? customer.getPurpose() : '', validators: [required] },
        },
        v => setValid(v)
    );

    const handleSave = () => {
        if (valid) {
            const cust = cloneDeep(customer);
            cust.setPurpose(form.purpose.value);
            onSave(cust);
        }
    };

    return (
        <Grid container spacing={1} data-test="edit-purpose">
            <Grid item xs={12}>
                <MultilineInput name="purpose" field={form.purpose} onChange={setForm} />
                <Typography variant="caption">
                    This information will typically be reviewed in the organisation's annual audit.
                    It should be updated whenever there is a material change to the relationship.
                </Typography>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Button disabled={!valid} variant="contained" onClick={handleSave} data-test="save">
                    Update
                </Button>
            </Grid>
        </Grid>
    );
};