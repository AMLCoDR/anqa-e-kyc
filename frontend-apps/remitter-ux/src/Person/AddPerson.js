import * as React from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Stack from '@material-ui/core/Stack';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { useView } from '../Controller';

export const NewPerson = () => {
    const { exit, start } = useView();

    return (
        <>
            <Typography variant="h2">Onboard Person</Typography>
            <Typography variant="subtitle1">
                Select one of the options below to onboard a key person
            </Typography>

            <TableContainer component={Paper} sx={{ my: 2 }}>
                <Table aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell scope="row">
                                <Typography component="p">
                                    Self-onboarding
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Send the person a self-onboarding link
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Button onClick={() => start("/inviteperson")}>Send link</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell scope="row">
                                <Typography component="p">
                                    Scan an ID
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Scan the person's ID to verify and extract details
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Button onClick={() => start("/person/onboarder/scan")}>Scan ID</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell scope="row">
                                <Typography component="p">
                                    Enter details
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Enter the person's details manually
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Button onClick={() => start("/person/onboarder/add")}>Add manually</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button onClick={() => exit()} variant="contained">Done</Button>
            </Stack>
        </>
    );
}

export default NewPerson;