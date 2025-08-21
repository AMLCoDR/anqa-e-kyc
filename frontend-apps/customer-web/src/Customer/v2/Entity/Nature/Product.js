import React, { forwardRef, useImperativeHandle } from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GroupHeading, TextInput, useForm, required } from 'components/Form';
import cloneDeep from 'lodash.clonedeep';

import { Customer } from '../../../../proto/customer/v1beta1/customer_pb';


const Product = forwardRef((props, ref) => {
    const { customer, onValidate } = props;
    const [form, setForm] = useForm(
        {
            prodOffshore: { label: null, value: customer ? customer.getProdOffshore() : null },
            thirdPartyOperate: { label: null, value: customer ? customer.getThirdPartyOperate() : null },
            thirdPartyReceipts: { label: null, value: customer ? customer.getThirdPartyReceipts() : null },
            indirectRelationships: { label: null, value: customer ? customer.getIndirectRelationships() : null },
            accessMethod: { label: 'How is the product accessed by the customer?', value: customer ? customer.getAccessMethod() : '', validators: [required] },
        },
        onValidate
    );

    useImperativeHandle(ref, () => ({
        unpack() {
            let cust = new Customer();
            if (customer !== null) {
                cust = cloneDeep(customer);
            }
            cust.setProdOffshore(form.prodOffshore.value);
            cust.setThirdPartyOperate(form.thirdPartyOperate.value);
            cust.setThirdPartyReceipts(form.thirdPartyReceipts.value);
            cust.setIndirectRelationships(form.indirectRelationships.value);
            cust.setAccessMethod(form.accessMethod.value);

            return cust;
        }
    }));

    return (
        <Grid container spacing={1} sx={{
            '& [class*="MuiButtonGroup-root"]': {
                paddingTop: 1
            }
        }} data-test="product-edit">
            <Grid item xs={12}>
                <Typography variant="h2">Products & Delivery</Typography>
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="Can the product be used from offshore?" />
                <ButtonGroup data-test="prodOffshore" data-test-value={form.prodOffshore.value}>
                    <Button
                        color={form.prodOffshore.value === true ? 'primary' : ''}
                        variant={form.prodOffshore.value === true ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'prodOffshore', value: true } })}
                        data-test="true"
                    >
                        Yes
                    </Button>
                    <Button
                        color={form.prodOffshore.value === false ? 'primary' : ''}
                        variant={form.prodOffshore.value === false ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'prodOffshore', value: false } })}
                        data-test="false"
                    >
                        No
                    </Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="Is there a 3rd Party operating the product?" />
                <ButtonGroup data-test="thirdPartyOperate" data-test-value={form.thirdPartyOperate.value}>
                    <Button
                        color={form.thirdPartyOperate.value === true ? 'primary' : ''}
                        variant={form.thirdPartyOperate.value === true ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'thirdPartyOperate', value: true } })}
                        data-test="true"
                    >
                        Yes
                    </Button>
                    <Button
                        color={form.thirdPartyOperate.value === false ? 'primary' : ''}
                        variant={form.thirdPartyOperate.value === false ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'thirdPartyOperate', value: false } })}
                        data-test="false"
                    >
                        No
                    </Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="Does the customer expect to receive transactions from 3rd parties?" />
                <ButtonGroup data-test="thirdPartyReceipts" data-test-value={form.thirdPartyReceipts.value}>
                    <Button
                        color={form.thirdPartyReceipts.value === true ? 'primary' : ''}
                        variant={form.thirdPartyReceipts.value === true ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'thirdPartyReceipts', value: true } })}
                        data-test="true"
                    >
                        Yes
                    </Button>
                    <Button
                        color={form.thirdPartyReceipts.value === false ? 'primary' : ''}
                        variant={form.thirdPartyReceipts.value === false ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'thirdPartyReceipts', value: false } })}
                        data-test="false"
                    >
                        No
                    </Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="Does the firm have any indirect relationships with customers?" />
                <ButtonGroup data-test="indirectRelationships" data-test-value={form.indirectRelationships.value}>
                    <Button
                        color={form.indirectRelationships.value === true ? 'primary' : ''}
                        variant={form.indirectRelationships.value === true ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'indirectRelationships', value: true } })}
                        data-test="true"
                    >
                        Yes
                    </Button>
                    <Button
                        color={form.indirectRelationships.value === false ? 'primary' : ''}
                        variant={form.indirectRelationships.value === false ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'indirectRelationships', value: false } })}
                        data-test="false"
                    >
                        No
                    </Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title="What are the product delivery and distribution channel?" data-ele="productDeliveryChannel" />
                <TextInput name="accessMethod" field={form.accessMethod} onChange={setForm} />
            </Grid>
        </Grid>
    );
});

export default Product;