import BreadBoard from "../components/parts/BreadBoard";
import MomentaryButton from "../components/parts/MomentaryButton";
import LED from "../components/parts/LED";
import Resistor from "../components/parts/Resistor";
import Transistor from "../components/parts/Transistor";
import React from "react";
import CeramicCapacitor from "../components/parts/CeramicCapacitor";
import Switch from "../components/parts/Switch";
import Battery from "../components/parts/Battery";

const partsList = {
    all: [
        {name: 'Breadboard', component: <BreadBoard/>, description: ''},
        {name: 'Battery', component: <Battery/>, description: ''},
        {name: 'LED', component: <LED/>, description: 'A light-emitting diode that emits light when current flows through it.'},
        {name: 'Resistor', component: <Resistor/>, description: 'Limits and regulates the flow of electrical current.'},
        {name: 'Momentary Button', component: <MomentaryButton/>, description: 'A switch that closes or opens a circuit.'},
        {name: 'Switch', component: <Switch/>, description: ''},
        {name: 'Ceramic Capacitor', component: <CeramicCapacitor/>, description: ''},
        {name: 'Transistor', component: <Transistor/>, description: ''},
    ],
    basics: [
        {name: 'Breadboard', component: <BreadBoard/>, description: ''},
        {name: 'Battery', component: <Battery/>, description: ''},
        {name: 'LED', component: <LED/>, description: 'A light-emitting diode that emits light when current flows through it.'},
        {name: 'Resistor', component: <Resistor/>, description: 'Limits and regulates the flow of electrical current.'},
        {name: 'Momentary Button', component: <MomentaryButton/>, description: 'A switch that closes or opens a circuit.'},
        {name: 'Switch', component: <Switch/>, description: ''},
        {name: 'Ceramic Capacitor', component: <CeramicCapacitor/>, description: ''},
        {name: 'Transistor', component: <Transistor/>, description: ''},
    ],
    gates: []
}


export default partsList;