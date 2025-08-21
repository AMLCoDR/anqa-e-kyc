import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

import { Customer } from '../../../proto/customer/v1beta1/customer_pb';
import { PurposeEdit } from './Purpose/Edit';

export const MakeCustomer = props => {
    const { entityType, onSave } = props;
    const [mode, setMode] = useState('view');

    const handleSave = c => {
        onSave(c);
    };

    return (
        <Card elevation={0} data-test="relationship-purpose">
            <CardHeader
                data-ele="relationship-purpose"
                title={(mode === 'edit') && "Purpose of Customer's Relationship"}
                subheader={mode === 'edit'
                    ? "Describe the purpose of the business relationship — why this customer uses your firm's products or services"
                    : "This " + entityType + " is not currently a customer"
                }
                action={
                    mode === 'edit'
                        ? <IconButton size="small" onClick={() => setMode('view')}>
                            <CancelIcon fontSize="small" />
                        </IconButton>
                        : <Button variant="contained" onClick={() => setMode('edit')} data-test="make-customer">
                            Make a Customer
                        </Button>
                }
            />
            {(mode === 'edit') &&
                <CardContent>
                    <PurposeEdit customer={new Customer()} onSave={handleSave} />
                </CardContent>
            }
        </Card>
    );
};

export const RemoveCustomer = props => {
    const { entityType, onRemove } = props;

    return (
        <Box sx={{ p: 3 }} >
            <Grid container>
                <Grid item xs={6}>
                    {`This ${entityType} is a customer. `}
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" onClick={onRemove}>
                        Remove Customer Information
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <strong>Caution:</strong><br />
                    If you remove customer information, Relationship Purpose and Business Nature information (above) will be permanently deleted.
                </Grid>
            </Grid>
        </Box>
    );
}