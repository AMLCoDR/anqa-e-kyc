import React, { useState, useEffect } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { styled } from '@material-ui/system';
import { useResource } from 'components/Resource';
import { format, formatDistanceToNow, fromUnixTime } from "date-fns";
import * as PropTypes from 'prop-types';

// import { CheckedIcon } from '../../icons/CheckedIcon'
import { EddIcon } from '../../icons/EddIcon';
import { LicenceIcon } from '../../icons/LicenceIcon';
import { NationalIdIcon } from '../../icons/NationalIdIcon';
import { PassportIcon } from '../../icons/PassportIcon';
// import { WarningIcon } from '../../icons/WarningIcon';
import AddressForm from './Address/AddressForm';
import AddressReport from './Address/AddressReport';
import { useVerification } from './context';
import LicenceForm from './Licence/LicenceForm';
import LicenceReport from './Licence/LicenceReport';
import NationalIdForm from './NationalId/NationalIdForm';
import NationalIdReport from './NationalId/NationalIdReport';
import PassportForm from './Passport/PassportForm';
import PassportReport from './Passport/PassportReport';
import { IdType, Status } from '../../proto/idcheck/v2/id_check_pb.js';
import EddReport from './Watchlist/EddReport';

const propsMap = {};
propsMap[IdType.ID_TYPE_PASSPORT] = { title: 'Passport', icon: <PassportIcon />, form: PassportForm, report: PassportReport };
propsMap[IdType.ID_TYPE_LICENCE] = { title: 'Drivers Licence', icon: <LicenceIcon />, form: LicenceForm, report: LicenceReport };
propsMap[IdType.ID_TYPE_ADDRESS] = { title: 'Address', icon: <HomeOutlinedIcon />, form: AddressForm, report: AddressReport };
propsMap[IdType.ID_TYPE_NATIONALID] = { title: 'National ID', icon: <NationalIdIcon />, form: NationalIdForm, report: NationalIdReport };
propsMap[IdType.ID_TYPE_WATCHLIST] = { title: 'Due Diligence', icon: <EddIcon />, form: null, report: EddReport };

export const Renderer = ({ checkType, entity }) => {
    const [openReport, setOpenReport] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [params, setParams] = useState();
    const [idCheck, setIdCheck] = useState();
    const [status, setStatus] = useState({});
    const { state: { labels } } = useResource();
    const { state, fetch, verify } = useVerification();
    const [checkProps, setCheckProps] = useState(propsMap[checkType]);
    const { form, icon, report, title } = checkProps

    useEffect(() => {
        if (!state.idChecks.hasOwnProperty(IdType.ID_TYPE_WATCHLIST)) {
            fetch(entity.getId());
        }
    }, [entity, fetch, state.idChecks]);

    useEffect(() => {
        const check = state.idChecks[checkType];
        if (check) {
            setIdCheck(check.toObject());
            setCheckProps(propsMap[checkType]);
            setStatus(statusProps(check.getVerified(), check.getStatus(), title));
        }
    }, [checkType, state.idChecks, state.error, title]);

    // verify action
    const handleVerify = async () => {
        setOpenForm(false);
        verify(checkType, entity.getId(), params);
    };

    // verification form handlers
    const handleOpenForm = event => {
        event.preventDefault();
        event.stopPropagation();
        form ? setOpenForm(true) : handleVerify();
    };
    const handleCloseForm = () => {
        setOpenForm(false);
    };
    const handleValidForm = (p) => {
        setParams(p)
    }

    // verification report handlers
    const showReport = (idCheck) => {
        return idCheck.detail && ![Status.STATUS_NO_DATA, Status.STATUS_ERROR, Status.STATUS_UNCHECKED].includes(idCheck.status)
    }
    const handleOpenReport = event => {
        event.preventDefault();
        if (idCheck.status !== Status.STATUS_UNCHECKED) {
            setOpenReport(true)
        }
    };
    const handleCloseReport = () => {
        setOpenReport(false);
    };

    const CustomBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between"
    });

    return (
        <React.Fragment>
            {idCheck &&
                <CustomBox
                    sx={idCheck.status !== Status.STATUS_UNCHECKED ? {
                        borderRadius: '0.25rem', padding: 1, border: 1, my: 1, borderColor: 'text.hint', cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' }
                    }
                        :
                        { borderRadius: '0.25rem', my: 1, padding: 1, border: 1, borderColor: 'text.hint' }}
                    onClick={handleOpenReport}
                    data-test="verification-card">
                    <Box sx={{ display: "flex", alignItems: 'center' }}>
                        {icon}
                        <Box sx={{ display: "flex", flexDirection: 'column', pl: "5px" }}>
                            <Typography variant="h6" sx={{ alignSelf: 'flex-start', margin: '0.25rem' }} data-test="title">{title}</Typography>
                            <Typography variant="caption">
                                <Box data-test="status" sx={{ color: status.color, display: 'flex', alignItems: 'center', pl: 1 }}>
                                    {idCheck.verified
                                        ? <CheckCircleIcon sx={{ height: '1rem', width: '1rem' }} />
                                        : <ErrorIcon sx={{ height: '1rem', width: '1rem' }} />}
                                    &nbsp;
                                    {status.label}
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Button disabled={state.pending[idCheck.idType]} onClick={handleOpenForm}
                            variant={state.pending[idCheck.idType] ? 'outlined' : 'contained'}
                            sx={{ marginBottom: 1 }} data-test="check"
                        >
                            {state.pending[idCheck.idType]
                                ? <CircularProgress size={24} data-test="check-pending" />
                                : <Typography noWrap data-test="check-label" variant="inherit">
                                    {idCheck.idType === IdType.ID_TYPE_WATCHLIST ? 'Check' : 'Verify'}
                                    {idCheck.id ? ' again' : ''}
                                </Typography>}
                        </Button>
                        {idCheck.updatedAt && (
                            <Typography variant="caption" data-test="last-check">
                                {idCheck.idType === IdType.ID_TYPE_WATCHLIST
                                    ? 'Last checked '
                                    : idCheck.verified ? 'Last verified ' : 'Last checked '}
                                {`${formatDistanceToNow(fromUnixTime(idCheck.updatedAt.seconds))} ago`}
                            </Typography>
                        )}
                    </Box>
                </CustomBox>
            }
            {/* Report dialog */}
            {idCheck &&
                <Dialog open={openReport} onClose={handleCloseReport} aria-labelledby="report-dialog-title" maxWidth='md' data-test="verification-report">
                    <DialogTitle id="report-dialog-title" data-test="report-title">
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1}
                        >
                            {title} Verification Results
                            <IconButton aria-label="close" onClick={handleCloseReport}
                                size="small" edge="end">
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </DialogTitle>
                    <DialogContent display="flex" sx={{ minWidth: { md: 80, lg: 80, xl: 80 } }}>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: '0.5rem' }} >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1">Status:</Typography>
                                <Box sx={{ pl: 1, pr: 4, color: status.color, alignItems: 'center', display: 'flex' }}>
                                    {idCheck.verified
                                        ? <CheckCircleIcon sx={{ height: '1rem', width: '1rem' }} />
                                        : <ErrorIcon sx={{ height: '1rem', width: '1rem' }} />}
                                    &nbsp;
                                    <Typography variant="body2" data-test="report-status">
                                        {status.label}
                                    </Typography>
                                </Box>
                            </Box>
                            {idCheck.updatedAt
                                ? (
                                    <Typography variant="body2">
                                        Last checked on {format(fromUnixTime(idCheck.updatedAt.seconds), 'do MMMM, yyyy')}
                                    </Typography>
                                ) : null}
                        </Grid>
                        {showReport(idCheck) && report &&
                            <React.Fragment>
                                <Divider />
                                {React.createElement(report, { entity, idCheck })}
                            </React.Fragment>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseReport} data-test="report-close">
                            {labels.buttons.close}
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            {/* Verification form */}
            <Dialog open={openForm} onClose={handleCloseForm} aria-labelledby="form-dialog-title" data-test="verification-form">
                <DialogTitle id="form-dialog-title">
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                    >
                        {labels.buttons.verify} {title}
                        <IconButton aria-label="close" onClick={handleCloseForm} data-test="form-close"
                            size="small" >
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ minWidth: { md: 60, lg: 60, xl: 60 } }}>
                    {form && React.createElement(form, { entity, onValid: handleValidForm })}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleVerify} disabled={!params} data-test="form-validate">
                        {labels.buttons.verify}
                    </Button>
                    <Button onClick={handleCloseForm} data-test="form-cancel">
                        {labels.buttons.cancel}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

const statusProps = (verified, status, title) => {

    if (status === Status.STATUS_UNCHECKED) {
        return {
            color: 'text.secondary',
            label: 'Not yet ' + (title === 'Due Diligence' ? 'checked' : 'verified')
        };
    }

    if (verified) {
        return {
            color: 'success.main',
            label: title === 'Due Diligence' ? 'Checked' : 'Verified'
        };
    }

    return {
        color: 'error.main',
        label: 'No match',
    };

    // switch (status) {
    //     case Status.STATUS_FULL_MATCH:
    //         return {
    //             color: 'success.main',
    //             label: title === 'Due Diligence' ? 'Checked' : 'Full match'
    //         }
    //     case Status.STATUS_PART_MATCH:
    //         return {
    //             color: 'warning.main',
    //             label: 'Partial match',
    //         }
    //     case Status.STATUS_NO_MATCH:
    //         return {
    //             color: 'error.main',
    //             label: 'No match',
    //         };
    //     case Status.STATUS_ERROR:
    //         return {
    //             color: 'error.main',
    //             label: 'Error',
    //         };
    //     case Status.STATUS_NO_DATA:
    //         return {
    //             color: 'error.main',
    //             label: 'No data',
    //         };
    //     default:
    //         return {
    //             color: 'text.secondary',
    //             label: 'Not yet ' + (title === 'Due Diligence' ? 'checked' : 'verified')
    //         };
    // }
};

Renderer.propTypes = {
    checkType: PropTypes.string.isRequired,
    entity: PropTypes.object,
};

export default Renderer;
