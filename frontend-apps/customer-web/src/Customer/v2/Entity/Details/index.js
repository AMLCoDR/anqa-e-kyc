import React from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const orgType = ot => {
    if ((ot === null) || (ot === undefined) || (ot === '')) {
        return null;
    }
    const types = ['Company', 'Trust', 'Listed Company', 'Nominee Registry', 'Government Entity', 'Public-Private Enterprise'];
    return types[ot];
};

const Detail = props => {
    const { entity } = props;
    const navigate = useNavigate();

    const person = entity.getPerson();
    const org = entity.getOrganisation();
    const address = [];
    entity.getAddressLine1() && address.push(entity.getAddressLine1())
    entity.getAddressLine2() && address.push(entity.getAddressLine2())
    entity.getSuburb() && address.push(entity.getSuburb())
    if (entity.getCity()) {
        if (entity.getPostCode()) {
            address.push(`${entity.getCity()} ${entity.getPostCode()}`)
        } else {
            address.push(entity.getCity())
        }
    } else if (entity.getPostCode()) {
        address.push(entity.getPostCode())
    }
    entity.getRegion() && address.push(entity.getRegion())
    entity.getCountry() && address.push(entity.getCountry())

    const handleEdit = event => {
        event.preventDefault();
        navigate(`/customers/${entity.getId()}/details`);
    };

    return (<Card elevation={0} data-test="details">
        <CardHeader
            title="Details"
            data-ele="personal-details"
            action={
                <IconButton size="small" onClick={handleEdit} data-test="edit-details">
                    <EditIcon fontSize="small" />
                </IconButton>
            }
        />
        <CardContent>
            {person &&
                <>
                    <Grid container direction="row" py={1} justifyContent="space-between" alignItems="center">
                        <Typography variant='subtitle2'>Date of Birth</Typography>
                        <Typography variant='subtitle2' data-test="birth-date">{person.getBirthDate() ? format(parseISO(person.getBirthDate()), 'do MMMM, yyyy') : null}</Typography>
                    </Grid>
                    <Divider />
                </>
            }
            {org &&
                <React.Fragment>
                    <Grid container direction="row" py={1} justifyContent="space-between" alignItems="center">
                        <Typography variant='subtitle2'>Organisation Type</Typography>
                        <Typography variant='subtitle2' data-test="org-type" >{orgType(org.getType())} </Typography>
                    </Grid>
                    <Divider />
                    {org.getIndustry() &&
                        <>
                            <Grid container direction="row" py={1} justifyContent="space-between" alignItems="center">
                                <Typography variant='subtitle2'>Industry" </Typography>
                                <Typography variant='subtitle2' data-test="industry">{org.getIndustry()}</Typography>
                            </Grid>
                            <Divider />
                        </>
                    }
                </React.Fragment>
            }
            <>
                <Grid container direction="row" py={1} justifyContent="space-between" alignItems="center">
                    <Typography variant='subtitle2' >Address</Typography>
                    <Typography variant='subtitle2' sx={{ maxWidth: '15rem', flexWrap: 'wrap' }} data-test="address" >{address.join(', ')} </Typography>
                </Grid>
                <Divider />
            </>
            {entity.getPhoneNumber() &&
                <>
                    <Grid container direction="row" py={1} justifyContent="space-between" alignItems="center"  >
                        <Typography variant='subtitle2' >Phone</Typography>
                        <Typography variant='subtitle2' data-test="phone-number" sx={{ maxWidth: '10rem' }}>{entity.getPhoneNumber()}</Typography>
                    </Grid>
                    <Divider />
                </>
            }

        </CardContent>
    </Card>);
};

export default Detail;