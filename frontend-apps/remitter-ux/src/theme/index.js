import { responsiveFontSizes } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';

// import { overrides } from './overrides';
import { palette } from './palette';
//import { props } from './props';
// import { typography } from './typography';

export const theme = responsiveFontSizes(createMuiTheme({
    palette,
    // typography,
    // overrides,
    // props
}));

export default theme;