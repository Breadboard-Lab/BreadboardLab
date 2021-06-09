import CircuitInput from './circuit_input.js';
import CircuitOutput from './circuit_output.js';
import SegmentedWire from './segmented_wire.js';
import Wire from './wire.js';

var circuit = null;

export default class Circuit {
    constructor(parentId, elementId, name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.borderColour = '#202020';
        this.backgroundColour = '#404040';
        this.borderWidth = 20;
        this.borderHeight = 20;
        this.inputX = 25;
        this.outputX = this.width - 25;

        this.components = [];
        this.wires = [];
        this.inputs = [];
        this.outputs = [];

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', width);
        this.svg.setAttribute('height', height);
        this.svg.setAttribute('id', elementId);
        this.svg.addEventListener('mousedown', this.startDrag);
        this.svg.addEventListener('mousemove', this.drag);
        this.svg.addEventListener('mouseup', this.endDrag);
        this.svg.addEventListener('mouseleave', this.endDrag);
        this.svg.addEventListener('click', this.click);
        this.svg.circuit = this;
        circuit = this;

        this.parentElement = document.getElementById(parentId);
        this.parentElement.appendChild(this.svg);

        // add the dark background (enabled/disabled by dark mode)
        this.borderRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        this.borderRect.setAttribute('x', 0);
        this.borderRect.setAttribute('y', 0);
        // this.borderRect.setAttribute('z', 0);
        this.borderRect.setAttribute('width', this.width);
        this.borderRect.setAttribute('height', this.height);
        this.borderRect.setAttribute('fill', this.borderColour);
        this.svg.appendChild(this.borderRect);

        this.backgroundRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        this.backgroundRect.setAttribute('x', this.borderWidth);
        this.backgroundRect.setAttribute('y', this.borderHeight);
        this.backgroundRect.setAttribute('width', this.width - this.borderWidth * 2);
        this.backgroundRect.setAttribute('height', this.height - this.borderHeight * 2);
        this.backgroundRect.setAttribute('fill', this.backgroundColour);
        // this.backgroundRect.setAttribute('z', 1);
        this.svg.appendChild(this.backgroundRect);

        // create a g for wires
        this.wiresGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        // this.wiresGroup.setAttribute('z', 10);
        this.wiresGroup.setAttribute('x', 0);
        this.wiresGroup.setAttribute('y', 0);
        this.svg.appendChild(this.wiresGroup);

        // create a g for inputs
        this.inputsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        // this.inputsGroup.setAttribute('z', 10);
        this.inputsGroup.setAttribute('x', 0);
        this.inputsGroup.setAttribute('y', 0);
        this.svg.appendChild(this.inputsGroup);

        // create a g for outputs
        this.outputsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        // this.outputsGroup.setAttribute('z', 10);
        this.outputsGroup.setAttribute('x', 0);
        this.outputsGroup.setAttribute('y', 0);
        this.svg.appendChild(this.outputsGroup);

        this.selectedElement = false;
        this.placingWire = false;
        this.placingInput = false;
        this.placingOutput = false;
    }

    addGate(gate) {
        this.svg.appendChild(gate.topGroup);
        gate.layout();
        this.components.push(gate);
    }

    addWire(wire) {
        this.wiresGroup.appendChild(wire.topGroup);
        this.wires.push(wire);
    }

    addInput(label) {
        let input = new CircuitInput(label, this.inputX, '#2020a0', '#202020', '#a02020', 'circuit input');
        this.inputs.push(input);
        this.inputsGroup.appendChild(this.inputs[this.inputs.length - 1].drawElement);
        return input;
    }

    addOutput(label) {
        let output = new CircuitOutput(label, this.outputX, '#2020a0', '#202020', '#a02020', 'circuit output');
        this.outputs.push(output);
        this.outputsGroup.appendChild(this.outputs[this.outputs.length - 1].drawElement);
        return output;
    }

    updateSimulation() {
        // initialize everything to 'error'
        for (let w = 0; w < this.wires.length; w++) {
            this.wires[w].setValue(-1);
            if (!this.wires[w].getStartConnector().isCircuitInput()) {
                this.wires[w].getStartConnector().setValue(-1);
            }
        }
        for (let c = 0; c < this.components.length; c++) {
            this.components[c].resetValues();
        }

        let moreToSimulate = true;
        while (moreToSimulate) {
            moreToSimulate = false;

            // propagage the values across any wires without an output
            for (let w = 0; w < this.wires.length; w++) {
                if (this.wires[w].getValue() !== -1) {
                    // this wire already has its value, don't calculate it again
                    continue;
                }

                // if this wire's connector is a gate/block output or a circuit input, pass the value onto the other connector
                let value = this.wires[w].getStartConnector().getValue();
                if (this.wires[w].getStartConnector().isCircuitInput() || this.wires[w].getStartConnector().isGateOutput()) {
                    if (this.wires[w].getStartConnector().isSet()) { // && this.wires[w].getEndConnector().isError()) {
                        console.log(`  ...setting value of end connection of wire ${w} to ${value}`);
                        this.wires[w].getEndConnector().setValue(value);
                        this.wires[w].setValue(value);
                    }
                }
            }

            // propagate the values across the gates
            for (let c = 0; c < this.components.length; c++) {
                if (this.components[c].areAllInputsNonError() && this.components[c].areSomeOutputsError()) {
                    let value = this.components[c].propagateSimulationValues();
                    moreToSimulate = true;
                }
            }
        }
    }

    layout() {
        // divide up the input space equally
        if (this.inputs.length > 0) {
            let inputHeight = this.inputs[0].radius * this.inputs.length;
            let spacingHeight = this.height - inputHeight;
            let spacingY = spacingHeight / (this.inputs.length + 1);

            let y = spacingY;
            for (let i = 0; i < this.inputs.length; i++) {
                this.inputs[i].setPosition(0, y);
                y += this.inputs[i].radius * 2 + spacingY;
            }
        }

        // divide up the output space equally
        if (this.outputs.length > 0) {
            let outputHeight = this.outputs[0].radius * this.outputs.length;
            let spacingHeight = this.height - outputHeight;
            let spacingY = spacingHeight / (this.outputs.length + 1);

            let y = spacingY;
            for (let i = 0; i < this.outputs.length; i++) {
                this.outputs[i].setPosition(0, y);
                y += this.outputs[i].radius * 2 + spacingY;
            }
        }
    }

    updateWires() {
        for (let i = 0; i < this.wires.length; i++) {
            this.wires[i].updateLines();
        }
    }

    placeNewInput(event) {
        circuit.placingInput = true;
    }

    placeNewOutput(event) {
        circuit.placingOutput = true;
    }

    placeNewGate(gate) {
        this.addGate(gate);
        gate.moveTo(-100, -100);
        this.selectedElement = gate;
        let boundingRect = gate.getBoundingRect();
        this.offset = {
            x: boundingRect.width / 2,
            y: boundingRect.height / 2
        };
    }

    placeNewWire() {
        // do nothing now
    }

    getMousePosition(event) {
        var CTM = this.svg.getScreenCTM();
        return {
          x: (event.clientX - CTM.e) / CTM.a,
          y: (event.clientY - CTM.f) / CTM.d
        };
    }
  
    startDrag(event) {
        for (let i = 0; i < this.circuit.components.length; i++) {
            let coord = this.circuit.getMousePosition(event);
            if (this.circuit.components[i].contains(coord.x, coord.y)) {
                this.circuit.selectedElement = this.circuit.components[i];
                this.circuit.offset = coord;
                this.circuit.offset.x -= this.circuit.selectedElement.getX();
                this.circuit.offset.y -= this.circuit.selectedElement.getY();
            }
        }
    }

    addConnectorToWire(circuit, connector) {
        if (circuit.placingWire) {
            let complete = circuit.wireBeingPlaced.setNextConnector(connector);
            if (complete) {
                circuit.placingWire = false;
                circuit.wireBeingPlaced = null;
                circuit.updateWires();
            }
        } else {
            circuit.placingWire = true;
            circuit.wireBeingPlaced = new SegmentedWire(null, null);
            circuit.wireBeingPlaced.setNextConnector(connector);
            circuit.addWire(circuit.wireBeingPlaced);
        }
    }

    click(event) {
        let x = event.clientX;
        let y = event.clientY;

        // check if the user clicked on any of our components' connectors
        for (let i = 0; i < circuit.components.length; i++) {
            // check input connectors
            for (let j = 0; j < circuit.components[i].inputs.length; j++) {
                if (circuit.components[i].inputs[j].contains(x, y)) {
                    circuit.addConnectorToWire(circuit, circuit.components[i].inputs[j]);
                    return;
                }
            }

            // check output connectors
            for (let j = 0; j < circuit.components[i].outputs.length; j++) {
                if (circuit.components[i].outputs[j].contains(x, y)) {
                    circuit.addConnectorToWire(circuit, circuit.components[i].outputs[j]);
                    return;
                }
            }
        }

        // check circuit inputs
        for (let i = 0; i < circuit.inputs.length; i++) {
            if (circuit.inputs[i].contains(x, y)) {
                circuit.addConnectorToWire(circuit, circuit.inputs[i]);
                return;
            }
        }

        // check circuit outputs
        for (let i = 0; i < circuit.outputs.length; i++) {
            if (circuit.outputs[i].contains(x, y)) {
                circuit.addConnectorToWire(circuit, circuit.outputs[i]);
                return;
            }
        }

        if (circuit.placingWire) {
            // must just be a corner
            let matrix = circuit.wireBeingPlaced.path.getCTM();
            let corner_x = x * matrix.a + y * matrix.c + matrix.e;
            let corner_y = x * matrix.b + y * matrix.d + matrix.f - 50; 
            circuit.wireBeingPlaced.addCorner(corner_x, corner_y);
        } else if (circuit.placingInput || circuit.placingOutput) {
            for (let i = 0; i < this.circuit.components.length; i++) {
                let coord = this.circuit.getMousePosition(event);
                if (this.circuit.components[i].contains(coord.x, coord.y)) {
                    if (circuit.placingInput) {
                        circuit.placingInput = false;
                        this.circuit.components[i].addInput('');
                    } else {
                        circuit.placingOutput = false;
                        this.circuit.components[i].addOutput('');
                    }
                }
            }
        } else {
            // check if any of the inputs are being toggled
            for (let i = 0; i < circuit.inputs.length; i++) {
                if (circuit.inputs[i].contains(x, y)) {
                    circuit.inputs[i].toggleValue();
                    circuit.updateSimulation();
                    return;
                }
            }
        }
    }

    drag(event) {
        if (this.circuit.selectedElement) {
            event.preventDefault();
            let coord = this.circuit.getMousePosition(event);
            this.circuit.selectedElement.moveTo(coord.x - this.circuit.offset.x, coord.y - this.circuit.offset.y);
            this.circuit.updateWires();
        }
    }

    endDrag(event) {
        this.circuit.selectedElement = null;
    }  
}
