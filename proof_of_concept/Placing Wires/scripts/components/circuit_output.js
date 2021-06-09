import Connector from './connector.js';

export default class CircuitOutput extends Connector {
    constructor(label, xPosition, onColour, offColour, errorColour, type) {
        super(label, onColour, offColour, errorColour, type);
        
        this.radius = 10;
        this.xPosition = xPosition;

        this.drawElement.setAttribute('r', this.radius);
    }

    setPosition(x, y) {
        if (typeof this.xPosition === 'undefined') {
            this.xPosition = 0;
        }
        // ignore the x position, override with the input x position

        this.drawElement.setAttribute('cx', this.xPosition);
        this.drawElement.setAttribute('cy', y);
        this.x = this.xPosition;
        this.y = y;
    }
}