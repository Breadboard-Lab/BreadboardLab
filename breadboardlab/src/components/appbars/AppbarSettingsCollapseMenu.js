import React from "react";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from '@material-ui/icons/Settings';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ShareIcon from '@material-ui/icons/Share';
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import {saveSvgAsPng, saveSvg} from '../../utils/saveSvg';


const AppbarSettingsCollapseMenu = (props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (exportFormat) => {
        console.log(`exportToFile(${exportFormat})`);
        if (exportFormat === 'Export as SVG') {
            saveSvg(document.getElementById('AppSVG'), 'breadboard_lab_export.svg');
        } else {
            saveSvgAsPng(document.getElementById('AppSVG'), 'breadboard_lab_export.png');
        }
    }

    return (
        <div>
            <IconButton onClick={handleClick}>
                <SettingsIcon/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                getContentAnchorEl={null}
                onClose={handleClose}
            >
                <MenuItem disabled>
                    <ListItemIcon>
                        <ShareIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Share"/>
                </MenuItem>
                <MenuItem onClick={() => handleExport("Export as SVG")}>
                    <ListItemIcon>
                        <SaveAltIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Export as SVG"/>
                </MenuItem>
                <MenuItem onClick={() => handleExport("Export as PNG")}>
                    <ListItemIcon>
                        <SaveAltIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Export as PNG"/>
                </MenuItem>
                <MenuItem
                    onClick={props.handleThemeChange}>
                    <ListItemIcon>
                        <InvertColorsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Change Theme"/>
                </MenuItem>
            </Menu>
        </div>
    );
}
export default AppbarSettingsCollapseMenu;