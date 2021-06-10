import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import {IconButton} from "@material-ui/core";

export default function SplitButton() {

    return (
        <ButtonGroup variant="contained" color="primary" aria-label="split button">
            <IconButton
                color="inherit"
                aria-label="draw wire"
            >
                <LinearScaleIcon/>
            </IconButton>
            <Button
                color="primary"
                size="small"
                aria-label="select merge strategy"
                aria-haspopup="menu"
            >
                <ArrowDropDownIcon/>
            </Button>
        </ButtonGroup>
    );
}
