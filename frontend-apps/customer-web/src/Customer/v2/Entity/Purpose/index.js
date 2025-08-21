import React, { useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import cloneDeep from 'lodash.clonedeep';

import { useCustomer } from '../../context';
import { PurposeEdit } from './Edit';

export const Purpose = props => {
    const {customer } = props;
    const [mode, setMode] = useState('view');
    const { update } = useCustomer();

    const handleSave = c => {
        const cust = cloneDeep(c);
        update(cust);
        setMode('view');
    };

    return (
        <Card elevation={0} data-test="relationship-purpose">
            <CardHeader
                title="Relationship Purpose"
                subheader="The purpose of the business relationship — why this customer uses your firm's products or services"
                action={
                    mode === 'edit'
                        ? <IconButton size="small" onClick={() => setMode('view')}>
                            <CancelIcon fontSize="small" />
                        </IconButton>
                        : <IconButton size="small" onClick={() => setMode('edit')} data-test="edit-purpose">
                            <EditIcon fontSize="small" />
                        </IconButton>
                }
                data-ele="relationship-purpose"
            />
            <CardContent>
                {mode === 'edit'
                    ? <PurposeEdit customer={customer} onSave={handleSave} />
                    : customer.getPurpose()
                }
            </CardContent>
        </Card>
    );
};

export default Purpose;
