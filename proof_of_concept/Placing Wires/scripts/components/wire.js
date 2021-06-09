export default class Wire {
    constructor(startConnector, endConnector) {
        this.connectors = [
            startConnector,
            endConnector
        ];
        this.corners = [];

        // the group
        this.topGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.topGroup.setAttribute('class', 'wire');

        // the main line (direct, initially)
        if (startConnector != null) {
            this.lines = [
                document.createElementNS('http://www.w3.org/2000/svg', 'line')
            ];
            this.lines[0].setAttribute('class', 'connectorLine');
            this.topGroup.appendChild(this.lines[0]);
            this.updateLines();
        } else {
            this.lines = [];
        }
    }

    getStartConnector() { return this.connectors[0]; }
    getEndConnector() { return this.connectors[1]; }

    setStartConnector(newConnector) {
        this.connectors[0] = newConnector;
    }

    setEndConnector(newConnector) {
        this.connectors[1] = newConnector;

        if (this.lines.length == 0) {
            this.lines = [
                document.createElementNS('http://www.w3.org/2000/svg', 'line')
            ];
            this.lines[0].setAttribute('class', 'connectorLine');
            this.topGroup.appendChild(this.lines[0]);
            this.updateLines();
        }
    }

    setNextConnector(newConnector) {
        if (this.connectors[0] == null) {
            this.connectors[0] = newConnector;
            return false;
        } else {
            this.connectors[1] = newConnector;

            // switch connectors if placed in incorrect order
            if (this.connectors[1].isCircuitInput() || this.connectors[1].isGateOutput()) {
                let temp = this.connectors[1];
                this.connectors[1] = this.connectors[0];
                this.connectors[0] = temp;
            }

            if (this.lines.length == 0) {
                this.lines = [
                    document.createElementNS('http://www.w3.org/2000/svg', 'line')
                ];
                this.lines[0].setAttribute('class', 'connectorLine');
                this.topGroup.appendChild(this.lines[0]);
            }
            return true;
        }
    }

    addCorner(x, y) {
        // add the corner location
        this.corners.push({
            x: x,
            y: y
        });

        console.log(`addCorner(): before corner, there are already ${this.lines.length} lines`);

        // create a new line
        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine.setAttribute('class', 'connectorLine');
        this.lines.push(newLine);

        // update the corresponding SVG element locations
        this.updateLines();
    }

    setValue(value) {
        for (let i = 0; i < this.lines.length; i++) {
            if (value == 1) {
                this.lines[i].setAttribute('class', 'connectorOne');
            } else  if (value == 0) {
                this.lines[i].setAttribute('class', 'connectorZero');
            } else {
                this.lines[i].setAttribute('class', 'connectorError');
            }
        }
    }

    updateLines() {
        if ((this.corners.length > 0) && (this.lines.length == (this.corners.length + 1))) {
            this.lines[0].setAttribute('x1', this.connectors[0].x);
            this.lines[0].setAttribute('y1', this.connectors[0].y);

            for (let i = 0; i < this.corners.length; i++) {
                // finish the previous line
                this.lines[i].setAttribute('x2', this.corners[i].x);
                this.lines[i].setAttribute('y2', this.corners[i].y);

                // start the next line
                this.lines[i+1].setAttribute('x1', this.corners[i].x);
                this.lines[i+1].setAttribute('y1', this.corners[i].y);
            }

            this.lines[this.lines.length - 1].setAttribute('x2', this.connectors[1].x);
            this.lines[this.lines.length - 1].setAttribute('y2', this.connectors[1].y);
        } else if (this.corners.length == 0) {
            let p1 = this.connectors[0].getPoint();
            let p2 = this.connectors[1].getPoint();
            this.lines[0].setAttribute('x1', p1.x);
            this.lines[0].setAttribute('y1', p1.y);
            this.lines[0].setAttribute('x2', p2.x);
            this.lines[0].setAttribute('y2', p2.y);
        } else {
            console.log('unknown case');
            console.log(`num corners: ${this.corners.length}`);
            console.log(`num lines:   ${this.lines.length}`);
        }
    }

    appendTo(svg) {
        for (let i = 0; i < this.lines.length; i++) {
            svg.appendChild(this.lines[i]);
        }
    }
}

// Object.assign(Block.prototype, Draggable);
