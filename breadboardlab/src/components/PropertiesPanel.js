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
            partData: {
                type: "",
                name: "",
                colour: "",
                resistance: 0,
                capacitance: 0,
                colourEnabled: false,
                resistanceEnabled: false,
                capacitanceEnabled: false,
            },
        }
    }

    componentWillReceiveProps(props) {
        this.setState(prevState => ({
            partData: {
                ...prevState.partData,
                type: props.partData.type,
                name: props.partData.name,
                colour: props.partData.colour,
                resistance: props.partData.resistance,
                capacitance: props.partData.capacitance,
                colourEnabled: props.partData.colourEnabled,
                resistanceEnabled: props.partData.resistanceEnabled,
                capacitanceEnabled: props.partData.capacitanceEnabled,
            }
        }))
    }

    render() {
        const {classes} = this.props;

        return (
            <Container disableGutters>
                <Divider/>
                <Grid className={classes.grid}>
                    <Typography variant={'h6'}>
                        {this.state.partData.type}
                    </Typography>
                    <Grid
                        container
                        spacing={1}
                        direction="column"
                    >
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
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default withStyles(styles)(PropertiesPanel);
