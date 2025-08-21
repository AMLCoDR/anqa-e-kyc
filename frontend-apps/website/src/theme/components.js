
// import { Roboto, RobotoReg, Robot0Bold, RobotoItalics, RobotoBoldItalics } from './typography';

export const components = {
    styleOverrides: {
        MuiCssBaseline: {
            '@global': {
                // '@font-face': [Roboto, RobotoReg, Robot0Bold, RobotoItalics, RobotoBoldItalics],
            }
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: "#ffffff",
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundColor: "#ffffff",
            },
            elevation1: {
                boxShadow: `0px 3px 20px ${'rgba(106, 137, 193, 0.2)'}`
            },
            elevation2: {
                boxShadow: `0px 30px 200px ${'rgba(106, 137, 193, 0.2)'}`
            },
        }
    },

    MuiButton: {
        styleOverrides: {
            root: {
                fontSize: '1.125rem',
                lineHeight: '1.3125rem',
                borderRadius: 0
            },
            contained: {
                boxShadow: 'none',
                borderRadius: '0.3rem',
                lineHeight: '2.25rem',
                fontSize: '1.125rem',
                paddingLeft: '2.25rem',
                paddingRight: '2.25rem',
            },
        }
    },

    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: '0.25rem',
                background: "#ffffff",
                color: '#606D7C',
            }
        }
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                color: '#606D7C',
                fontSize: '0.95rem',
                margin: 'dense'
            }
        }
    },

}
