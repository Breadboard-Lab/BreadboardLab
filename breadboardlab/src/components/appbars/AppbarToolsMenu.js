import React from "react";
import {
    Button,
    Divider,
    Grid,
    SvgIcon,
    Tooltip,
    withStyles
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {ReactComponent as SelectIcon} from "../../assets/select_icon.svg"
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import SplitButton from "./SplitButton";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";

const StyledToggleButtonGroup = withStyles({
    grouped: {
        border: 'none',
        borderRadius: '0px',
    },
})(ToggleButtonGroup);

const AppbarToolsMenu = (props) => {
    return (
        <Grid container>
            <SplitButton>
                <StyledToggleButtonGroup
                    value={props.selectedTool}
                    exclusive
                    onChange={props.handleTool}
                    aria-label="Tool Menu"
                >
                    <ToggleButton
                        aria-label="select"
                        value="select_tool"
                    >
                        <Tooltip title="Select">
                            <SvgIcon>
                                <SelectIcon/>
                            </SvgIcon>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton
                        aria-label="draw wire"
                        value="wire_tool"
                    >
                        <Tooltip title="Draw Wire">
                            <LinearScaleIcon/>
                        </Tooltip>
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </SplitButton>

            <Divider orientation="vertical" variant="middle" light flexItem/>

            <Tooltip title="Rotate">
                <IconButton
                    aria-label="rotate"
                    value="rotate_tool"
                    onClick={props.handleRotate}
                >
                    <RotateRightIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton
                    aria-label="delete"
                    onClick={props.handleDelete}
                >
                    <DeleteForeverIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Undo">
                <IconButton
                    aria-label="undo"
                    onClick={props.handleUndo}
                >
                    <UndoIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
                <IconButton
                    aria-label="redo"
                    onClick={props.handleRedo}
                >
                    <RedoIcon/>
                </IconButton>
            </Tooltip>

            <Divider orientation="vertical" variant="middle" light flexItem/>

            <Tooltip title="Start Simulation">
                <Button
                    color="inherit"
                    aria-label="start simulation"
                    startIcon={<PlayArrowIcon/>}
                    onClick={props.handleStart}
                >
                    Start
                </Button>
            </Tooltip>
        </Grid>
    );
}
export default AppbarToolsMenu;