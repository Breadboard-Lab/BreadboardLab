import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from '@material-ui/icons/Settings';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ShareIcon from '@material-ui/icons/Share';
import InvertColorsIcon from "@material-ui/icons/InvertColors";

const useStyles = makeStyles((theme) => ({
    buttonCollapse: {
        [theme.breakpoints.up("sm")]: {
            display: "none"
        },
    }
}));

const AppbarSettingsCollapseMenu = props => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.buttonCollapse}>
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
                <MenuItem>
                    <ListItemIcon>
                        <ShareIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Share"/>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <SaveAltIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Export"/>
                </MenuItem>
                <MenuItem>
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