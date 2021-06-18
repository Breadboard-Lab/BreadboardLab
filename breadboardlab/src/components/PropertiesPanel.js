import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Container, Divider, Grid, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    grid: {
        margin: theme.spacing(1),
    },
    colourHide: {
        display: 'none',
    },
    resistanceHide: {
        display: 'none',
    },
    capacitanceHide: {
        display: 'none',
    },

}));

const PropertiesPanel = props => {
    const classes = useStyles();

    const [colour, setColour] = React.useState(1);
    const [resistance, setResistance] = React.useState(4);
    const [capacitance, setCapacitance] = React.useState(7);

    const handleColourChange = (event) => {
        setColour(event.target.value);
    };
    const handleResistanceChange = (event) => {
        setResistance(event.target.value);
    };
    const handleCapacitanceChange = (event) => {
        setCapacitance(event.target.value);
    };

    return (
        <Container disableGutters>
            <Divider/>
            <Grid className={classes.grid}>
                <Typography variant={'h6'}>
                    {props.partType ? props.partType : 'Null Type Header'}
                </Typography>
                <Grid
                    container
                    spacing={1}
                    direction="column"
                >
                    <Grid item>
                        <TextField id="part-name" label="Part Name" value={props.partName ? props.partName : ""}/>
                    </Grid>
                    <Grid item className={!props.colourEnabled && classes.colourHide}>
                        <InputLabel id="part-colour">Colour</InputLabel>
                        <Select
                            labelId="part-colour"
                            id="part-colour"
                            value={colour}
                            onChange={handleColourChange}
                        >
                            <MenuItem value={1}>Red</MenuItem>
                            <MenuItem value={2}>Green</MenuItem>
                            <MenuItem value={3}>Blue</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item className={!props.resistanceEnabled && classes.resistanceHide}>
                        <InputLabel id="part-resistance">Resistance</InputLabel>
                        <Select
                            labelId="part-resistance"
                            id="part-resistance"
                            value={resistance}
                            onChange={handleResistanceChange}
                        >
                            <MenuItem value={4}>10 Ω</MenuItem>
                            <MenuItem value={5}>330 Ω</MenuItem>
                            <MenuItem value={6}>1 kΩ</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item className={!props.capacitanceEnabled && classes.capacitanceHide}>
                        <InputLabel id="part-capacitance">Capacitance</InputLabel>
                        <Select
                            labelId="part-capacitance"
                            id="part-capacitance"
                            value={capacitance}
                            onChange={handleCapacitanceChange}
                        >
                            <MenuItem value={7}>100 nF</MenuItem>
                            <MenuItem value={8}>100 nF</MenuItem>
                            <MenuItem value={9}>100 nF</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PropertiesPanel;