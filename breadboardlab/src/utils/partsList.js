import BreadBoard from "../components/parts/BreadBoard";
import MomentaryButton from "../components/parts/MomentaryButton";
import LED from "../components/parts/LED";
import Resistor from "../components/parts/Resistor";
import React from "react";
import CeramicCapacitor from "../components/parts/CeramicCapacitor";
import Switch from "../components/parts/Switch";
import Battery from "../components/parts/Battery";
import NPNTransistor from "../components/parts/NPNTransistor";
import PNPTransistor from "../components/parts/PNPTransistor";
import QuadANDChip from "../components/parts/QuandANDChip";
import QuadNANDChip from "../components/parts/QuandNANDChip";
import QuadNORChip from "../components/parts/QuandNORChip";
import QuadORChip from "../components/parts/QuandORChip";
import QuadXORChip from "../components/parts/QuandXORChip";
import HexInverterChip from "../components/parts/HexInverterChip";

const partsList = {
    all: [
        {name: 'Breadboard', component: <BreadBoard/>, description: ''},
        {name: 'Battery', component: <Battery/>, description: ''},
        //{name: 'LED', component: <LED/>, description: 'A light-emitting diode that emits light when current flows through it.'},
        {name: 'LED', component: <LED/>, description: 'A light-emitting diode that emits light when current flows through it.'},
        {name: 'Resistor', component: <Resistor/>, description: 'Limits and regulates the flow of electrical current.'},
        {name: 'Momentary Button', component: <MomentaryButton/>, description: 'A switch that closes or opens a circuit.'},
        {name: 'Switch', component: <Switch/>, description: ''},
        {name: 'Ceramic Capacitor', component: <CeramicCapacitor/>, description: ''},
        //{name: 'Transistor', component: <Transistor/>, description: ''},
        {name: 'NPN Transistor', component: <NPNTransistor/>, description: ''},
        {name: 'PNP Transistor', component: <PNPTransistor/>, description: ''},
    ],
    basics: [
        {name: 'Breadboard', component: <BreadBoard/>, description: ''},
        {name: 'Battery', component: <Battery/>, description: ''},
        //{name: 'LED', component: <LED/>, description: 'A light-emitting diode that emits light when current flows through it.'},
        {name: 'LED', component: <LED/>, description: 'A light-emitting diode that emits light when current flows through it.'},
        {name: 'Resistor', component: <Resistor/>, description: 'Limits and regulates the flow of electrical current.'},
        {name: 'Momentary Button', component: <MomentaryButton/>, description: 'A switch that closes or opens a circuit.'},
        {name: 'Switch', component: <Switch/>, description: ''},
        {name: 'Ceramic Capacitor', component: <CeramicCapacitor/>, description: ''},
        //{name: 'Transistor', component: <Transistor/>, description: ''},
        {name: 'NPN Transistor', component: <NPNTransistor/>, description: ''},
        {name: 'PNP Transistor', component: <PNPTransistor/>, description: ''},
    ],
    gates: [
        {name: 'Quad NAND Chip', component: <QuadNANDChip/>, description: '74HC00'},
        {name: 'Quad NOR Chip', component: <QuadNORChip/>, description: '74HC02'},
        {name: 'Hex NOT Chip', component: <HexInverterChip/>, description: '74HC04'},
        {name: 'Quad AND Chip', component: <QuadANDChip/>, description: '74HC08'},
        {name: 'Quad OR Chip', component: <QuadORChip/>, description: '74HC32'},
        {name: 'Quad XOR Chip', component: <QuadXORChip/>, description: '74HC86'},
    ]
}


export default partsList;