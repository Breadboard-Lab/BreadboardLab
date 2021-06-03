import React from "react";
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    formControl: {
        flexGrow: 1,
        marginLeft: theme.spacing(1)
    },
}));

const CategorySelect = () => {
    const classes = useStyles();
    const [category, setCategory] = React.useState(2);  // Defaults category to Basic
    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <FormControl className={classes.formControl}>
            <Select
                labelId="category-select"
                id="category-select"
                value={category}
                onChange={handleChange}
                MenuProps={{
                    anchorOrigin: {
                        vertical: "bottom",
                    },
                    getContentAnchorEl: null
                }}
            >
                <MenuItem value={1}>All</MenuItem>
                <MenuItem value={2}>Basics</MenuItem>
                <MenuItem value={3}>Gates</MenuItem>
            </Select>
        </FormControl>
    );
};

export default CategorySelect;