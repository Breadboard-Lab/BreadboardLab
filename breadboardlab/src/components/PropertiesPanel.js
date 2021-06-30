import React from "react";
import {
    Container,
    Divider,
    Grid,
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

    // componentWillReceiveProps(props) {
    //     this.setState(prevState => ({
    //         partData: {
    //             ...prevState.partData,
    //             type: props.partData.type,
    //             name: props.partData.name,
    //             colour: props.partData.colour,
    //             resistance: props.partData.resistance,
    //             capacitance: props.partData.capacitance,
    //             colourEnabled: props.partData.colourEnabled,
    //             resistanceEnabled: props.partData.resistanceEnabled,
    //             capacitanceEnabled: props.partData.capacitanceEnabled,
    //         }
    //     }))
    // }

    handleChanges = (event, propName) => {
        this.setState({selectedValue: event.target.value});

        if (this.props.partData.callback) {
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
                        {properties}
                        {/* <Typography variant={'h6'}>
                            {this.state.partData.type}
                        </Typography>
                        
                            <Grid item>
                                <TextField
                                    id="part-name"
                                    label="Part Name"
                                    value={this.state.partData.name}
                                    onChange={this.props.handleTextField}
                                />
                            </Grid>
                            {this.state.partData.colourEnabled ?
                                <Grid item>
                                    <InputLabel id="part-colour">Colour</InputLabel>
                                    <Select
                                        labelId="part-colour"
                                        id="part-colour"
                                        value={this.state.partData.colour}
                                        onChange={this.props.handleColourChange}
                                    >
                                        <MenuItem value={"red"}>Red</MenuItem>
                                        <MenuItem value={"green"}>Green</MenuItem>
                                        <MenuItem value={"blue"}>Blue</MenuItem>
                                    </Select>
                                </Grid>
                                : null}
                            {this.state.partData.resistanceEnabled ?
                                <Grid item>
                                    <InputLabel id="part-resistance">Resistance</InputLabel>
                                    <Select
                                        labelId="part-resistance"
                                        id="part-resistance"
                                        value={this.state.partData.resistance}
                                        onChange={this.props.handleResistanceChange}
                                    >
                                        <MenuItem value={10}>10 Ω</MenuItem>
                                        <MenuItem value={330}>330 Ω</MenuItem>
                                        <MenuItem value={1000}>1 kΩ</MenuItem>
                                    </Select>
                                </Grid>
                                : null}
                            {this.state.partData.capacitanceEnabled ?
                                <Grid item>
                                    <InputLabel id="part-capacitance">Capacitance</InputLabel>
                                    <Select
                                        labelId="part-capacitance"
                                        id="part-capacitance"
                                        value={this.state.partData.capacitance}
                                        onChange={this.props.handleCapacitanceChange}
                                    >
                                        <MenuItem value={100}>100 nF</MenuItem>
                                        <MenuItem value={200}>200 nF</MenuItem>
                                        <MenuItem value={300}>300 nF</MenuItem>
                                    </Select>
                                </Grid>
                                : null}
                        */}
                     </Grid>
                </Grid>
            </Container>
        )
    }
}

export default withStyles(styles)(PropertiesPanel);
