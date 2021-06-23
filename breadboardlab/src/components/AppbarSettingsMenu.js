import React from "react";
import {
    Button,
    Grid,
    Tooltip,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ExportMenu from "./exportMenu";
import InvertColorsIcon from "@material-ui/icons/InvertColors";

const AppbarSettingsMenu = (props) => {
    return (
        <Grid>
            <Tooltip title="Share">
                <Button
                    aria-label='Share'
                    onClick={props.handleShare}
                >
                    Share
                </Button>
            </Tooltip>
            <Tooltip title="Export">
                <ExportMenu/>
            </Tooltip>
            <Tooltip title="Change Theme">
                <IconButton onClick={props.handleThemeChange}>
                    <InvertColorsIcon/>
                </IconButton>
            </Tooltip>
        </Grid>
    );
}
export default AppbarSettingsMenu;