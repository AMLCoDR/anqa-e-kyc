import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Box } from '@material-ui/core';
import { 
    CheckCircle as SuccessIcon, 
    Error as ErrorIcon, 
    Info as InfoIcon, 
    Warning as WarningIcon 
} from '@material-ui/icons';

export const ToastNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentNotification, setCurrentNotification] = useState(null);

    useEffect(() => {
        if (notifications.length > 0 && !open) {
            setCurrentNotification(notifications[0]);
            setOpen(true);
        }
    }, [notifications, open]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setNotifications(prev => prev.slice(1));
        setCurrentNotification(null);
        setOpen(false);
    };

    const showNotification = (message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const notification = {
            id,
            message,
            type,
            duration
        };
        
        setNotifications(prev => [...prev, notification]);
        
        // Auto-remove after duration
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'success':
                return <SuccessIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'info':
            default:
                return <InfoIcon />;
        }
    };

    const getAlertSeverity = (type) => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'info';
        }
    };

    // Expose the show function globally for easy access
    useEffect(() => {
        window.showToast = showNotification;
        return () => {
            delete window.showToast;
        };
    }, []);

    if (!currentNotification) {
        return null;
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={currentNotification.duration}
            onClose={handleClose}
            onExited={handleExited}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ 
                zIndex: 9999,
                '& .MuiAlert-root': {
                    minWidth: 300,
                    maxWidth: 400
                }
            }}
        >
            <Alert
                onClose={handleClose}
                severity={getAlertSeverity(currentNotification.type)}
                icon={getAlertIcon(currentNotification.type)}
                variant="filled"
                sx={{ 
                    width: '100%',
                    '& .MuiAlert-message': {
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }
                }}
            >
                <Box display="flex" alignItems="center">
                    {currentNotification.message}
                </Box>
            </Alert>
        </Snackbar>
    );
};

// Helper functions for easy notification calls
export const showSuccessToast = (message, duration) => {
    if (window.showToast) {
        window.showToast(message, 'success', duration);
    }
};

export const showErrorToast = (message, duration) => {
    if (window.showToast) {
        window.showToast(message, 'error', duration);
    }
};

export const showInfoToast = (message, duration) => {
    if (window.showToast) {
        window.showToast(message, 'info', duration);
    }
};

export const showWarningToast = (message, duration) => {
    if (window.showToast) {
        window.showToast(message, 'warning', duration);
    }
};

export default ToastNotifications;
