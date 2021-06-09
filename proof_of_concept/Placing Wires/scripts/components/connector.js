export default class Connector {
    constructor(label, onColour, offColour, errorColour, type) {
        this.label = label;
        this.radius = 5;

        this.type = type;
        this.gate = null;

        this.value = -1;

        this.onColour = onColour;
        this.offColour = offColour;
        this.errorColour = errorColour;

        this.drawElement = document.createElementNS('http://www.w3.org/2000/svg','circle');
        this.drawElement.setAttribute('r', this.radius);
        this.drawElement.setAttribute('stroke', 'black');
        this.drawElement.setAttribute('stroke-width', 2);
        this.drawElement.setAttribute('fill', this.offColour);
        this.drawElement.setAttribute('class', 'connector');
        this.drawElement.setAttribute('z', 10);

        this.setPosition(0, 0);
    }

    updateValue() {
        if (this.value === 1) {
            this.drawElement.setAttribute('fill', this.onColour);
        } else if (this.value === 0) {
            this.drawElement.setAttribute('fill', this.offColour);
        } else {
            this.drawElement.setAttribute('fill', this.errorColour);
        }
    }

    setValue(value) {
        this.value = value;
        this.updateValue();
    }

    getValue() { return this.value; }

    isSet() {
        return this.value !== -1;
    }

    isError() {
        return this.value === -1;
    }

    isGateInput() {
        if (this.type === 'gate input') {
            return true;
        } else {
            return false;
        }
    }

    isGateOutput() {
        if (this.type === 'gate output') {
            return true;
        } else {
            return false;
        }
    }

    isCircuitInput() {
        if (this.type === 'circuit input') {
            return true;
        } else {
            return false;
        }
    }

    isCircuitOutput() {
        if (this.type === 'circuit output') {
            return true;
        } else {
            return false;
        }
    }

    setPosition(x, y) {
        this.drawElement.setAttribute('cx', x);
        this.drawElement.setAttribute('cy', y);
        this.x = x;
        this.y = y;
    }

    getBoundingRect() {
        let matrix = this.drawElement.getCTM();
        let x = this.x - this.radius;
        let y = this.y - this.radius;
        x = x * matrix.a + y * matrix.c + matrix.e;
        y = x * matrix.b + y * matrix.d + matrix.f;
        return {
            x: x,
            y: y,
            width: this.radius * 2,
            height: this.radius * 2,
        };
    }

    getPoint() {
        let matrix = this.drawElement.getCTM();
        let x = this.x;// - this.radius;
        let y = this.y;// - this.radius;
        x = x * matrix.a + y * matrix.c + matrix.e;
        y = x * matrix.b + y * matrix.d + matrix.f;
        return {
            x: x,
            y: y,
        };
    }

    contains(x, y) {
        let boundingRect = this.drawElement.getBoundingClientRect();
        return (x >= boundingRect.x && x <= (boundingRect.x + boundingRect.width) && y >= boundingRect.y && y <= (boundingRect.y + boundingRect.height));
    }
}
