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
    }
})

export default theme;