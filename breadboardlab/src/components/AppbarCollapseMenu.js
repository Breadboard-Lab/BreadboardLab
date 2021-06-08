import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Menu, MenuItem} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';


const useStyles = makeStyles((theme) => ({
    buttonCollapse: {
        [theme.breakpoints.up("sm")]: {
            display: "none"
        },
    }
}));

const AppbarCollapseMenu = props => {
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
                        Test
                    </MenuItem>
                </Menu>
            </div>
        );
}
export default AppbarCollapseMenu;