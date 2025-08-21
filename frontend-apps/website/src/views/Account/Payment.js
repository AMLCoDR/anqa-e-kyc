import React, { useState, useRef, useImperativeHandle } from 'react';

import { useAuth0 } from "@auth0/auth0-react";
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useFeature } from '@optimizely/react-sdk';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useParams } from 'react-router-dom';

import ActionLink from '../../components/ActionLink';
// import { useAlerter } from '../../components/AlertProvider';
import config from '../../config';
import { SubscriptionServiceClient } from './proto/subscription/v1/subscription_grpc_web_pb';
import { PurchaseRequest, PlanType } from './proto/subscription/v1/subscription_pb';

const plans = {
    starter: {
        title: 'Starter',
        price: '$150',
        type: PlanType.STARTER
    },
    professional: {
        title: 'Professional',
        price: '$380',
        type: PlanType.PROFESSIONAL
    },
    premium: {
        title: 'Premium',
        price: '$750',
        type: PlanType.PREMIUM
    },
}

const service = new SubscriptionServiceClient(config.apiUrl);

export const Payment = () => {
    const { getAccessTokenSilently } = useAuth0();
    // const { showAlert, showMessage } = useAlerter();
    const [usePayment] = useFeature('payment');
    const stripe = useStripe();
    const elements = useElements();
    const plan = plans[useParams().planId];
    const [values, setValues] = useState({ fullname: '' });
    const [processing, setProcessing] = useState(false);

    const handleSubscribe = async () => {
        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        // get any card element and Stripe will get the rest 
        const cardElement = elements.getElement(CardCvcElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                email: values.email,
                name: values.fullname,
                // address: {
                //     postal_code: values.postcode,
                // },
            },
        });

        if (!error) {
            const req = new PurchaseRequest();
            req.setPlanType(plan.type);
            req.setPaymentMethodId(paymentMethod.id);

            service.purchase(req, { Authorization: 'Bearer ' + await getAccessTokenSilently() },
                (error, res) => {
                    if (error) {
                        console.error(error);
                        // showAlert(error.message);
                    } else {
                        // showMessage("Payment successful");
                    }
                });
        } else {
            // showAlert(error.message)
        }

        setProcessing(false);
    }

    return (

        <Box sx={{
            padding: 5,
            maxWidth: 90,
            display: "flex",
            justifyContent: "center"
        }}>
            <Typography variant="h3">Subscribe to Avid's {plan.title} plan</Typography>

            {usePayment &&
                <Grid container spacing={1} sx={{
                    margin: (1, 0),
                    '& .MuiTextField-root': {
                        margin: (1, 0),
                    },
                    '& .MuiButton-root': {
                        margin: (1, 0),
                        padding: (1, 0),
                        fontWeight: 600,
                    }
                }}>
                    <Grid item xs={12}>
                        <Typography variant="h4">{plan.price} per month</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Full name" name="fullname" variant="outlined" required fullWidth
                            value={values.fullname}
                            onChange={e => setValues({ ...values, fullname: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Credit card number" name="ccnumber" variant="outlined" required fullWidth
                            InputProps={{
                                inputComponent: StripeElement,
                                inputProps: { element: CardNumberElement }
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Expiry date" name="ccexp" variant="outlined" required fullWidth
                            InputProps={{
                                inputComponent: StripeElement,
                                inputProps: { element: CardExpiryElement }
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="CVC" name="cvc" variant="outlined" required fullWidth
                            InputProps={{
                                inputComponent: StripeElement,
                                inputProps: { element: CardCvcElement },
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" disableElevation fullWidth
                            onClick={handleSubscribe}
                            disabled={processing}
                        >
                            {processing ? <CircularProgress size={24} /> : 'Subscribe'}
                        </Button>
                    </Grid>
                </Grid>
            }
            {!usePayment &&
                <Box padding="1">
                    <Typography align="center" variant="h3">
                        Welcome to Avid AML.
                    </Typography>
                    <Typography variant="h5" align="center">
                        <Link component={ActionLink} to="/home#contact" >
                            Contact us
                        </Link>
                        &nbsp;if you would like to subscribe to a full version of Avid AML.
                    </Typography>
                </Box>
            }
        </Box>

    )
}

export default Payment;

// wrap Stripe Element for Material UI look & feel while surfacing all interactions
const StripeElement = ({ element: Element, inputRef, ...rest }) => {
    const ref = useRef();
    useImperativeHandle(inputRef, () => ({
        focus: () => ref.current.focus
    }));

    return (
        <Element onReady={element => (ref.current = element)} {...rest} />
    );
}