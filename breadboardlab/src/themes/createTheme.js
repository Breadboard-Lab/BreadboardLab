import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

/*

Simple custom theme wrapper to reset theme on theme change.

 */

export default function createTheme(options) {
    return createMuiTheme({
        ...options
    });
}