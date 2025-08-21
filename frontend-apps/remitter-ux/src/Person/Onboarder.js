import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Stack from '@material-ui/core/Stack';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
// import StepButton from '@material-ui/core/StepButton';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';

import { useView } from '../Controller';
import AddressVerified from './AddressVerified';
import ConfirmId from './ConfirmId';
import EnterAddress from './EnterAddress';
import EnterDetails from './EnterDetails';
import EnterId from './EnterId';
import IdCheck from './IdCheck';
import IdVerified from './IdVerified';
import Liveness from './Liveness';
import NextSteps from './NextSteps';
import ScanId from './ScanId';
import SelfOnboard from './SelfOnboard';
import VcChallenge from './VcChallenge';

const allSteps = [
    {
        label: 'Avid wallet',
        caption: 'Use your Avid wallet to scan this code and verify your credentials',
        component: VcChallenge        
    },
    {
        label: 'Enter details',
        caption: 'Your details are needed in order to confirm your identity and rapidly process you in our system.',
        component: EnterDetails
    },
    {
        label: 'Liveness detection',
        caption: 'We need to confirm you are a human',
        component: Liveness
    },
    {
        label: 'Scan ID',
        caption: 'We can get the information we require directly off your chosen ID',
        component: ScanId
    },
    {
        label: 'Confirm ID',
        caption: 'Check the details we scanned are correct before proceeding',
        component: ConfirmId
    },
    {
        label: 'Verify ID',
        caption: 'Your ID details will be matched...',
        component: EnterId,
        next: 'Verify'
    },
    {
        label: 'ID verified',
        caption: '',
        component: IdVerified
    },
    {
        label: 'Verify address',
        caption: 'We need to confirm your address... ',
        component: EnterAddress,
        next: 'Verify'
    },
    {
        label: 'Address verified',
        caption: '',
        component: AddressVerified,
        next: 'Finish'
    },
    {
        label: 'All done',
        caption: 'Please review the information you have supplied and confirm you are happy before finishing',
        component: NextSteps,
        next: 'Finish'
    }
];

export const Onboarder = () => {
    const params = useParams();
    const [welcome, setWelcome] = useState(params.init === 'self');
    const [steps, setSteps] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const { exit } = useView();

    useEffect(() => {
        switch (params.init) {
            case 'qr':
                setSteps([allSteps[0], allSteps[6]]);
                break;
            case 'self':
                setSteps([...allSteps.slice(0, 3), ...allSteps.slice(4)]);
                break;
            case 'scan':
               // setSteps([...allSteps.slice(2, 4), ...allSteps.slice(5)]);
               setSteps([
                {
                    label: 'Scan ID',
                    caption: 'We can get the information we require directly off your chosen ID',
                    component: IdCheck
                },      
                {
                    label: 'Confirm ID',
                    caption: 'Check the details we scanned are correct before proceeding',
                    component: ConfirmId
                },    
                {
                    label: 'ID verified',
                    caption: '',
                    component: IdVerified
                },
                {
                    label: 'Verify address',
                    caption: 'We need to confirm your address... ',
                    component: EnterAddress,
                    next: 'Verify'
                },
                {
                    label: 'Address verified',
                    caption: '',
                    component: AddressVerified,
                    next: 'Finish'
                },     
                {
                    label: 'Liveness detection',
                    caption: 'We need to confirm you are a human',
                    component: Liveness
                },
                {
                    label: 'All done',
                    caption: 'Please review the information you have supplied and confirm you are happy before finishing',
                    component: NextSteps,
                    next: 'Finish'
                }
            ]);
                break;
            case 'add':
                setSteps([allSteps[0], ...allSteps.slice(4)]);
                break;
            default:
            //setSteps(allSteps);
        }
    }, [params]);

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

    // const handleStep = (step) => () => {
    //     setActiveStep(step);
    // };

    if (!welcome && steps.length === 0) {
        return null;
    }

    return (
        <>
            <Typography variant="h2">Verify Identity</Typography>
            <Typography variant="subtitle" gutterBottom>
                The information you provide will help us to quickly confirm your identity.
            </Typography>

            {welcome ? (
                <>
                    <SelfOnboard />
                    <Stack spacing={1} direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button onClick={() => exit()} variant="outlined">Cancel</Button>
                        <Button onClick={handleStart} variant="contained">Start</Button>
                    </Stack>
                </>
            ) : (
                <Stepper orientation="vertical" activeStep={activeStep}>
                    {steps.map((step, index) =>
                        <Step key={step.label} completed={completed[index]}>
                            <StepLabel optional={<Typography variant="caption">{step.caption}</Typography>}>
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                {React.createElement(steps[activeStep].component, { onNext: handleNext })}

                                <Stack spacing={1} direction="row">
                                    <Button onClick={handleNext} variant="contained" sx={{ mt: 1, mr: 1 }}>
                                        {index === steps.length - 1 ? 'Finish' : steps[activeStep].next || 'Continue'}
                                    </Button>
                                    <Button onClick={handleBack} disabled={index === 0} sx={{ mt: 1, mr: 1 }}>
                                        Back
                                    </Button>
                                </Stack>
                            </StepContent>
                        </Step>
                    )}
                </Stepper>
            )}
        </>
    );
}

export default Onboarder