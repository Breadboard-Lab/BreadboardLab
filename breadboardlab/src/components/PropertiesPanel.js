import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Container, Divider, Grid, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        bottom: 0,
    },
    grid: {
        margin: theme.spacing(1),
    }

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
        <Container disableGutters className={classes.root}>
            <Divider/>
            <Grid className={classes.grid}>
                <Grid>
                    <Typography>{props.partType ? props.partType : 'Lorem Ipsum Header'}</Typography>
                </Grid>
                <Grid
                    container
                    spacing={1}
                    direction="column"
                >
                    { /* TODO Enable/disable certain parts based off part type*/ }
                    <Grid item>
                        <TextField id="part-name" label="Part Name" />
                    </Grid>
                    <Grid item>
                        { /* TODO color */}
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
                    <Grid item>
                        { /* TODO resistance */}
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
                    <Grid item>
                        { /* TODO capacitance */}
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