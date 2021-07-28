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

const AppbarToolsCollapseMenu = (props) => {

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
                    <MenuItem onClick={(event) => props.handleTool(event, "select_tool")}>
                        <ListItemIcon>
                            <SvgIcon>
                                <SelectIcon/>
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText primary="Select" />
                    </MenuItem>

                    <MenuItem onClick={(event) => props.handleTool(event, "wire_tool")}>
                        <ListItemIcon>
                            <LinearScaleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Draw Wire" />
                    </MenuItem>

                    <MenuItem onClick={props.handleRotate}>
                        <ListItemIcon>
                            <RotateRightIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Rotate" />
                    </MenuItem>

                    <MenuItem onClick={props.handleDelete}>
                        <ListItemIcon>
                            <DeleteForeverIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                    </MenuItem>

                    <MenuItem onClick={props.handleUndo}>
                        <ListItemIcon>
                            <UndoIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Undo" />
                    </MenuItem>

                    <MenuItem onClick={props.handleRedo}>
                        <ListItemIcon>
                            <RedoIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Redo" />
                    </MenuItem>

                    <MenuItem onClick={props.handleSimulation}>
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