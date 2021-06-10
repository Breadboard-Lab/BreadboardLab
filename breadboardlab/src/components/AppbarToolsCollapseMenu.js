import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ListItemIcon, ListItemText, Menu, MenuItem} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import LinearScaleIcon from '@material-ui/icons/LinearScale';

const useStyles = makeStyles((theme) => ({
    buttonCollapse: {
        [theme.breakpoints.up("sm")]: {
            display: "none"
        },
    }
}));

const AppbarToolsCollapseMenu = props => {
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
                    <BusinessCenterIcon />
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
                            <SelectAllIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Select" />
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <RotateRightIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Rotate" />
                    </MenuItem>

                    <MenuItem>
                        <ListItemIcon>
                            <DeleteForeverIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                    </MenuItem>

                    <MenuItem>
                        <ListItemIcon>
                            <UndoIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Undo" />
                    </MenuItem>

                    <MenuItem>
                        <ListItemIcon>
                            <RedoIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Redo" />
                    </MenuItem>

                    <MenuItem>
                        <ListItemIcon>
                            <LinearScaleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Draw Wire" />
                    </MenuItem>

                    <MenuItem>
                        <ListItemIcon>
                            <PlayArrowIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Start Simulation" />
                    </MenuItem>
                </Menu>
            </div>
        );
}
export default AppbarToolsCollapseMenu;