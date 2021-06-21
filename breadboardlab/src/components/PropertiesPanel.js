import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Container, Divider, Grid, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    grid: {
        margin: theme.spacing(1),
    },
}));

const PropertiesPanel = props => {
    const classes = useStyles();

    return (
        <Container disableGutters>
            <Divider/>
            <Grid className={classes.grid}>
                <Typography variant={'h6'}>
                    {props.partData.type ? props.partData.type : 'Null Type Header'}
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
                            value={props.partData.name}
                            onChange={props.handleTextField}
                        />
                    </Grid>
                    {props.partData.colourEnabled ?
                        <Grid item>
                            <InputLabel id="part-colour">Colour</InputLabel>
                            <Select
                                labelId="part-colour"
                                id="part-colour"
                                value={props.partData.colour}
                                onChange={props.handleColourChange}
                            >
                                <MenuItem value={"red"}>Red</MenuItem>
                                <MenuItem value={"green"}>Green</MenuItem>
                                <MenuItem value={"blue"}>Blue</MenuItem>
                            </Select>
                        </Grid>
                        : null}
                    {props.partData.resistanceEnabled ?
                        <Grid item>
                            <InputLabel id="part-resistance">Resistance</InputLabel>
                            <Select
                                labelId="part-resistance"
                                id="part-resistance"
                                value={props.partData.resistance}
                                onChange={props.handleResistanceChange}
                            >
                                <MenuItem value={10}>10 Ω</MenuItem>
                                <MenuItem value={330}>330 Ω</MenuItem>
                                <MenuItem value={1000}>1 kΩ</MenuItem>
                            </Select>
                        </Grid>
                        : null}
                    {props.partData.capacitanceEnabled ?
                        <Grid item>
                            <InputLabel id="part-capacitance">Capacitance</InputLabel>
                            <Select
                                labelId="part-capacitance"
                                id="part-capacitance"
                                value={props.partData.capacitance}
                                onChange={props.handleCapacitanceChange}
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
    );
};

export default PropertiesPanel;