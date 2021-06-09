import Connector from './connector.js';
import { GATE_COLOUR, CIRCLE_RADIUS, NOT_GATE_POINTS, AND_GATE_POINTS, NAND_GATE_POINTS, OR_GATE_POINTS, NOR_GATE_POINTS, XOR_GATE_POINTS, XOR_CURVE_POINTS } from './gate_shapes.js';

export default class Gate {
    constructor(id, type) {
        this.initialize(id, type);
    }

    initialize(id, type) {
        this.inputOffsetY = 15;
        this.inputOffsetX = 0;
        this.outputOffsetY = 20;

        this.id = id;
        this.type = type;

        this.x = 0;
        this.y = 0;

        // the top-level group
        this.topGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.topGroup.setAttribute('x', this.x);
        this.topGroup.setAttribute('y', this.y);
        this.topGroup.setAttribute('id', this.id);
        this.topGroup.setAttribute('class', 'draggable');
        this.topGroup.gate = this;

        // the main block
        this.mainShape = document.createElementNS('http://www.w3.org/2000/svg','path');
        this.mainShape.setAttribute('d', `M ${this.x} ${this.y}`);
        this.mainShape.setAttribute('stroke', 'black');
        this.mainShape.setAttribute('stroke-width', '4');
        this.mainShape.setAttribute('fill', GATE_COLOUR);
        this.topGroup.appendChild(this.mainShape);

        let points = [];
        for (let i = 0; i < OR_GATE_POINTS.length; i++) {
            points.push([
                OR_GATE_POINTS[i].x * 200,
                OR_GATE_POINTS[i].y * 200
            ]);
        }

        // label
        this.label = document.createElementNS('http://www.w3.org/2000/svg','text');
        this.label.setAttribute('font-family', 'Verdana');
        this.label.setAttribute('font-weight', 'bold');
        this.label.setAttribute('x', 0);
        this.label.setAttribute('y', 0);
        this.label.textContent = ''; //this.type;
        this.topGroup.appendChild(this.label);

        // extras
        this.extrasGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.topGroup.appendChild(this.extrasGroup);

        // inputs
        this.inputs = [];
        this.inputLabels = [];
        this.inputsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.topGroup.appendChild(this.inputsGroup);

        // outputs
        this.outputs = [];
        this.outputLabels = [];
        this.outputsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
        this.topGroup.appendChild(this.outputsGroup);

        // wires
        this.wires = [];

        // sizing configuration
        this.paddingY = 20;
        this.paddingX = 20;
        this.inputSpacing = 10;
        this.outputSpacing = 10;

        this.maxOutputs = 1;
        this.minOutputs = 1;
        this.minInputs = 2;
        if (this.type === 'NOT') {
            this.maxInputs = 1;
            this.minInputs = 1;
        } else if (this.type === 'XOR') {
            this.maxInputs = 2;
        } else {
            this.maxInputs = Number.MAX_VALUE;
        }

        let defaultInputLabels = ['X', 'Y'];
        for (let i = 0; i < this.minInputs; i++) {
            this.addInput(defaultInputLabels[i]);
        }

        let defaultOutputLabels = ['Q'];
        for (let i = 0; i < this.minOutputs; i++) {
            this.addOutput(defaultOutputLabels[i]);
        }

        this.outputOffsetX = this.width;
    }

    getBoundingRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.getWidth(),
            height: this.getHeight(),
        };
    }

    getX() { return this.x; }
    getY() { return this.y; }
    setX(x) { this.x = x; }
    setY(y) { this.y = y; }

    contains(x, y) {
        let boundingRect = this.getBoundingRect();
        return (x >= boundingRect.x && x <= (boundingRect.x + boundingRect.width) && y >= boundingRect.y && y <= (boundingRect.y + boundingRect.height));
    }

    getTextHeight() {
        let labelRect = this.label.getBBox();
        return labelRect.height + 2 * this.paddingY;
    }

    getInputHeight() {
        let inputHeight = 0;
        if (this.inputs.length > 0) {
            inputHeight += this.inputSpacing;
        }
        for (let i = 0; i < this.inputs.length; i++) {
            inputHeight += this.inputSpacing + this.inputs[i].radius * 2;
        }
        return inputHeight + this.inputSpacing;
    }

    getOutputHeight() {
        let outputHeight = 0;
        if (this.outputs.length > 0) {
            outputHeight += this.outputSpacing;
        }
        for (let i = 0; i < this.outputs.length; i++) {
            outputHeight += this.outputSpacing + this.outputs[i].radius * 2;
        }
        return outputHeight;
    }

    getHeight() {
        let height = this.getTextHeight();

        let inputHeight = this.getInputHeight();
        if (inputHeight > height) {
            height = inputHeight;
        }

        let outputHeight = this.getOutputHeight();
        if (outputHeight > height) {
            height = outputHeight;
        }

        return height;
    }

    getWidth() {
        return 80; // for now
    }

    getExtras() {
        let extras = [];

        if (this.type === 'NOT' || this.type === 'NAND' || this.type === 'NOR') {
            let circle = this.createCircle(CIRCLE_RADIUS * this.width);
            circle.setAttribute('cx', 0.9 * this.width);
            circle.setAttribute('cy', 0.5 * this.height);
            extras.push(circle);
        } else if (this.type === 'XOR') {
            let points = XOR_CURVE_POINTS;
            let path = `M ${points[0].x * this.width} ${points[0].y * this.height} `;
            for (let i = 0; i < points.length; i++) {
                path += `L ${points[i].x * this.width} ${points[i].y * this.height} `;
            }        
            let curve = document.createElementNS('http://www.w3.org/2000/svg','path');
            curve.setAttribute('d', path);
            curve.setAttribute('stroke', 'black');
            curve.setAttribute('stroke-width', '4');
            curve.setAttribute('fill', 'transparent');
            extras.push(curve);
        }

        return extras;
    }

    createCircle(radius) {
        let circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        circle.setAttribute('r', radius);
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', 4);
        circle.setAttribute('fill', GATE_COLOUR);
        circle.setAttribute('z', 10);
        return circle;
    }

    resetValues() {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].setValue(-1);
        }
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].setValue(-1);
        }
    }

    areAllInputsNonError() {
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].getValue() == -1) {
                return false;
            }
        }
        return true;
    }

    areSomeOutputsError() {
        for (let i = 0; i < this.outputs.length; i++) {
            if (this.outputs[i].getValue() == -1) {
                return true;
            }
        }
        return false;
    }

    invertIfNecessary(value, type) {
        if (this.type !== 'NAND' && this.type !== 'NOR') {
            return value;
        } else {
            if (value === 1) {
                return 0;
            } else {
                return 1;
            }
        }
    }

    propagateSimulationValues() {
        if (this.type === 'OR' || this.type === 'NOR') {
            let result = 0;
            for (let i = 0; i < this.inputs.length; i++) {
                if (this.inputs[i].getValue() == 1) {
                    result = 1;

                    this.outputs[0].setValue(this.invertIfNecessary(result, this.type));
                    return result;
                }
            }
            this.outputs[0].setValue(this.invertIfNecessary(result, this.type));
            return result;
        } else if (this.type === 'AND' || this.type === 'NAND') {
            let result = 1;
            for (let i = 0; i < this.inputs.length; i++) {
                if (this.inputs[i].getValue() !== 1) {
                    result = 0;

                    this.outputs[0].setValue(this.invertIfNecessary(result, this.type));
                    return result;
                }
            }
            this.outputs[0].setValue(this.invertIfNecessary(result, this.type));
            return result;
        } else if (this.type === 'NOT') {
            let result = 1;
            if (this.inputs[0].getValue() == 1) {
                result = 0;
            }

            this.outputs[0].setValue(result);
            return result;
        } else if (this.type === 'XOR') {
            let result = 0;
            
            let value1 = this.inputs[0].getValue();
            let value2 = this.inputs[1].getValue();
            if ((value1 === 1 && value2 === 0) || (value1 === 0 && value2 === 1)) {
                result = 1;
            }

            this.outputs[0].setValue(result);
            return result;
        }
    }

    layout() {
        // determine the width and height
        let boundingRect = this.getBoundingRect();
        this.width = boundingRect.width;
        this.height = boundingRect.height;

        // update the main shape
        let path = '';
        let points;
        let xTextOffset, yTextOffset;
        
        // console.log(`checking type for path selection: ${this.type}`);
        // TODO: Put these into dictionaries
        let inputOffsetX = 0;
        let outputOffsetX = this.width + CIRCLE_RADIUS * 2;
        let orOffsetX = 0.05;
        if (this.type === "NOT") {
            points = NOT_GATE_POINTS;
            xTextOffset = 10;
            yTextOffset = -3;
        } else if (this.type === 'OR') {
            points = OR_GATE_POINTS;
            xTextOffset = 20;
            yTextOffset = -3;
            inputOffsetX = orOffsetX * this.width;
        } else if (this.type === 'NOR') {
            points = NOR_GATE_POINTS;
            xTextOffset = 20;
            yTextOffset = -3;
            inputOffsetX = orOffsetX * this.width;
        } else if (this.type === 'XOR') {
            points = XOR_GATE_POINTS;
            xTextOffset = 30;
            yTextOffset = -3;
            inputOffsetX = orOffsetX * this.width;
        } else if (this.type === 'AND') {
            points = AND_GATE_POINTS;
            xTextOffset = 10;
            yTextOffset = -3;
        } else if (this.type === 'NAND') {
            points = NAND_GATE_POINTS;
            xTextOffset = 10;
            yTextOffset = -3;
        }

        path += `M ${points[0].x * this.width} ${points[0].y * this.height} `;
        for (let i = 0; i < points.length; i++) {
            path += `L ${points[i].x * this.width} ${points[i].y * this.height} `;
        }        
        this.mainShape.setAttribute('d', path);

        // update the text position
        this.label.textContent = ''; this.type;
        let textRect = this.label.getBBox();
        // console.log(`layout::textRect = ${textRect.width},${textRect.height}`)
        let yTextPosition = this.height / 2 + textRect.height / 2 + yTextOffset;
        let xTextPosition = xTextOffset;
        this.label.setAttribute('x', xTextPosition);
        this.label.setAttribute('y', yTextPosition);

        // update the extras position
        let extras = this.getExtras();
        this.extrasGroup.querySelectorAll('*').forEach(n => n.remove());
        for (let i = 0; i < extras.length; i++) {
            this.extrasGroup.appendChild(extras[i]);
        }

        let textHeight = this.getTextHeight();
        let inputHeight = this.getInputHeight();
        let outputHeight = this.getOutputHeight();

        // update the inputs position
        if (this.inputs.length > 1) {
            let yInputOffset = this.inputSpacing - this.inputs[0].radius + this.inputOffsetY;
            if (textHeight > inputHeight) {
                yInputOffset = (textHeight - inputHeight) / 2;
            }

            for (let i = 0; i < this.inputs.length; i++) {
                this.inputs[i].setPosition(inputOffsetX, yInputOffset);
                yInputOffset += this.inputSpacing + this.inputs[i].radius * 2;
            }
        } else if (this.inputs.length == 1) {
            this.inputs[0].setPosition(inputOffsetX, this.height / 2);
        }

        // update the outputs position
        if (this.outputs.length > 1) {
            let yOutputOffset = this.inputSpacing - this.outputs[0].radius + this.outputOffsetY;
            if (textHeight > outputHeight) {
                yOutputOffset = (textHeight - outputHeight) / 2;
            }
            console.log(`${this.type}::initial offset: ${yOutputOffset}`);
            for (let i = 0; i < this.outputs.length; i++) {
                this.outputs[i].setPosition(outputOffsetX, yOutputOffset);
                yOutputOffset += this.inputSpacing + this.outputs[i].radius * 2;
            }
        } else if (this.outputs.length == 1) {
            this.outputs[0].setPosition(outputOffsetX, this.height / 2);
        }
    }

    addInput(label) {
        if (this.inputs.length < this.maxInputs) {
            this.inputLabels.push(label);

            let newInput = new Connector(label, '#2020a0', '#202020', '#a02020', 'gate input');
            newInput.gate = this;
            this.inputs.push(newInput);
            this.inputsGroup.appendChild(newInput.drawElement);
            this.layout();
        }
    }

    addOutput(label) {
        if (this.outputs.length < this.maxOutputs) {
            this.outputLabels.push(label);

            let newOutput = new Connector(label, '#2020a0', '#202020', '#a02020', 'gate output');
            this.outputs.push(newOutput);
            this.outputsGroup.appendChild(newOutput.drawElement);
            this.layout();
        }
    }

    addWire(wire) {
        this.wires.push(wire);

        this.updateWires();
    }

    updateWires() {
        for (let i = 0; i < this.wires.length; i++) {
            this.wires[i].updateLines();
        }
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;

        this.topGroup.setAttribute('transform', `translate(${x},${y})`);
    }

    resize() {
        this.body.setAttribute('width', this.width);
        this.body.setAttribute('height', this.height);
    }

    mousedown(event) {
        this.lastDragX = event.clientX;
        this.lastDragY = event.clientY;
        this.xOffset = event.clientX - parseInt(this.getAttribute('x'));
        this.yOffset = event.clientY - parseInt(this.getAttribute('y'));
        this.dragging = true;
    }

    mouseup() {
        this.dragging = false;
        this.xOffset = 0;
        this.yOffset = 0;
    }

    getLocation() {
        return {x: parseInt(this.body.getAttribute('x')), y: parseInt(this.body.getAttribute('y'))};
    }

    mousemove(event) {
        if (this.dragging) {
            let dx = event.clientX - this.lastDragX;
            let dy = event.clientY - this.lastDragY;

            let block;
            if (this.block) {
                block = this.block;
            } else {
                block = this.body.block;
            }
            let previousLoc = block.getLocation();
            block.moveTo(previousLoc.x + dx, previousLoc.y + dy);
    
            this.lastDragX = event.clientX;
            this.lastDragY = event.clientY;
        }
    }
}
