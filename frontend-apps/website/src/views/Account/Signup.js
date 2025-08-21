import React, { useCallback, useState, useReducer } from 'react';

import { useAuth0 } from "@auth0/auth0-react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText';
import Link from '@material-ui/core/Link';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useParams, Redirect } from 'react-router-dom';

import ActionLink from '../../components/ActionLink';
// import { useAlerter } from '../../components/AlertProvider';
import config from '../../config';
import { UserServiceClient } from './proto/user/v1/user_grpc_web_pb';
import { SignUpRequest } from './proto/user/v1/user_pb';




const emailRegex = /\S+@\S+/;
const pwdRegex = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;

const reducer = (state, action) => {
    let error

    switch (action.type) {
        case 'email':
            if (!emailRegex.test(action.value.toLowerCase())) {
                error = "Please enter a valid email address";
            };
            return { ...state, email: action.value, errors: { ...state.errors, email: error } };
        case 'organisation':
            return { ...state, organisation: action.value };
        case 'contact':
            return { ...state, contact: action.value };
        case 'password':
            if (!pwdRegex.test(action.value)) {
                error = "Your password does not meet the complexity rules outlined below";
            };
            return { ...state, password: action.value, errors: { ...state.errors, password: error } };
        case 'confirm':
            if (state.password !== action.value) {
                error = "Your passwords don't match";
            };
            return { ...state, confirm: action.value, errors: { ...state.errors, confirm: error } };
        case 'agree':
            return { ...state, agree: action.value };
        default:
    }
}
const init = {
    email: "",
    contact: "",
    organisation: "",
    password: "",
    confirm: "",
    agree: false,
    errors: {}
};

const service = new UserServiceClient(config.apiUrl);

const validateToken = token => token === config.signUpToken;

export const Signup = () => {
    const token = useParams().token;
    // const { showAlert } = useAlerter();
    const [submitting, setSubmitting] = useState(false);
    const { loginWithRedirect } = useAuth0();
    const [state, dispatch] = useReducer(reducer, init);
    const [signedUp, setSignedUp] = useState(false);

    const formValid = useCallback(() => {
        if (!state.email || !state.password || !state.organisation
            || !state.confirm || !state.agree) {
            return false;
        }

        for (var err in state.errors) {
            if (state.errors[err]) {
                return false;
            }
        }

        return true;
    }, [state]);

    const handleSignup = (e) => {
        setSubmitting(true);

        const req = new SignUpRequest();
        req.setEmail(state.email);
        req.setName(state.contact)
        req.setOrgName(state.organisation)
        req.setPassword(state.password);

        service.signUp(req, {}, (error, res) => {
            if (error) {
                console.error(error);
                // showAlert(error.message);
            } else {
                setSignedUp(true);
            }
        });

        setSubmitting(false);
    }

    if (!validateToken(token)) {
        return <Redirect to="/signup" />;
    }

    return (
        <Box sx={{
            margin: '0px calc(50% - 50vw)', background: 'background.paper'
        }}>
            <Box sx={{ maxWidth: 60, '&>* a': { textDecoration: 'underline' }, margin: 'auto', padding: 10 }}>
                {!signedUp &&
                    <>
                        <Typography variant="h2">Create your account</Typography>
                        <TextField label="Email address" id="email" name="email" required variant="outlined" fullWidth
                            value={state.email}
                            onChange={e => dispatch({ type: 'email', value: e.target.value })}
                            sx={{ marginTop: 3 }}
                            helperText={state.errors.email}
                            error={state.errors.email && state.errors.email !== ""}
                        />
                        <TextField label="Organisation" id="organisation" name="organisation" required variant="outlined" fullWidth
                            value={state.organisation}
                            onChange={e => dispatch({ type: 'organisation', value: e.target.value })}
                            sx={{ marginTop: 3 }}
                        />
                        <TextField label="Contact" id="contact" name="contact" variant="outlined" fullWidth
                            value={state.contact}
                            onChange={e => dispatch({ type: 'contact', value: e.target.value })}
                            sx={{ marginTop: 3 }}
                        />
                        <TextField label="Create password" type="password" name="password" variant="outlined" required fullWidth
                            value={state.password}
                            onChange={e => dispatch({ type: 'password', value: e.target.value })}
                            sx={{ marginTop: 3 }}
                            helperText={state.errors.password}
                            error={state.errors.password && state.errors.password !== ""}
                        />
                        <FormHelperText id="component-helper-text">
                            Your password needs to be at least 8 characters of upper (A-Z) and lower case (a-z) letters,
                            numbers (0-9), and special characters (!@#$%^&*)
                        </FormHelperText>
                        <TextField label="Confirm password" type="password" name="confirm" variant="outlined" required fullWidth
                            value={state.confirm}
                            onChange={e => dispatch({ type: 'confirm', value: e.target.value })}
                            sx={{ marginTop: 3 }}
                            helperText={state.errors.confirm}
                            error={state.errors.confirm && state.errors.confirm !== ""}
                        />
                        <FormControlLabel
                            onChange={e => dispatch({ type: 'agree', value: e.target.checked })}
                            checked={state.agree}
                            control={
                                <Checkbox
                                    sx={{
                                        ml: 1, width: '2rem', height: '1.5rem'

                                    }}
                                    name="agree" color="primary" disableRipple required
                                    inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                                />
                            }
                            label={
                                <Typography variant="body1">
                                    I agree to the <Link component={ActionLink} to="/document/terms-of-service">Terms of Services </Link>
                                    and <Link component={ActionLink} to="/document/privacy-policy">Privacy Policy</Link>
                                </Typography>
                            }
                            sx={{ marginTop: 3 }}
                        />
                        <Button disabled={!formValid()} variant="contained" fullWidth
                            onClick={(e) => handleSignup(e)}
                            sx={{ marginTop: 3 }}
                            data-test="submit"
                        >
                            {submitting ? <CircularProgress size={24} /> : 'Create account'}
                        </Button>

                        <Box justifyContent="center" display="flex" padding="1.5rem">
                            Already have an account?&nbsp;
                            <Link href="" rel="noopener" onClick={() => loginWithRedirect()}>
                                Sign in
                            </Link>
                        </Box>
                    </>
                }
                {signedUp &&
                    <>
                        <Box sx={{ pb: "1rem", padding: "2rem" }} data-test="post-account-creation">
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <CheckCircleIcon sx={{ color: 'success.main', fontSize: '100px' }} />
                            </Box>
                            <Typography align="center" variant="h3">
                                Account created
                            </Typography>

                            <Typography variant="h5" align="center">
                                Your account has been created successfully. We’ve sent you an email to verify your account.
                            </Typography>
                        </Box>
                        <Box paddingTop="2rem" display="flex" justifyContent="center">
                            <Button variant="contained" href="" rel="noopener" onClick={() => loginWithRedirect()}>
                                Log into Avid AML
                            </Button>
                        </Box>
                    </>
                }
            </Box>
        </Box>
    );
}

export default Signup;