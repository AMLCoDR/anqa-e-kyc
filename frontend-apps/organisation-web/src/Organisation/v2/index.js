import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MobileStepper from '@material-ui/core/MobileStepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { useResource } from 'components/Resource';
import mixpanel from 'mixpanel-browser';

import Consent from './Consent'
import { useOrganisation } from './context';
import { isDetailValid, isNatureValid, isInfoSecValid, isConsentValid } from './context/validators';
import Detail from './Detail';
import InfoSec from './InfoSec';
import Nature from './Nature';

const steps = [
    { label: 'Organisation Details', testId: 'details' },
    { label: 'Nature & Purpose', testId: 'nature' },
    { label: 'Information Security', testId: 'security' },
    { label: 'Customer Consent', testId: 'consent' },
];

const Organisation = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [edit, setEdit] = useState(false);
    const { state, update } = useOrganisation();
    const { draft, organisation } = state;
    const { state: { labels } } = useResource();

    const orgValid = [
        isDetailValid(organisation),
        isNatureValid(organisation),
        isInfoSecValid(organisation),
        isConsentValid(organisation)
    ]

    useEffect(() => {
        mixpanel.track('View organisation page')
    }, []);

    const handleStep = (index) => {
        setActiveStep(index)
    };

    const handleSave = (org) => {
        saveIfUpdates(org);
        setEdit(false);
    };

    const saveIfUpdates = (org) => {
        if (!org) {
            return;
        }
        update(org);
    };

    const handleNext = (org) => {
        saveIfUpdates(org);
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = (org) => {
        saveIfUpdates(org);
        setActiveStep(prev => prev - 1);
    };

    return (
        <Box display="flex" data-test="organisation">
            <Hidden smDown>
                <Box sx={{ width: '20rem', paddingTop: '2rem' }}>
                    <DesktopStepper steps={steps} activeStep={activeStep} onStep={handleStep} valid={orgValid} />
                </Box>
            </Hidden>
            <Box pt={5} pl={8} pr={6} width="100%">
                <Grid container spacing={2}>
                    <Hidden mdUp>
                        <Grid item xs={12}>
                            <MobileStepper
                                variant="dots"
                                steps={steps.length}
                                position="static"
                                activeStep={activeStep}
                                backButton={
                                    <Button
                                        onClick={() => handleBack(draft.org)}
                                        disabled={activeStep === 0}
                                        startIcon={<KeyboardArrowLeft />}
                                        data-test="mobile-back"
                                    >
                                        {labels.buttons.back}
                                    </Button>
                                }
                                nextButton={
                                    <Button
                                        onClick={() => handleNext(draft.org)}
                                        disabled={activeStep === 3}
                                        endIcon={<KeyboardArrowRight />}
                                        data-test="mobile-next"
                                    >
                                        {labels.buttons.next}
                                    </Button>
                                }
                            />
                        </Grid>
                    </Hidden>
                    <Grid item xs={12} md={9} sx={{ order: { xs: 3, md: 2 } }}>
                        {activeStep === 0 &&
                            <Detail
                                edit={edit}
                                org={organisation}
                                onSubmit={o => handleSave(o, null, null)}
                                onNext={o => handleNext(o, null, null)}
                                onCancel={() => setEdit(false)}
                                pending={state.pending}
                            />
                        }
                        {activeStep === 1 &&
                            <Nature
                                edit={edit}
                                org={organisation}
                                onSubmit={o => handleSave(o, null, null)}
                                onNext={o => handleNext(o, null, null)}
                                onCancel={() => setEdit(false)}
                                pending={state.pending}
                            />
                        }
                        {activeStep === 2 &&
                            <InfoSec
                                edit={edit}
                                org={organisation}
                                onSubmit={(o) => handleSave(o)}
                                onNext={(o) => handleNext(o)}
                                onCancel={() => setEdit(false)}
                                pending={state.pending}
                            />
                        }
                        {activeStep === 3 &&
                            <Consent
                                edit={edit}
                                org={organisation}
                                onSubmit={(o) => handleSave(o)}
                                onCancel={() => setEdit(false)}
                                pending={state.pending}
                            />
                        }
                    </Grid>
                    <Grid sx={{ order: { xs: 3, md: 2 }, position: { xs: 'relative', md: '' }, top: { xs: '6', md: 0 } }} item xs={12} md={3}>
                        <Box display="flex" justifyContent="flex-end" alignItems="center">
                            {edit
                                ? <Button variant="contained"
                                    onClick={() => setEdit(false)}
                                    startIcon={<ClearIcon fontSize="small" />}
                                    data-test="cancel">
                                    {labels.buttons.cancel}
                                </Button>
                                : <Button variant="contained"
                                    onClick={() => setEdit(true)}
                                    startIcon={<EditIcon fontSize="small" />}
                                    data-test="edit">
                                    {labels.buttons.edit}
                                </Button>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
};

export default Organisation;

const DesktopStepper = ({ steps, activeStep, onStep, valid }) => {

    return (
        <Box data-test="stepper">
            <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => {
                    const { label, testId } = step;
                    return (
                        <Step completed={valid[index]} key={label}>
                            <StepButton onClick={() => onStep(index)} data-test={testId}>
                                {valid[index]
                                    ? <StepLabel StepIconComponent={CheckedIcon}>{label}</StepLabel>
                                    : <StepLabel>{label}</StepLabel>
                                }
                            </StepButton>
                        </Step>
                    )
                })}
            </Stepper>
        </Box>
    );
};

const CheckedIcon = () => {
    return (
        <CheckCircleIcon sx={{ fontSize: '30', color: 'success.main' }} />
    );
};
