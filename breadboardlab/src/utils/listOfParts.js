import BreadBoard from "../components/parts/BreadBoard";
import MomentaryButton from "../components/parts/Button";
import LED from "../components/parts/LED";
import Resistor from "../components/parts/Resistor";
import Transistor from "../components/parts/Transistor";
import React from "react";

const listOfParts = {
    all: [
        {name: 'Breadboard', component: <BreadBoard/>, description: ''},
        {name: 'MomentaryButton', component: <MomentaryButton/>, description: 'A switch that closes or opens a circuit.'},
        {name: 'LED', component: <LED/>, description: 'A light-emitting diode that emits light when current flows through it.'},
        {name: 'Resistor', component: <Resistor/>, description: 'Limits and regulates the flow of electrical current.'},
        {name: 'Transistor', component: <Transistor/>, description: ''},
    ],
    basics: [
        {name: 'Breadboard', component: <BreadBoard/>, description: ''},
        {name: 'MomentaryButton', component: <MomentaryButton/>, description: 'A switch that closes or opens a circuit.'},
        {name: 'LED', component: <LED/>, description: 'A light-emitting diode that emits light when current flows through it.'},
        {name: 'Resistor', component: <Resistor/>, description: 'Limits and regulates the flow of electrical current.'},
        {name: 'Transistor', component: <Transistor/>, description: ''},
    ],
    gates: []
}


export default listOfParts;