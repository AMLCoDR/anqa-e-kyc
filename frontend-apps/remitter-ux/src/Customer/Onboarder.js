import React, {  useState } from 'react';

import Button from '@material-ui/core/Button';
import Stack from '@material-ui/core/Stack';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Stepper from '@material-ui/core/Stepper';
import { useParams } from 'react-router-dom';

import { useView } from '../Controller';
import Details from './Details';
import KeyPeople from './KeyPeople';
import NextSteps from './NextSteps';
import SelfOnboard from './SelfOnboard';

const allSteps = [
    // { label: 'Scan QR code', component: <SelfOnboard /> },
    { label: 'Details', component: <Details /> },
    { label: 'Key people', component: <KeyPeople /> },
    { label: 'Next steps', component: <NextSteps />, next: 'Finish' }
];

export const Onboarder = () => {
    const params = useParams();
    const [steps] = useState(allSteps);
    const [welcome, setWelcome] = useState(params.init === 'self');
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const { exit } = useView();

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const handleStart = () => {
        setWelcome(false);
    }

    const handleNext = () => {
        setCompleted(prev => {
            prev[activeStep] = true;
            return { ...prev };
        });

        if (completedSteps() === steps.length) {
            exit();
        }

        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    return (
        <>
            {welcome ? (
                <>
                    <SelfOnboard />
                    <Stack spacing={1} direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button onClick={() => exit()} variant="outlined">Cancel</Button>
                        <Button onClick={handleStart} variant="contained">Start</Button>
                    </Stack>
                </>
            ) : (
                <>
                    <Stepper color="inherit" nonLinear activeStep={activeStep} sx={{ mb: 3 }}>
                        {steps.map((step, index) =>
                            <Step key={step.label} completed={completed[index]}>
                                <StepButton onClick={handleStep(index)}>{step.label}</StepButton>
                            </Step>
                        )}
                    </Stepper>

                    {steps[activeStep].component}

                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                        <Button onClick={handleBack} variant="contained" color="inherit"
                            disabled={activeStep === 0}
                        >
                            Back
                        </Button>

                        <Stack spacing={1} direction="row" justifyContent="flex-end">
                            {activeStep < steps.length - 1 &&
                                <Button onClick={() => exit()} variant="outlined">
                                    {completedSteps() !== steps.length - 1 ? 'Cancel' : 'Finish'}
                                </Button>
                            }
                            <Button onClick={handleNext} variant="contained">
                                {steps[activeStep].next || 'Next'}
                            </Button>
                        </Stack>
                    </Stack>
                </>
            )}
        </ >
    );
}

export default Onboarder