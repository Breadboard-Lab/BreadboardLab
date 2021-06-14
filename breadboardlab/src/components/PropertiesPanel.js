import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Grid, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
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
        <div className={classes.root}>
            <Grid>
                <Grid>
                    <Typography>{props.partType ? props.partType : 'Lorem Ipsum Header'}</Typography>
                </Grid>
                <Grid>
                    { /* TODO Enable/disable certain parts based off part type*/ }
                    <TextField id="part-name" label="Part Name" />
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
        </div>
    );
};

export default PropertiesPanel;