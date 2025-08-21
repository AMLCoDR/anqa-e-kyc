import React, { useEffect, useState, createRef } from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Stack from '@material-ui/core/Stack';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import jwt from 'jsonwebtoken';

import { useView } from '../Controller';

export const LinkCreated = () => {
    const [uri, setUri] = useState({});
    const [copied, setCopied] = useState(false);
    const { exit } = useView();
    const linkRef = createRef();

    useEffect(() => {
        let host = `${window.location.protocol}//${window.location.hostname}`;
        host += window.location.port === 443 ? '' : `:${window.location.port}`
        // See: https://auth0.com/learn/token-based-authentication-made-easy/
        const token = jwt.sign({ customer: "ado" }, 'supersecret', { expiresIn: 120 });

        setUri({ host: host, path: `/customer/onboarder/self?jwt=${token}` });
    }, []);

    const handleCopy = () => {
        linkRef.current.select();
        document.execCommand('copy');
        setCopied(true);
    }

    return (
        <>
            <Stack spacing={1} direction="row" justifyContent="space-between">
                <Typography variant="h2" gutterBottom>Link Created</Typography>
                <CheckCircleIcon color="success" sx={{ fontSize: 50 }} />
            </Stack>
            <Typography gutterBottom>
                Share the generated link with your customer so they can start the onboarding process.
            </Typography>

            <Stack spacing={1} direction="row" sx={{ py: 3 }} >
                <FormControl fullWidth  >
                    <TextField id="link" label="Link" variant="outlined" size="small"
                        value={`${uri.host}${uri.path}`}
                        inputRef={linkRef}
                        InputProps={{
                            readOnly: true,
                            sx: { backgroundColor: 'action.hover' }
                        }}
                    />
                </FormControl>
                <Button variant="outlined"
                    endIcon={copied ? <CheckCircleIcon /> : null}
                    onClick={handleCopy}
                >
                    {copied ? 'Copied' : 'Copy'}
                </Button>
            </Stack>

            <Stack spacing={1} direction="row" justifyContent="flex-end" sx={{ mb: 5 }}>
                <Button onClick={() => exit()} variant="contained">Done</Button>
            </Stack>

            <Typography variant="caption" color="text.secondary">
                Copy and paste the above link to proceed with self-onboarding as the customer 
            </Typography>
        </>
    );
}

export default LinkCreated;