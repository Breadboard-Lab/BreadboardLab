import React from "react";
import {ListItemIcon, ListItemText, Menu, MenuItem, SvgIcon} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {ReactComponent as SelectIcon} from "../../assets/select_icon.svg"
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import LinearScaleIcon from '@material-ui/icons/LinearScale';

const AppbarToolsCollapseMenu = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
            <div>
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
                            <SvgIcon>
                                <SelectIcon/>
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText primary="Select" />
                    </MenuItem>

                    <MenuItem>
                        <ListItemIcon>
                            <LinearScaleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Draw Wire" />
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
                            <PlayArrowIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Start Simulation" />
                    </MenuItem>
                </Menu>
            </div>
        );
}
export default AppbarToolsCollapseMenu;