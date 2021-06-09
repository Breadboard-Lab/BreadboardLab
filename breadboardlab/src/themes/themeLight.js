import {responsiveFontSizes} from "@material-ui/core/styles";
import createTheme from "./createTheme"

/*

Light Theme

 */

let themeLight = createTheme({
    palette: {
        type: 'light',
        text: {
            primary: '#fff',
            secondary: '#fff'
        },
        background: {
            default: '#ffffff',
            paper: '#6790cb'
        },
        primary: {
            main: '#6790cb',
        },
        secondary: {
            main: '#5677ce',
        },
        action: {
            active: '#fff',
            selected: '#6380cd'
        }
    },
})

themeLight = responsiveFontSizes(themeLight)

export default themeLight;