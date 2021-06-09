import CircuitOutput from './circuit_output.js';

export default class CircuitInput extends CircuitOutput {
    constructor(label, xPosition, onColour, offColour, errorColour, type) {
        super(label, xPosition, onColour, offColour, errorColour, type);

        this.drawElement.setAttribute('fill', offColour);
        this.drawElement.setAttribute('class', '');

        this.value = 0;
        this.updateValue();
    }

    isSet() {
        return true;
    }

    isError() {
        return false; // circuit inputs cannot have error (for now)
    }

    toggleValue() {
        if (this.value == 1) {
            this.value = 0;
        } else {
            this.value = 1;
        }

        console.log('CircuitInput::toggleValue() calling updateValue()...');
        this.updateValue();
    }
}