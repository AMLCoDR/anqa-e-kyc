import React, { Fragment, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import { useNavigate, useParams } from 'react-router-dom';

import { useData } from '../Datasource';
import RiskChip from './RiskChip';
import RiskSelector from './RiskSelector';

const KeyPersonList = props => {
    const [state, actions] = useData();
    const [people, setPeople] = useState([]);
    const [risk, setRisk] = useState(0);
    let { custId = '0' } = useParams(); // Real app should not use default; should be an error condition
    const navigate = useNavigate();

    useEffect(() => {
        setPeople(state.people);
        setRisk(state.customer.risk);
    }, [state]);

    const handleChangeRisk = r => {
        actions.updateCustomerRisk(custId, r);
        setRisk(r);
    };

    const handleChangeOwnership = (personId, event) => {
        event.stopPropagation();
        actions.updatePersonOwnership(personId, event.target.checked);
    };

    return (<>
        <Typography variant="h2">Customer Due Diligence</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" my={2} pr={2}>
            <Typography variant="h3">{state.customer && state.customer.name}</Typography>
            <RiskSelector risk={risk} onChange={handleChangeRisk} />
        </Stack>
        <Typography variant="h5">Purpose</Typography>
        <Typography color="textSecondary">{state.customer.purpose}</Typography>
        <Typography variant="h5" mt={2}>
            Key person risk assessment
        </Typography>
        <List>
            {people.map((p, i) => (<Fragment key={i}>
                <ListItem
                    secondaryAction={<RiskChip risk={p.risk} onClick={() => navigate(`/cdd/${custId}/person/${i}`)} />}
                >
                    <ListItemText
                        key={'name' + i}
                        primary={
                            <Typography onClick={() => navigate(`/cdd/${custId}/person/${i}`)}>
                                {p.givenNames} {p.familyName}
                            </Typography>
                        }
                        secondary={<>
                            <Typography component="div" variant="body2">{p.relationship}</Typography>
                            <FormControlLabel
                                value="ownership"
                                label="Ownership"
                                labelPlacement="end"
                                control={
                                    <Checkbox
                                        checked={Boolean(p.ownership)}
                                        onChange={e => handleChangeOwnership(i, e)}
                                    />
                                }
                                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                            />
                        </>}
                        secondaryTypographyProps={{ component: 'div' }}
                    />
                </ListItem>
                <Divider component="li" />
            </Fragment>))}
        </List>
        <Stack spacing={1} direction="row" justifyContent="flex-end" pr={2}>
            <Button onClick={() => navigate('/')} variant="contained">Done</Button>
        </Stack>
    </>);
};

export default KeyPersonList;