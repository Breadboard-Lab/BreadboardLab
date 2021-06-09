import Connector from './connector.js';

export default class Block {
    constructor(label, colour) {
        this.initialize(label, colour);
    }

    initialize(label, colour) {
        this.inputLabels = [];
        this.outputLabels = [];
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 50;
        this.label = label;
        this.colour = colour;
        this.roundedRadius = 10;

        this.inputSpacing = 10;
        this.inputOffsetX = 0;
        this.inputOffsetY = 0;
        this.outputOffsetX = 0;
        this.outputOffsetY = 0;

        this.maxInputs = Number.MAX_VALUE;
        this.maxOutputs = Number.MAX_VALUE;

        this.textSpacingX = 50;
        this.textSpacingY = 20;

        // the main block
        this.body = this.createBody();

        // dragging behaviour
        this.body.lastDragX = 0;
        this.body.lastDragY = 0;
        this.body.xOffset = 0;
        this.body.yOffset = 0;
        this.body.dragging = false;
        this.body.block = this;
        this.body.onmouseup = this.mouseup;
        this.body.onmousedown = this.mousedown;
        this.body.onmousemove = this.mousemove;

        // label
        this.text = document.createElementNS('http://www.w3.org/2000/svg','text');
        this.text.setAttribute('font-family', 'Verdana');
        this.text.setAttribute('font-weight', 'bold');
        this.text.onmouseup = this.mouseup;
        this.text.onmousedown = this.mousedown;
        this.text.onmousemove = this.mousemove;
        this.text.body = this.body;

        // inputs and outputs
        this.inputs = [];
        this.outputs = [];

        // wires
        this.wires = [];
    }

    createBody() {
        let body = document.createElementNS('http://www.w3.org/2000/svg','rect');

        body.setAttribute('x', this.x);
        body.setAttribute('y', this.y);
        body.setAttribute('width', this.width);
        body.setAttribute('height', this.height);
        body.setAttribute('rx', this.roundedRadius);
        body.setAttribute('ry', this.roundedRadius);
        body.setAttribute('stroke', 'black');
        body.setAttribute('stroke-width', '4');
        body.setAttribute('fill', this.colour);
        body.setAttribute('z', 5);

        return body;
    }

    simulate() {

    }

    addInput(label) {
        if (this.inputs.length < this.maxInputs) {
            this.inputLabels.push(label);

            let newInput = new Connector(label);
            this.inputs.push(newInput);
        }
    }

    addOutput(label) {
        if (this.outputs.length < this.maxOutputs) {
            this.outputLabels.push(label);

            let newOutput = new Connector(label);
            this.outputs.push(newOutput);
        }
    }

    addWire(wire) {
        this.wires.push(wire);

        this.updateWires();
    }

    getRequiredTextWidth() {
        let bbox = this.text.getBBox();
        return bbox.width + this.textSpacingX * 2;
    }

    getRequiredTextHeight() {
        let bbox = this.text.getBBox();
        return bbox.height + this.textSpacingY * 2;
    }

    pack() {
        // determine the text height and width
        let requiredTextWidth = this.getRequiredTextWidth();
        let requiredTextHeight = this.getRequiredTextHeight();
        this.width = requiredTextWidth;

        // determine the required height
        let inputRequiredHeight = this.positionInputs();
        let outputRequiredHeight = this.positionOutputs(inputRequiredHeight);
        
        if (requiredTextHeight > inputRequiredHeight && requiredTextHeight > outputRequiredHeight) {
            // create an offset for the inputs and outputs, to centre them within the component
            this.inputOffsetY = (requiredTextHeight - inputRequiredHeight) / 2;
            this.positionInputs();

            this.outputOffsetY = (requiredTextHeight - outputRequiredHeight) / 2;
            this.positionOutputs();

            this.height = requiredTextHeight;
        } else {
            this.height = inputRequiredHeight > outputRequiredHeight ? inputRequiredHeight : outputRequiredHeight;
        }
        this.resize();

        // position text
        this.positionText();

        // position wires
        this.updateWires();
    }

    positionText() {
        this.text.textContent = this.label;

        let bbox = this.text.getBBox();
        let yOffset = (this.height - bbox.height) / 2 + bbox.height - 2;

        this.text.setAttribute('y', this.y + yOffset);
        this.text.setAttribute('x', this.x + this.textSpacingX);
    }

    positionInputs() {
        // determine the height required for the inputs
        let requiredInputHeight = this.inputOffsetY + this.inputSpacing; // spacing before the first input
        if (this.inputs.length > 0) {
            requiredInputHeight += this.inputs[0].radius; 
        }

        for (let i = 0; i < this.inputs.length; i++) {
            // console.log(` input[${i}].setPosition(${this.x}, ${this.y + requiredInputHeight})`);
            this.inputs[i].setPosition(this.x + this.inputOffsetX, this.y + requiredInputHeight);

            requiredInputHeight += this.inputs[i].radius * 2 + this.inputSpacing;
        }

        // remove the extra radius from the last input
        if (this.inputs.length > 0) {
            requiredInputHeight -= this.inputs[this.inputs.length - 1].radius; 
        }

        return requiredInputHeight;
    }

    positionOutputs(requiredInputHeight) {
        // determine the height required for the outputs
        let requiredOutputHeight = this.outputOffsetY + this.inputSpacing; // spacing before the first output
        if (this.outputs.length > 0) {
            requiredOutputHeight += this.outputs[0].radius; 
        }

        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].setPosition(this.x + this.width + this.outputOffsetX, this.y + requiredOutputHeight);

            requiredOutputHeight += this.outputs[i].radius * 2 + this.inputSpacing;
        }

        // remove the extra radius from the last output
        if (this.outputs.length > 0) {
            requiredOutputHeight -= this.outputs[this.outputs.length - 1].radius; 
        }

        return requiredOutputHeight;
    }

    updateWires() {
        for (let i = 0; i < this.wires.length; i++) {
            this.wires[i].updateLines();
        }
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;

        this.body.setAttribute('x', this.x);
        this.body.setAttribute('y', this.y);

        let inputHeight = this.positionInputs();
        this.positionOutputs(inputHeight);
        this.positionText();
        this.updateWires();
    }

    resize() {
        this.body.setAttribute('width', this.width);
        this.body.setAttribute('height', this.height);
    }

    appendTo(svg) {
        svg.appendChild(this.body);
        svg.appendChild(this.text);

        for (let i = 0; i < this.inputs.length; i++) {
            svg.appendChild(this.inputs[i].drawElement);
        }

        for (let i = 0; i < this.outputs.length; i++) {
            svg.appendChild(this.outputs[i].drawElement);
        }
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
