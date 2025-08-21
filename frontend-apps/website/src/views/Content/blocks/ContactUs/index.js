import React, { useState, useReducer } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import config from '../../../../config';
import { BlockPropTypes } from '../shared';

const emailRegex = /\S+@\S+/

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
        case 'enquiry':
            return { ...state, enquiry: action.value };
        default:
    }
}
const init = { email: "", fullName: "", enquiry: "", errors: {} };

export const ContactUs = ({ content }) => {
    //const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, init);
    const [submitting, setSubmitting] = useState();
    const [submitted, setSubmitted] = useState();

    const formValid = () => {
        if (!state.email) {
            return false;
        }

        for (var err in state.errors) {
            if (state.errors[err]) {
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append("u", "6");
        formData.append("f", "6");
        formData.append("s", "");
        formData.append("c", "0");
        formData.append("m", "0");
        formData.append("act", "sub");
        formData.append("v", "2");
        formData.append("email", state.email);
        formData.append("fullname", state.fullName);
        formData.append("field[8]", state.enquiry);

        var xhr = new XMLHttpRequest();

        xhr.open("POST", config.activeCampaign.formSubmit);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    setSubmitted(true);
                } else {
                    console.error(xhr.responseText);
                }
            }
        };
        xhr.send(formData);

        setSubmitting(false);
    }

    return (
        <Box id="contact" sx={{ bgcolor: 'overlay.contrast', margin: '0 calc(50% - 50vw)', py: 4, justifyContent: "center", alignItems: "center", display: 'flex' }} data-test="contact-us">
            <Box sx={{ width: { xs: '90%', md: '40rem' } }} >
                {!submitted &&
                    <>
                        <Grid container direction="column" justifyContent="center" alignItems="center">
                            <Typography color="primary" variant="h2">
                                {content.fields.heading}
                            </Typography>
                            <Typography color="textSecondary" variant="h5">
                                {content.fields.subHeading}
                            </Typography>
                        </Grid>
                        <TextField
                            fullWidth required={true} label={content.fields.emailField} variant="outlined" name="email"
                            value={state.email}
                            onChange={e => dispatch({ type: 'email', value: e.target.value })}
                            helperText={state.errors.email}
                            error={state.errors.email && state.errors.email !== ""}
                            sx={{ marginTop: 3 }}

                        />
                        <TextField fullWidth label={content.fields.nameField} type="text" variant="outlined" name="fullname"
                            value={state.fullName}
                            onChange={e => dispatch({ type: 'fullName', value: e.target.value })}
                            sx={{ marginTop: 3 }}

                        />
                        <div data-test="enquiry">
                            <TextField fullWidth label={content.fields.enquiryField} type="text" variant="outlined"
                                multiline={true} rows={6}
                                value={state.enquiry}
                                onChange={e => dispatch({ type: 'enquiry', value: e.target.value })}
                                sx={{ marginTop: 3 }}
                            />
                        </div>

                        <Grid container direction="column" alignItems="flex-end">
                            <Button disabled={!formValid()} variant="contained"
                                onClick={(e) => handleSubmit(e)}
                                sx={{ marginTop: 3 }}
                                data-test="contact"
                            >
                                {submitting ? <CircularProgress size={24} /> : content.fields.submitButtonText}
                            </Button>
                        </Grid>
                    </>

                }
                {submitted &&
                    <Grid container direction="column" justifyContent="center" alignItems="center" >
                        <Typography variant="h3">
                            {content.fields.successMessageHeader}
                        </Typography>
                        <Typography variant="h5">
                            {content.fields.successMessageText}
                        </Typography>
                        <Box sx={{ pt: '1rem', width: '50%' }}>
                            <Button fullWidth variant="contained" data-test="return" href={'/#'}>Return</Button>
                        </Box>
                    </Grid>
                }
            </Box>
        </Box>
    )
}


ContactUs.propTypes = BlockPropTypes;
ContactUs.defaultProps = {};