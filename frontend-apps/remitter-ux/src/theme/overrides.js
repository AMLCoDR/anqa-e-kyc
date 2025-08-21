
import palette from "./palette";

export const overrides = {
    MuiCssBaseline: {
        '@global': {
            '._elevio_launcher': {
                '& > * button': {
                    backgroundColor: `${palette.secondary.main}!important`,
                },
            },
            '._elevio_pulse': {
                '& > button': {
                    backgroundColor: `${palette.error.main}!important`,
                },
                '& > div': {
                    borderColor: `${palette.primary.main}!important`,
                }
            },
            '._elevio_qmark': {
                '& > button': {
                    backgroundColor: `${palette.info.main}!important`,
                    '& > svg': {
                        height: '9px!important',
                        width: '9px!important',
                    }
                },
            },
        }
    },
    MuiAutocomplete: {
        paper: {
            boxShadow: '0px 2px 20px rgba(235, 239, 244, 0.8)',
        },
    },
    MuiBreadcrumbs: {
        root: {
            paddingTop: '8px',
            fontSize: '0.875rem',
        },
    },
    MuiButton: {
        root: {
            borderRadius: '0.25rem',
            textTransform: 'none',
        },
        contained: {
            boxShadow: 'none',
            '&:hover': {
                boxShadow: 'none',
            },
        },
        textSizeSmall: {
            fontSize: '0.8rem',
        },
    },
    MuiCard: {
        root: {
            width: '100%'
        }
    },
    MuiCardActions: {
        root: {
            justifyContent: 'space-between'
        }
    },
    MuiCardHeader: {
        title: {
            fontWeight: 800,
            fontSize: '1.125rem',
            lineHeight: 1.125,
            letterSpacing: '0.025em',
            color: '#0C1451',
        },
        subheader: {
            paddingTop: '0.75rem',
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.5,
        }
    },
    MuiChip: {
        root: {
            fontSize: '0.625rem',
            borderRadius: '0.25rem',
        },
    },
    MuiFormLabel: {
        root: {
            fontSize: '0.875rem',
        },
    },
    MuiLink: {
        root: {
            color: '#2F76DF',
        },
    },
    MuiListItemText: {
        primary: {
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#0C1451',
            lineHeight: 1.43,
        },
    },
    MuiOutlinedInput: {
        root: {
            color: '#606D7C',
            height: '2.35rem',
        },
        multiline: {
            height: '6rem'
        }

    },
    MuiPaper: {
        rounded: {
            borderRadius: '0.25rem',
        },
        elevation1: {
            boxShadow: '2px 2px 2px rgba(126, 143, 158, 0.1)',
        },
        elevation9: {
            boxShadow: '0px 2px 20px rgba(235, 239, 244, 0.8)',
        },
    },
    MuiStepConnector: {
        line: {
            borderStyle: 'none',
        },
        lineVertical: {
            borderLeftStyle: 'none',
        },
    },
    MuiStepLabel: {
        label: {
            fontWeight: 600,
            fontSize: '0.875rem',
        },
        active: {
            fontWeight: 600,
            color: '#0C1451',
        },
        completed: {
            fontWeight: 600,
            // color: '#0C1451',
        },
    },
    MuiTypography: {
        gutterBottom: {
            marginBottom: '1em',
        },
    },

}

export default overrides;