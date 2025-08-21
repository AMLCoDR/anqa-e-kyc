import React, { useState, useReducer } from 'react';

import { useAuth0 } from "@auth0/auth0-react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Link from '@material-ui/core/Link';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ReactMarkdown from 'react-markdown';

// import ActionLink from '../../../../components/ActionLink';
import config from '../../../../config';
import { BlockPropTypes } from '../shared';
import { Markdown } from '../shared';



const emailRegex = /\S+@\S+/;

const reducer = (state, action) => {
    let error

    switch (action.type) {
        case 'email':
            if (!emailRegex.test(action.value.toLowerCase())) {
                error = "Please enter a valid email address";
            };
            return { ...state, email: action.value, errors: { ...state.errors, email: error } };
        case 'fullName':
            return { ...state, fullName: action.value };
        case 'agree':
            return { ...state, agree: action.value };
        default:
    }
}
const init = { email: "", fullName: "", agree: false, errors: {} };

export const SignUp = ({ content }) => {
    //const classes = useStyles();
    const [submitting, setSubmitting] = useState(false);
    const [signedUp, setSignedUp] = useState(false);
    const [state, dispatch] = useReducer(reducer, init);
    const { loginWithRedirect } = useAuth0();

    const isFormValid = () => {
        if (!state.email || !state.fullName || !state.agree) {
            return false;
        }

        for (var err in state.errors) {
            if (state.errors[err]) {
                return false;
            }
        }

        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append("u", "8");
        formData.append("f", "8");
        formData.append("s", "");
        formData.append("c", "0");
        formData.append("m", "0");
        formData.append("act", "sub");
        formData.append("v", "2");
        formData.append("email", state.email);
        formData.append("fullname", state.fullName);

        var xhr = new XMLHttpRequest();

        xhr.open("POST", config.activeCampaign.formSubmit);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    setSignedUp(true);
                } else {
                    console.error(xhr.responseText);
                    setSubmitting(false);
                }
            }
        };
        xhr.send(formData);
    }

    return (
        <Box sx={{ margin: '0px calc(50% - 50vw)', height: '100%', background: 'background.paper', py: '4rem' }}>
            <Container maxWidth="sm">
                {!signedUp &&
                    <>
                        <Typography color="primary" textAlign="center" variant="h2">
                            {content.fields.heading}
                        </Typography>
                        <Typography textAlign="center" color="textSecondary" variant="h5">
                            {content.fields.description}
                        </Typography>
                        <TextField fullWidth label={content.fields.fullNameField} type="text" variant="outlined" name="fullname"
                            value={state.fullName}
                            onChange={e => dispatch({ type: 'fullName', value: e.target.value })}
                            sx={{ marginTop: 3 }}
                        />
                        <TextField label={content.fields.emailField} id="email" name="email" required variant="outlined" fullWidth
                            value={state.email}
                            onChange={e => dispatch({ type: 'email', value: e.target.value })}
                            sx={{ marginTop: 3 }}
                            helperText={state.errors.email}
                            error={state.errors.email && state.errors.email !== ""}
                        />
                        <FormControlLabel
                            onChange={e => dispatch({ type: 'agree', value: e.target.checked })}
                            checked={state.agree}
                            label={
                                <ReactMarkdown renderers={Markdown.renderers}>
                                    {content.fields.privacyAgreement}
                                </ReactMarkdown>
                            }
                            control={
                                <Checkbox
                                    sx={{
                                        ml: 1, width: '2rem', height: '1.5rem'

                                    }}
                                    name="agree" color="primary" disableRipple required
                                    inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                                />}
                        />
                        <Button disabled={!isFormValid()} variant="contained" fullWidth
                            onClick={(e) => handleSignup(e)}
                            sx={{ marginTop: 3 }}
                            data-test="submit"
                        >
                            {submitting ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                        <Box justifyContent="center" display="flex" padding="1.5rem">
                            {content.fields.existingUser}&nbsp;
                            <Link href="" rel="noopener" onClick={() => loginWithRedirect()}>
                                Sign in
                            </Link>
                        </Box>
                    </>
                }
                {signedUp &&
                    <Box pb="1rem" padding="2rem" data-test="post-signup-page">
                        <Box display="flex" justifyContent="center">
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: '100px' }} />
                        </Box>
                        <Typography align="center" variant="h3">
                            {content.fields.submissionHeader}
                        </Typography>
                        <Typography variant="h5" align="center">
                            <ReactMarkdown renderers={Markdown.renderers}>
                                {content.fields.submissionText}
                            </ReactMarkdown>
                        </Typography>
                    </Box>
                }
            </Container>
        </Box>
    );
}


SignUp.propTypes = BlockPropTypes;
SignUp.defaultProps = {};