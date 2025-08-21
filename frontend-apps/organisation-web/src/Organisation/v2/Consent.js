import React, { useCallback, useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import ErrorIcon from '@material-ui/icons/Error';
import { styled } from '@material-ui/system';
import { useDocument } from 'components/Document';
import { FileUpload } from 'components/Form';
import { GroupHeading } from 'components/Form';
import { ProgressButton } from 'components/Form';
import { useForm } from 'components/Form';
import { useResource } from 'components/Resource';
import { debounce } from 'lodash';
// import config from 'react-global-configuration';

import config from '../../config';
import { useOrganisation } from './context';
import { isConsentValid } from './context/validators';
import Warning from './Warning';

const CustomList = styled(List)({
    marginTop: '2',
    '& [class*="MuiListItem-gutters"]': {
        paddingLeft: '0',
    },
    '& [class*="MuiListItemIcon-root"]': {
        display: 'block',
        minWidth: '4.5'
    },
    '& [class*="MuiListItemIcon-alignItemsFlexStart"]': {
        marginTop: '0.5'
    }
});

const Consent = props => {
    const { edit, org } = props;
    const { state: { labels } } = useResource();
    const [consentDoc, setConsentDoc] = useState();
    const { get: getDoc } = useDocument("organisation");

    useEffect(() => {
        if (org.consentFormDocId) {
            getDoc(org.consentFormDocId,
                (err, rsp) => setConsentDoc(rsp)
            );
        }
    }, [org, getDoc]);

    return (
        <div data-test="organisation-consent">
            <Typography variant="h2" gutterBottom noWrap>{labels.org.step4.title}</Typography>
            {!isConsentValid(org) &&
                <Warning title={labels.org.step4.title} />
            }
            {edit
                ? <ConsentEdit {...props} consentDoc={consentDoc} />
                : <ConsentView {...props} consentDoc={consentDoc} />
            }
        </div>
    );
};

export default Consent;

const ConsentView = props => {
    const { org, consentDoc } = props;
    const { state: { labels } } = useResource();

    return (
        <CustomList>
            <ListItem>
                <ListItemIcon sx={{ paddingRight: 1 }}>
                    {org.seekConsent
                        ? <CheckCircleIcon sx={{ color: 'success.main' }} />
                        : <CheckBoxOutlineBlankIcon sx={{ color: 'text.disabled' }} />
                    }
                </ListItemIcon>
                <ListItemText
                    primary={labels.org.step4.customerConsent}
                    primaryTypographyProps={org.seekConsent ? null : { style: { color: 'grey.300' } }}
                />
            </ListItem>
            <ListItem alignItems='flex-start'>
                <ListItemIcon sx={{ paddingRight: 1 }}>
                    {org.hasConsentWording
                        ? <CheckCircleIcon sx={{ color: 'success.main' }} />
                        : <CheckBoxOutlineBlankIcon sx={{ color: 'text.disabled' }} />
                    }
                </ListItemIcon>
                <ListItemText
                    primary={labels.org.step4.consentFormTitle}
                    primaryTypographyProps={org.hasConsentWording ? null : { style: { color: 'grey.300' } }}
                    secondary={<Typography variant='subtitle1' sx={{ paddingTop: '1rem', fontSize: '0.9rem', lineHeight: 1.8, fontStyle: "oblique" }} display='block'>
                        "I confirm that I am authorised to provide the personal details presented and I consent to my information being passed to and checked with the document issuer, official record holder, a credit bureau and authorised third parties for the purpose of verifying my identity and address."
                    </Typography>}
                />
            </ListItem>
            <Divider />
            <ListItem>
                {consentDoc
                    ? <>
                        <ListItemIcon>
                            <DescriptionOutlinedIcon sx={{ color: 'text.primary' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Customer consent form"
                            secondary={<Link target="_blank" href={consentDoc.getUrl()}>{consentDoc.getName()}</Link>}
                        />
                    </>
                    : <>
                        <ListItemText
                            primary="Customer consent form"
                            secondary={labels.org.step4.consentFormReq}
                        />
                        <ListItemIcon>
                            <ErrorIcon sx={{ color: 'warning.main', marginLeft: '0.5rem' }} />
                        </ListItemIcon>
                    </>
                }
            </ListItem>
        </CustomList>
    );
};

const ConsentEdit = props => {
    const { org, consentDoc, onSubmit, pending } = props;
    const { saveDraft } = useOrganisation();
    const [form, setForm, isValid] = useForm({
        seekConsent: { label: null, value: org.seekConsent },
        hasConsentWording: { label: null, value: org.hasConsentWording }
    });
    const [newFile, setNewFile] = useState();
    const { state: { labels } } = useResource();
    const { add: addDoc, remove: removeDoc } = useDocument("organisation");

    const unpack = useCallback(() => {
        let organisation = { ...org }
        Object.keys(form).forEach(k => {
            organisation[k] = form[k].value;
        });
        return organisation;
    }, [org, form]);

    useEffect(() => {
        if (isValid) {
            const consentFile = newFile;
            debounce(() => saveDraft(unpack(), consentFile), 500);
        }
    }, [isValid, saveDraft, unpack, newFile]);

    const handleFileChange = file => {
        if (file && file.size > config.maxUploadSize) {
            setNewFile(null);
        } else {
            setNewFile(file);
        }
    };

    const handleSubmit = event => {
        event.preventDefault();
        const organisation = unpack();

        if (newFile) {
            if (org.consentFormDocId) {
                removeDoc(org.consentFormDocId);
            }
            addDoc(newFile, "Consent Form", (err, rsp) => {
                organisation.consentFormDocId = rsp.getId();
                onSubmit(organisation);
            });
        } else {
            onSubmit(organisation);
        }
    };

    return (
        <Grid container>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="seekConsent"
                            checked={form.seekConsent.value}
                            onChange={e => setForm({ target: { name: e.target.name, value: e.target.checked } })}
                        />
                    }
                    label={<Typography variant='h4'>{labels.org.step4.customerConsent}</Typography>}
                    sx={{ marginTop: '2' }}
                />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="hasConsentWording"
                            checked={form.hasConsentWording.value}
                            onChange={e => setForm({ target: { name: e.target.name, value: e.target.checked } })}
                        />
                    }
                    label={<Typography variant='h4'>{labels.org.step4.consentFormTitle}</Typography>}
                    sx={{ marginTop: '2' }}
                />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <Typography variant='subtitle1' sx={{ paddingLeft: '2rem', fontSize: '0.9rem', lineHeight: 1.8, fontStyle: "oblique" }} display='block'>
                    "I confirm that I am authorised to provide the personal details presented and I consent to my information being passed to and checked with the document issuer, official record holder, a credit bureau and authorised third parties for the purpose of verifying my identity and address."
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading
                    title={org.consentFormDocId ? labels.org.step4.uploadedForm : labels.org.step4.uploadForm}
                    subtitle={labels.org.step4.consentForm}
                />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ marginTop: '2' }} name="form" display="flex" alignItems="center">
                    {consentDoc &&
                        <Typography component="div" variant="subtitle1" sx={{ paddingRight: '16px' }}>
                            {consentDoc.getName()}
                        </Typography>
                    }
                    {(!Boolean(consentDoc) && Boolean(newFile)) &&
                        <Typography component="div" variant="subtitle1" sx={{ paddingRight: '16px' }}>
                            {newFile.name}
                        </Typography>
                    }
                    <FileUpload onChange={handleFileChange} title={consentDoc ? 'Change Consent Form' : 'Add Consent Form'} />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="flex-end" paddingTop={2}>
                    <ProgressButton
                        disabled={!isValid}
                        loading={pending}
                        onButtonClick={handleSubmit}
                        title={labels.buttons.finish}
                        data-test="form-save"
                    />
                </Box>
            </Grid>
        </Grid>
    )
}