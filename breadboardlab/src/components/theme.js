import {createMuiTheme} from "@material-ui/core/styles";

/*
Custom overall app theme.
 */

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        text: {
            primary: '#fff'
        },
        background: {
            default: '#8f96a0',
            paper: '#0C0E0F'
        },
        primary: {
            main: '#0C0E0F',
        },
        secondary: {
            main: '#0A0C0D',
        },
        action: {
            selected: '#242627'
        }
    },
})

export default theme;