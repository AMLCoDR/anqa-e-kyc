import React, { useCallback, useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import { styled } from '@material-ui/system';
import { GroupHeading } from 'components/Form';
import { ProgressButton } from 'components/Form';
import { useForm } from 'components/Form';
import { useResource } from 'components/Resource';
import { debounce } from 'lodash';

import { useOrganisation } from './context';
import { isNatureValid } from './context/validators';
import Warning from './Warning';

const CustomList = styled(List)({
    marginTop: 2,
    '& [class*="MuiListItem-gutters"]': {
        paddingLeft: 0,
    },
    '& [class*="MuiListItemIcon-root"]': {
        // display: 'block',
        minWidth: 4.5
    }
});

const Nature = props => {
    const { edit, org } = props;
    const { state: { labels } } = useResource();

    return (
        <div data-test="organisation-nature">
            <Typography variant="h2" gutterBottom noWrap>{labels.org.step2.title}</Typography>
            {!isNatureValid(org) &&
                <Warning title={labels.org.step2.title} />
            }
            {edit
                ? <NatureEdit {...props} />
                : <NatureView {...props} />
            }
        </div>
    )
};

export default Nature;

const NatureEdit = ({ org, onSubmit, onNext, pending }) => {
    const { saveDraft } = useOrganisation();
    const [form, setForm, isValid] = useForm({
        nature: { label: null, value: org.nature },
        useOfId: { label: null, value: org.useOfId },
    });
    const defaultUse = 'Compliance with anti-money laundering obligations';
    const [useDefault, setUseDefault] = useState(defaultUse);
    const { state: { labels } } = useResource();

    useEffect(() => {
        if (!org.useOfId || (org.useOfId === defaultUse)) {
            setUseDefault(defaultUse);
        } else {
            setUseDefault('other');
        }
    }, [org]);

    const handleUseOfIdChange = event => {
        setUseDefault(event.target.value);
    };

    const unpack = useCallback(() => {
        return {
            ...org,
            nature: form.nature.value,
            useOfId: useDefault === 'other' ? form.useOfId.value : defaultUse,
        };
    }, [org, form, useDefault]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSaveDraft = useCallback(debounce(() => {
        saveDraft(unpack());
    }, 500), [saveDraft, unpack]);

    useEffect(() => {
        if (isValid) {
            debouncedSaveDraft();
        }
    }, [isValid, debouncedSaveDraft, form]);

    const handleSubmit = event => {
        event.preventDefault();
        onSubmit(unpack());
    };

    const handleNext = event => {
        event.preventDefault();
        onNext(unpack());
    };

    return (
        <Grid container>
            <Grid item xs={12} sx={{ marginTop: '2' }}>
                <GroupHeading title={labels.org.step2.natureOfYourBusiness} subtitle={labels.org.step2.outlineBusiness} />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    sx={{
                        '& [class*="MuiOutlinedInput-root"]': {
                            height: 'auto'
                        }
                    }}
                    multiline
                    rows={5}
                    name="nature"
                    fullWidth
                    margin='normal'
                    value={form.nature.value}
                    onChange={e => setForm(e)}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12}>
                <GroupHeading title={labels.org.step2.howOrgVerification} subtitle={labels.org.step2.describeOrgPlans} />
            </Grid>
            <Grid item xs={12} >
                <FormControl required margin="dense" component="fieldset">
                    <RadioGroup name="options" value={useDefault} onChange={handleUseOfIdChange}>
                        <FormControlLabel
                            name="compliance-radio"
                            value={defaultUse}
                            control={<Radio size="small" />}
                            label={<GroupHeading title={defaultUse} />}
                        />
                        <FormControlLabel
                            name="other-radio"
                            value="other"
                            control={<Radio size="small" />}
                            label={<GroupHeading title="Other" />} />
                    </RadioGroup>
                </FormControl>
            </Grid>
            {(useDefault === 'other') &&
                <Grid item xs={12}>
                    <TextField
                        sx={{
                            '& [class*="MuiOutlinedInput-root"]': {
                                height: 'auto'
                            }
                        }}
                        multiline
                        rows={5}
                        name='useOfId'
                        fullWidth
                        margin='normal'
                        value={form.useOfId.value}
                        onChange={e => setForm(e)}
                        variant="outlined"

                    />
                </Grid>
            }
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="flex-end" paddingTop={2}>
                    <Button onClick={handleSubmit} sx={{ color: 'heading' }} disabled={!isValid} data-test="form-save">
                        {labels.buttons.saveForLater}
                    </Button>
                    <ProgressButton

                        disabled={!isValid}
                        loading={pending}
                        onButtonClick={handleNext}
                        title={labels.buttons.next}
                        data-test="form-next"
                    />
                </Box>
            </Grid>
        </Grid>
    )
}

const NatureView = ({ org }) => {
    const { state: { labels } } = useResource();

    return (
        <CustomList>
            <ListItem>
                <ListItemText
                    primary={labels.org.step2.natureOfBusiness}
                    secondary={org.nature}
                />
                {!org.nature &&
                    <ListItemIcon>
                        <ErrorIcon sx={{ color: 'warning.main' }} />
                    </ListItemIcon>
                }
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText
                    primary={labels.org.step2.idVerification}
                    secondary={org.useOfId}
                />
                {!org.useOfId &&
                    <ListItemIcon>
                        <ErrorIcon sx={{ color: 'warning.main' }} />
                    </ListItemIcon>
                }
            </ListItem>
        </CustomList>
    );
};

