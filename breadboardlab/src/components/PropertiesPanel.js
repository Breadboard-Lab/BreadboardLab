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

const styles = theme => ({
    grid: {
        margin: theme.spacing(1),
    },
});

class PropertiesPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedValue: "",
        }
    }

    handleChanges = (event, propName) => {
        this.setState({selectedValue: event.target.value});

        if (typeof this.props.partData.callback === "function") {
            this.props.partData.callback(propName, event.target.value);
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
                                id="part-name"
                                label="Part Name"
                                value={prop.value}
                                onChange={event => this.handleChanges(event, prop.propName)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{prop.adornment ? prop.adornment : ""}</InputAdornment>,
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
