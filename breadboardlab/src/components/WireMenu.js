import React from 'react';
import {Menu as MUIMenu, Tooltip, withStyles} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PaletteIcon from "@material-ui/icons/Palette";
import {IconButton} from "@material-ui/core";
import LinearScaleIcon from "@material-ui/icons/LinearScale";
import {blue, green, grey, red, yellow} from "@material-ui/core/colors";

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.action.selected
        },
    },
}))(MenuItem);

const WireMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        /* TODO Fix tooltip displaying when select menu is focused */
        <Tooltip title="Select Wire Colour">
            <div>
                <IconButton
                    aria-label="select wire colour"
                    aria-controls="wire-color-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <PaletteIcon/>
                </IconButton>
                <MUIMenu
                    id="wire-color-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    getContentAnchorEl={null}
                >
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LinearScaleIcon style={{color: grey[800]}}/>
                        </ListItemIcon>
                        <ListItemText primary="Black"/>
                    </StyledMenuItem>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LinearScaleIcon style={{color: red[500]}}/>
                        </ListItemIcon>
                        <ListItemText primary="Red"/>
                    </StyledMenuItem>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LinearScaleIcon style={{color: green[500]}}/>
                        </ListItemIcon>
                        <ListItemText primary="Green"/>
                    </StyledMenuItem>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LinearScaleIcon style={{color: blue[500]}}/>
                        </ListItemIcon>
                        <ListItemText primary="Blue"/>
                    </StyledMenuItem>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <LinearScaleIcon style={{color: yellow[500]}}/>
                        </ListItemIcon>
                        <ListItemText primary="Yellow"/>
                    </StyledMenuItem>
                </MUIMenu>
            </div>
        </Tooltip>
    );
}

export default WireMenu;