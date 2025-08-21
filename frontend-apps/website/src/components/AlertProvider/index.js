import React, {  /* useEffect, useCallback */ } from 'react';

// import IconButton from '@material-ui/core/IconButton';
// import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
// import { useSnackbar } from 'notistack';
// import { SnackbarProvider } from 'notistack';



export const AlertProvider = (props) => {

    // // close icon
    // const snackbarRef = React.createRef();
    // const onDismiss = key => () => {
    //     snackbarRef.current.closeSnackbar(key);
    // }

    return (
        // <SnackbarProvider
        //     preventDuplicate
        //     variant="error"
        //     sx={{
        //         variantInfo: 'info.main',
        //         variantSuccess: 'success.main',
        //         variantWarning: 'warning.main',
        //         variantError: 'error.main',
        //     }}
        //     ref={snackbarRef}
        //     action={key => (
        //         <IconButton onClick={onDismiss(key)} color="inherit">
        //             <CloseOutlinedIcon />
        //         </IconButton>
        //     )}
        // >
        <>
            {props.children}
        </>
        // </SnackbarProvider>
    );
};

export const useAlerter = (alert) => {
    //     const { enqueueSnackbar } = useSnackbar();

    //     useEffect(() => {
    //         alert && showAlert(alert)
    //     });

    //     const showAlert = useCallback((alert) => {
    //         enqueueSnackbar(alert, { variant: 'error' })
    //     }, [enqueueSnackbar])

    //     const showMessage = useCallback((msg) => {
    //         enqueueSnackbar(msg, { variant: 'success' })
    //     }, [enqueueSnackbar])

    //     // variant: 'info', 'warning'

    //     return {
    //         showAlert,
    //         showMessage
    //     };
}