import React from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import {
    ClickAwayListener,
    Grow,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper, Tooltip, withStyles
} from "@material-ui/core";
import {grey, red, green, blue, yellow} from "@material-ui/core/colors";

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.action.selected
        },
    },
}))(MenuItem)

const SplitButton = props => {
    const menuOptions = [['Black', grey[800]], ['Red', red[500]], ['Green', green[400]], ['Blue', blue[700]], ['Yellow', yellow[500]]];

    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [toolOpen, setToolOpen] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setToolOpen(!toolOpen)

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <ButtonGroup
                disableElevation
                color="primary"
                aria-label="split button"
            >
                {props.children}
                <IconButton
                    color="inherit"
                    size="small"
                    aria-label="select wire colour"
                    aria-haspopup="menu"
                    onClick={handleClick}
                    disabled={props.isSimulating}
                >
                    <Tooltip
                        title="Select wire colour"
                        onPointerEnter={() => {
                            setToolOpen(true)
                        }}
                        onPointerLeave={() => {
                            setToolOpen(false)
                        }}
                        open={toolOpen}
                    >
                        <ArrowDropDownIcon/>
                    </Tooltip>
                </IconButton>
            </ButtonGroup>
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} transition disablePortal>
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper color="inherit">
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu">
                                    {menuOptions.map((option, index) => (
                                        <StyledMenuItem
                                            key={option}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                            <ListItemIcon>
                                                <LinearScaleIcon style={{color: option[1]}}/>
                                            </ListItemIcon>
                                            <ListItemText primary={option[0]}/>
                                        </StyledMenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}

export default SplitButton;