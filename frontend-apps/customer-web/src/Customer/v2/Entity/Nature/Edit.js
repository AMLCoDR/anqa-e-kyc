import React, { useEffect, useRef, useState } from 'react';

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import MobileStepper from '@material-ui/core/MobileStepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { useResource } from 'components/Resource';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import { useEntity, useCustomer } from '../../context';
import Country from './Country';
import Institution from './Institution';
import Product from './Product';
import { isCountryValid, isProductValid, isInstitutionValid } from './validators';


const steps = [
    { label: 'Countries & transactions', testId: 'step-country' },
    { label: 'Products & delivery', testId: 'step-product' },
    { label: 'Institutional exposure', testId: 'step-institution' },
];

export const Edit = props => {
    const [activeStep, setActiveStep] = useState(0);
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();
    const { id, step } = useParams();
    const formRef = useRef();
    const { state: { entity, pending }, get } = useEntity();
    const { state: { customer }, get: getCustomer, update: updateCustomer } = useCustomer();
    const { state: { labels } } = useResource();

    // get entity
    useEffect(() => {
        id && get(id);
    }, [get, id]);

    // get customer
    useEffect(() => {
        if (entity && entity.getCustomerId()) {
            getCustomer(entity.getCustomerId());
        }
    }, [entity, getCustomer]);

    useEffect(() => {
        step && setActiveStep(parseInt(step));
    }, [step]);

    const save = () => {
        if (!customer) {
            return;
        }
        const c = formRef.current.unpack();
        updateCustomer(c);
    };

    const goToView = () => {
        if (entity) {
            navigate(`/customers/${entity.getId()}`);
        } else {
            navigate('/customers');
        }
    }

    const handleLater = () => {
        save();
        goToView();
    };

    const handleNext = () => {
        save();
        if (activeStep < (steps.length - 1)) {
            setActiveStep(prev => prev + 1);
        } else {
            goToView();
        }
    };

    const handleStep = index => {
        setActiveStep(index);
    };

    const entityName = () => {
        if (!entity) {
            return '';
        }
        const o = entity.getOrganisation();
        if (o) {
            return o.getName();
        }
        const p = entity.getPerson();
        if (p) {
            return p.getFirstName() + ' ' + p.getLastName();
        }
        return '';
    };

    const validators = [
        isCountryValid(customer),
        isProductValid(customer),
        isInstitutionValid(customer),
    ];

    return (<>{entity && <>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", py: 2 }} >
            <Breadcrumbs>
                <Link component={RouterLink} to="/customers">Customers</Link>
                <Link component={RouterLink} to={`/customers/${entity.getId()}`}>
                    {entityName()}
                </Link>
                <Typography color="textPrimary" variant="body2">
                    Edit Nature
                </Typography>
            </Breadcrumbs>
            <Button
                variant="contained"

                startIcon={<CancelIcon fontSize="small" />}
                data-test="cancel-button"
                component={RouterLink}
                to={id ? `/customers/${id}` : "/customers"}
            >
                Cancel
            </Button>
        </Box>
        <Grid container spacing={1} data-test="nature-edit">
            <Grid item xs={12} md={3}>
                <FormStepper steps={steps} activeStep={activeStep} onStep={handleStep} completed={validators} />
            </Grid>
            <Grid item xs={12} md={7}>
                <Typography variant="h3">{entityName()}</Typography>
                {activeStep === 0 && <Country customer={customer} onValidate={v => setIsValid(v)} ref={formRef} />}
                {activeStep === 1 && <Product customer={customer} onValidate={v => setIsValid(v)} ref={formRef} />}
                {activeStep === 2 && <Institution customer={customer} onValidate={v => setIsValid(v)} ref={formRef} />}
                <Box sx={{ display: "flex", justifyContent: "flex-end", '& button': { margin: 2 } }}>
                    {activeStep < (steps.length - 1) &&
                        <Button onClick={handleLater} disabled={!isValid || pending}>
                            {labels.buttons.saveClose}
                        </Button>
                    }
                    <Button onClick={handleNext}
                        disabled={!isValid || pending}
                        variant="contained"
                        data-test="save-next"
                    >
                        {activeStep < (steps.length - 1) ? labels.buttons.next : labels.buttons.save}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    </>}</>);
};

export default Edit;

const FormStepper = ({ steps, activeStep, onStep, completed }) => {
    const { state: { labels } } = useResource();

    return (
        <>
            <Hidden smDown>
                <Stepper activeStep={activeStep} orientation="vertical" data-test="stepper">
                    {steps.map((step, index) =>
                        <Step completed={completed[index]} key={step.label} >
                            <StepButton
                                disabled={false}
                                onClick={() => onStep(index)}
                                data-test={step.testId}
                            >
                                {completed[index]
                                    ? <StepLabel StepIconComponent={CheckedIcon}>{step.label}</StepLabel>
                                    : <StepLabel align="left">{step.label}</StepLabel>

                                }
                            </StepButton>
                        </Step>
                    )}
                </Stepper>
            </Hidden>

            <Hidden mdUp>
                <MobileStepper
                    variant="dots"
                    steps={steps.length}
                    position="static"
                    activeStep={activeStep}
                    backButton={
                        <Button size="small"
                            onClick={() => onStep(activeStep - 1)}
                            disabled={activeStep === 0}
                            startIcon={<KeyboardArrowLeft />}
                        >
                            {labels.buttons.back}
                        </Button>
                    }
                    nextButton={
                        <Button size="small"
                            onClick={() => onStep(activeStep + 1)}
                            disabled={activeStep === 4}
                            endIcon={<KeyboardArrowRight />}
                        >
                            {labels.buttons.next}
                        </Button>
                    }
                />
            </Hidden>
        </>
    );
};

const CheckedIcon = () => {
    return (
        <CheckCircleIcon sx={{ fontSize: '30', color: 'success.main' }} />
    );
};
