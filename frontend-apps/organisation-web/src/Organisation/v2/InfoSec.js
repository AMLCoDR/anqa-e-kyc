import React, { useCallback, useEffect, useState } from 'react';

import { TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
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
import { isInfoSecValid } from './context/validators';
import Warning from './Warning';

const CustomList = styled(List)({
    marginTop: 2,
    '& [class*="MuiListItem-gutters"]': {
        paddingLeft: 0,
    },
    '& [class*="MuiListItemIcon-root"]': {
        display: 'block',
        minWidth: '4.5'
    }
});

const InfoSec = props => {
    const { edit, org } = props;
    const { state: { labels } } = useResource();
    const [privacyDoc, setPrivacyDoc] = useState();
    const { get: getDoc } = useDocument("organisation");

    useEffect(() => {
        if (org.privacyPolicyDocId) {
            getDoc(org.privacyPolicyDocId,
                (err, rsp) => setPrivacyDoc(rsp)
            );
        }
    }, [org, getDoc]);

    return (
        <div data-test="organisation-security">
            <Typography variant="h2" gutterBottom noWrap>{labels.org.step3.title}</Typography>
            {!isInfoSecValid(org) &&
                <Warning title={labels.org.step3.title} />
            }
            {edit
                ? <InfoSecEdit {...props} privacyDoc={privacyDoc} />
                : <InfoSecView  {...props} privacyDoc={privacyDoc} />
            }
        </div>
    );
};

export default InfoSec;

const InfoSecView = props => {
    const { org, privacyDoc } = props;
    const { state: { labels } } = useResource();

    return (
        <CustomList>
            <ListItem>
                <Typography variant='h3' >{labels.org.step3.agreements}</Typography>
                {(!org.agreeInfoSecurity || !org.agreeRiskManagement || !org.hasBreachProcess || !org.hasPrivacyPolicy) &&
                    <ListItemIcon sx={{ paddingLeft: '0.5rem', paddingTop: '0.25rem' }}>
                        <ErrorIcon sx={{ color: 'warning.main' }} fontSize="small" />
                    </ListItemIcon>
                }
            </ListItem>
            <ListItem>
                <ListItemIcon sx={{ paddingRight: 1 }} >
                    {org.agreeInfoSecurity
                        ? <CheckCircleIcon sx={{ color: 'success.main' }} />
                        : <CheckBoxOutlineBlankIcon sx={{ color: 'text.disabled' }} />
                    }
                </ListItemIcon>
                <ListItemText
                    primary={labels.org.step3.infosecPolicy}
                    primaryTypographyProps={org.agreeInfoSecurity ? null : { style: { color: 'grey.300' } }}
                />
            </ListItem>
            <ListItem >
                <ListItemIcon sx={{ paddingRight: 1 }}>
                    {org.agreeRiskManagement
                        ? <CheckCircleIcon sx={{ color: 'success.main' }} />
                        : <CheckBoxOutlineBlankIcon sx={{ color: 'text.disabled' }} />
                    }
                </ListItemIcon>
                <ListItemText
                    primary={labels.org.step3.riskManagementPolicy}
                    primaryTypographyProps={org.agreeRiskManagement ? null : { style: { color: 'grey.300' } }}
                />
            </ListItem>
            <ListItem >
                <ListItemIcon sx={{ paddingRight: 1 }}>
                    {org.hasBreachProcess
                        ? <CheckCircleIcon sx={{ color: 'success.main' }} />
                        : <CheckBoxOutlineBlankIcon sx={{ color: 'text.disabled' }} />
                    }
                </ListItemIcon>
                <ListItemText
                    primary={labels.org.step3.secIncident}
                    primaryTypographyProps={org.hasBreachProcess ? null : { style: { color: 'grey.300' } }}
                />
            </ListItem>
            <ListItem alignItems='flex-start'>
                <ListItemIcon sx={{ paddingRight: 1 }}>
                    {org.hasPrivacyPolicy
                        ? <CheckCircleIcon sx={{ color: 'success.main' }} />
                        : <CheckBoxOutlineBlankIcon sx={{ color: 'text.disabled' }} />
                    }
                </ListItemIcon>
                <ListItemText
                    primary={labels.org.step3.privacyPolicy}
                    primaryTypographyProps={org.hasPrivacyPolicy ? null : { style: { color: 'grey.300' } }}
                    secondary={labels.org.step3.sitedCopy}
                />
            </ListItem>
            <Divider />
            <ListItem>
                {privacyDoc
                    ? <>
                        <ListItemIcon>
                            <DescriptionOutlinedIcon sx={{ color: 'text.primary' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={labels.org.step3.privacyPolicyDoc}
                            secondary={<Link target="_blank" href={privacyDoc.getUrl()}>{privacyDoc.getName()}</Link>}
                        />
                    </>
                    : <>
                        <ListItemText primary={labels.org.step3.privacyPolicyDoc} secondary={labels.org.step3.privacyPolicyDocReq} />
                        <ListItemIcon>
                            <ErrorIcon sx={{ color: 'warning.main' }} />
                        </ListItemIcon>
                    </>
                }
            </ListItem>
            <Divider />
            <ListItem>
                <Typography variant='h3' gutterBottom sx={{ marginTop: '2rem' }}>{labels.org.step3.privacyInfo}</Typography>
            </ListItem>
            <ListItem>
                <ListItemText primary={labels.org.step3.nzPrivacyAct} secondary={labels.org.step3.nzPrivacyActDescription} />
                <ListItemSecondaryAction>
                    <Typography variant='h5' color="primary">
                        {org.nzBreach === true
                            ? 'Yes'
                            : 'No'
                        }
                    </Typography>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText
                    primary={labels.org.step3.ausPrivacyAct}
                    secondary={labels.org.step3.ausPrivacyActDescription}
                />
                <ListItemSecondaryAction>
                    <Typography variant='h5' color="primary">
                        {org.ausBreach === true
                            ? 'Yes'
                            : 'No'
                        }
                    </Typography>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary={labels.org.step3.capturedAct} />
                <ListItemSecondaryAction>
                    <Typography variant='h5' color="primary">
                        {org.ausAutoPrivacy === true
                            ? 'Yes'
                            : 'No'
                        }
                    </Typography>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
        </CustomList>
    );
};

const InfoSecEdit = props => {
    const { org, privacyDoc, onSubmit, onNext, pending } = props;
    const { saveDraft } = useOrganisation();
    const [form, setForm, isValid] = useForm({
        agreeInfoSecurity: { label: null, value: org.agreeInfoSecurity },
        agreeRiskManagement: { label: null, value: org.agreeRiskManagement },
        hasBreachProcess: { label: null, value: org.hasBreachProcess },
        hasPrivacyPolicy: { label: null, value: org.hasPrivacyPolicy },
        nzBreach: { label: null, value: org.nzBreach },
        nzBreachDetail: { label: null, value: org.nzBreachDetail },
        nzBreachMitigation: { label: null, value: org.nzBreachMitigation },
        ausBreach: { label: null, value: org.ausBreach },
        ausBreachDetail: { label: null, value: org.ausBreachDetail },
        ausBreachMitigation: { label: null, value: org.ausBreachMitigation },
        ausAutoPrivacy: { label: null, value: org.ausAutoPrivacy },
    });
    const [newFile, setNewFile] = useState(null);
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
            const privacyFile = newFile;
            debounce(() => saveDraft(unpack(), privacyFile), 500);
        }
    }, [isValid, saveDraft, unpack, newFile]);

    const handleFileChange = file => {
        if (file && file.size > config.maxUploadSize) {
            setNewFile(null);
        } else {
            setNewFile(file);
        }
    };

    const handleSubmit = (event, isNext) => {
        event.preventDefault();
        const organisation = unpack();

        if (newFile) {
            if (org.privacyPolicyId) {
                removeDoc(org.privacyPolicyId);
            }
            addDoc(newFile, "Privacy Policy", (err, rsp) => {
                organisation.privacyPolicyDocId = rsp.getId();
                isNext ? onNext(organisation) : onSubmit(organisation);
            });
        } else {
            isNext ? onNext(organisation) : onSubmit(organisation);
        }
    };

    return (
        <Grid container>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="agreeInfoSecurity"
                            checked={form.agreeInfoSecurity.value}
                            onChange={e => setForm({ target: { name: e.target.name, value: e.target.checked } })}
                        />
                    }
                    label={<Typography variant='h4'>{labels.org.step3.infosecPolicy}</Typography>}
                />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="agreeRiskManagement"
                            checked={form.agreeRiskManagement.value}
                            onChange={e => setForm({ target: { name: e.target.name, value: e.target.checked } })}
                        />
                    }
                    label={<Typography variant='h4'>{labels.org.step3.riskManagementPolicy}</Typography>}
                />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="hasBreachProcess"
                            checked={form.hasBreachProcess.value}
                            onChange={e => setForm({ target: { name: e.target.name, value: e.target.checked } })}
                        />
                    }
                    label={<Typography variant='h4'>{labels.org.step3.secIncident}</Typography>}
                />
                <Typography sx={{ paddingLeft: '2rem' }} variant="subtitle1" display='block'>
                    An example process can be <Link target='_blank' underline='always' href='https://www.anqaml.com'>downloaded here</Link>
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="hasPrivacyPolicy"
                            checked={form.hasPrivacyPolicy.value}
                            onChange={e => setForm({ target: { name: e.target.name, value: e.target.checked } })}
                        />
                    }
                    label={<Typography variant='h4'>We have a documented privacy policy</Typography>}
                />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading
                    title={privacyDoc ? 'Uploaded Privacy Policy' : 'Upload Privacy Policy'}
                    subtitle={labels.org.step3.diaSightedCopy}
                />
            </Grid>
            <Grid item xs={12}>
                <Box name="fileUpload" sx={{ marginTop: '2' }} display="flex" alignItems="center">
                    {privacyDoc &&
                        <Typography component="div" variant="subtitle1" sx={{ paddingRight: '16px' }}>
                            {privacyDoc.getName()}
                        </Typography>
                    }
                    {(!Boolean(privacyDoc) && Boolean(newFile)) &&
                        <Typography component="div" variant="subtitle1" sx={{ paddingRight: '16px ' }}>
                            {newFile.name}
                        </Typography>
                    }
                    <FileUpload onChange={handleFileChange} title={privacyDoc ? 'Change Privacy Policy' : 'Add Privacy Policy'} />
                </Box>
                <Typography sx={{ marginTop: '2' }} variant='subtitle1' display='block'>
                    An example privacy policy can be <Link target='_blank' underline='always' href='https://www.anqaml.com/document/privacy-policy'>downloaded here</Link>
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading title={labels.org.step3.nzPrivacyAct} subtitle={labels.org.step3.nzPrivacyActDescription} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <ButtonGroup name="nzPrivacy">
                    <Button
                        color={form.nzBreach.value === true ? 'primary' : ''}
                        variant={form.nzBreach.value === true ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'nzBreach', value: true } })}
                    >
                        Yes
                    </Button>
                    <Button
                        color={form.nzBreach.value === false ? 'primary' : ''}
                        variant={form.nzBreach.value === false ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'nzBreach', value: false } })}
                    >
                        No
                    </Button>
                </ButtonGroup>
            </Grid>
            {form.nzBreach.value === true &&
                <>
                    <Grid item xs={12} sx={{ marginTop: '2' }}>
                        <Typography variant='subtitle1'>
                            {labels.org.step3.provideDetails}
                        </Typography>
                        <TextField
                            sx={{
                                '& [class*="MuiOutlinedInput-root"]': {
                                    height: 'auto'
                                }
                            }}
                            multiline
                            rows={5}
                            name='nzBreachDetail'
                            fullWidth
                            margin='normal'
                            value={form.nzBreachDetail.value}
                            onChange={e => setForm(e)}
                            v ariant="outlined"
                            color="secondary"
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '2' }}>
                        <Typography variant='subtitle1'>
                            {labels.org.step3.policiesPutInPlace}
                        </Typography>
                        <TextField
                            sx={{
                                '& [class*="MuiOutlinedInput-root"]': {
                                    height: 'auto'
                                }
                            }}
                            multiline
                            rows={5}
                            name='nzBreachMitigation'
                            fullWidth
                            margin='normal'
                            value={form.nzBreachMitigation.value}
                            onChange={e => setForm(e)}
                            variant="outlined"
                            color="secondary"
                        />
                    </Grid>
                </>
            }
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading title={labels.org.step3.ausPrivacyAct} subtitle={labels.org.step3.ausPrivacyActDescription} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <ButtonGroup name="ausPrivacy">
                    <Button
                        color={form.ausBreach.value === true ? 'primary' : ''}
                        variant={form.ausBreach.value === true ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'ausBreach', value: true } })}
                    >
                        Yes
                    </Button>
                    <Button
                        color={form.ausBreach.value === false ? 'primary' : ''}
                        variant={form.ausBreach.value === false ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'ausBreach', value: false } })}
                    >
                        No
                    </Button>
                </ButtonGroup>
            </Grid>
            {form.ausBreach.value === true &&
                <>
                    <Grid item xs={12} sx={{ marginTop: '2' }}>
                        <Typography variant='subtitle1'>
                            {labels.org.step3.provideDetails}
                        </Typography>
                        <TextField
                            sx={{
                                '& [class*="MuiOutlinedInput-root"]': {
                                    height: 'auto'
                                }
                            }}
                            multiline
                            rows={5}
                            name='ausBreachDetail'
                            fullWidth
                            margin='normal'
                            value={form.ausBreachDetail.value}
                            onChange={e => setForm(e)}
                            variant="outlined"
                            color="secondary"
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '2' }}>
                        <Typography variant='subtitle1'>
                            {labels.org.step3.policiesPutInPlace}
                        </Typography>
                        <TextField
                            sx={{
                                '& [class*="MuiOutlinedInput-root"]': {
                                    height: 'auto'
                                }
                            }}
                            multiline
                            rows={5}
                            name='ausBreachMitigation'
                            fullWidth
                            margin='normal'
                            value={form.ausBreachMitigation.value}
                            onChange={e => setForm(e)}
                            variant="outlined"
                            color="secondary"
                        />
                    </Grid>
                </>
            }
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading title={labels.org.step3.capturedAct} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <ButtonGroup name="ausOrgPrivacyAct">
                    <Button
                        color={form.ausAutoPrivacy.value === true ? 'primary' : ''}
                        variant={form.ausAutoPrivacy.value === true ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'ausAutoPrivacy', value: true } })}
                    >
                        Yes
                    </Button>
                    <Button
                        color={form.ausAutoPrivacy.value === false ? 'primary' : ''}
                        variant={form.ausAutoPrivacy.value === false ? 'contained' : 'outlined'}
                        onClick={() => setForm({ target: { name: 'ausAutoPrivacy', value: false } })}
                    >
                        No
                    </Button>
                </ButtonGroup>
                <Typography sx={{ marginTop: '2' }} variant='subtitle1'>
                    {labels.org.step3.capturedActDescription}
                </Typography>
                <Typography sx={{ marginTop: '2' }} variant='subtitle1'>
                    You can <Link target='_blank' underline='always' href='https://www.oaic.gov.au/assets/privacy/privacy-registers/privacy-opt-in-register/opt-in-form.pdf'>opt in online here</Link> and <Link target='_blank' underline='always' href='https://forms.business.gov.au/smartforms/servlet/SmartForm.html?formCode=APC_ENQ'>submit form here</Link>.
                    More information can be found <Link target='_blank' underline='always' href='https://www.oaic.gov.au/privacy/privacy-registers/privacy-opt-in-register/opting-in-to-the-privacy-act/'>here</Link>.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="flex-end" paddingTop={2}>
                    <Button onClick={e => handleSubmit(e, false)} disabled={!isValid} data-test="form-save">
                        {labels.buttons.saveForLater}
                    </Button>
                    <ProgressButton
                        color="primary"
                        disabled={!isValid}
                        loading={pending}
                        onButtonClick={e => handleSubmit(e, true)}
                        title={labels.buttons.next}
                        data-test="form-next"
                    />
                </Box>
            </Grid>
        </Grid>
    )
}

