import React from "react";
import {
    Container,
    Divider,
    Grid, InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

const styles = theme => ({
    grid: {
        margin: theme.spacing(1),
    },
});

class PropertiesPanel extends React.Component {
    handleChanges = (event, propName) => {
        if (typeof this.props.partData.callback === "function") {
            this.props.partData.callback(propName, event.target.value);
        }
    }

    handleAutocomplete = (event, value, propName) => {
        /*
            Checks if theres an event and whether its a dropdown select event or if its a user typing.
         */
        if (event) {
            if (event.type === "click") {
                console.log("click")
                if (typeof this.props.partData.callback === "function") {
                    this.props.partData.callback(propName, value.unit);
                    this.props.partData.callback(propName, value.value);
                }
            } else {
                console.log("change")
                if (typeof this.props.partData.callback === "function") {
                    this.props.partData.callback(propName, value);
                }
            }
        }
    }

    render() {
        const {classes} = this.props;
        let properties = [];
        let key = 0;

        if (this.props.partData.props) {
            for (let prop of this.props.partData.props) {
                if (prop.propType === "string") {
                    properties.push(<Typography key={key} variant={'h6'}>{prop.value}</Typography>);
                    key++;
                } else if (prop.propType === "textfield") {
                    properties.push(
                        <Grid key={key} item>
                            <TextField
                                id="part-textfield"
                                label={prop.propName}
                                value={prop.value}
                                onChange={event => this.handleChanges(event, prop.propName)}
                                fullWidth
                                InputProps={{
                                    endAdornment: <InputAdornment
                                        position="end">{prop.adornment ? prop.adornment : ""}
                                    </InputAdornment>,
                                    inputProps: {
                                        min: 0
                                    }
                                }}
                                type={prop.type}
                                key={key + 1}
                            />
                        </Grid>
                    )
                    key += 2;
                } else if (prop.propType === "select") {
                    let options = [];

                    for (let option of prop.options) {
                        options.push(<MenuItem key={key} value={option}>{option}</MenuItem>);
                        key++;
                    }

                    properties.push(
                        <Grid key={key} item>
                            <InputLabel key={key + 1} id={prop.propName}>{prop.propName}</InputLabel>
                            <Select
                                key={key + 2}
                                labelId={prop.propName}
                                id={prop.propName}
                                value={prop.value}
                                onChange={event => this.handleChanges(event, prop.propName)}
                            >
                                {options}
                            </Select>
                        </Grid>
                    )
                    key += 3;
                } else if (prop.propType === "autocomplete") {
                    properties.push(
                        <Grid key={key} item>
                            <Autocomplete
                                id="part-autocomplete"
                                key={key + 1}
                                disableClearable
                                freeSolo
                                renderInput={(params) => <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment:
                                            <InputAdornment
                                                position="end">
                                                <Select
                                                    disableUnderline
                                                    value={prop.selectedUnit}
                                                    onChange={event => this.handleChanges(event, prop.propName)}
                                                >
                                                    {prop.units.map((object, index) =>
                                                        <MenuItem key={index} value={object}>
                                                            {object}
                                                        </MenuItem>)}
                                                </Select>
                                            </InputAdornment>,
                                    }}
                                    label={prop.propName}
                                    type={prop.type}
                                />}
                                renderOption={(option) => <Typography noWrap>{option.label}</Typography>}
                                options={prop.defaultOptions}
                                value={prop.value}
                                getOptionLabel={option => typeof option === 'string' ? option : option.value}
                                onChange={(event, value) => this.handleAutocomplete(event, value, prop.propName)}
                                onInputChange={(event, value) => this.handleAutocomplete(event, value, prop.propName)}
                            />
                        </Grid>
                    )
                    key += 4;
                }
            }
        }

        return (
            <Container disableGutters>
                <Divider/>
                <Grid className={classes.grid}>
                    <Grid
                        container
                        spacing={1}
                        direction="column"
                    >
                        { /* List of property form fields */}
                        {properties}
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default withStyles(styles)(PropertiesPanel);
