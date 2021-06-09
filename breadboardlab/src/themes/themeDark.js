import {responsiveFontSizes} from "@material-ui/core/styles";
import createTheme from "./createTheme"

/*

Dark Theme

 */

let themeDark = createTheme({
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

themeDark = responsiveFontSizes(themeDark)

export default themeDark;