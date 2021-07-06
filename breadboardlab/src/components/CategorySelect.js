import React from "react";
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    formControl: {
        flexGrow: 1,
        marginLeft: theme.spacing(1)
    },
}));

const CategorySelect = (props) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <Select
                labelId="category-select"
                id="category-select"
                value={props.category}
                onChange={props.handleCategorySelect}
                MenuProps={{
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center"
                    },
                    getContentAnchorEl: null
                }}
            >
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"basics"}>Basics</MenuItem>
                <MenuItem value={"gates"}>Gates</MenuItem>
            </Select>
        </FormControl>
    );
};

export default CategorySelect;