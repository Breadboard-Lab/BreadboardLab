const LEFT = -1;
const RIGHT = 1;
const UP = -1;
const DOWN = 1;

export default class SegmentedWire {
    constructor(startConnector, endConnector, curveRadius=20) {
        this.connectors = [
            startConnector,
            endConnector
        ];
        this.corners = [];
        this.curveRadius = curveRadius;

        // the group
        this.topGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.topGroup.setAttribute('class', 'wire');
        this.topGroup.setAttribute('y', '100');

        // the main line (direct, initially)
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        this.path.setAttribute('stroke', 'black');
        this.path.setAttribute('stroke-width', '2');
        this.path.setAttribute('fill', 'transparent');
        this.topGroup = this.path;
        if (startConnector != null) {
            this.path.setAttribute('d', this.getDataString());
        }

        this.value = 0;
    }

    getDataString() {
        let startPoint = this.connectors[0].getPoint();
        let dataString = `M${startPoint.x},${startPoint.y} `;
    
        let lastPoint = startPoint;
        if (this.corners.length > 0) {
            lastPoint.x = (this.corners[0].x + lastPoint.x) / 2;
            dataString += `L${lastPoint.x},${lastPoint.y} `;
        } else {
            lastPoint.x = (this.connectors[1].getPoint().x + lastPoint.x) / 2;
            dataString += `L${lastPoint.x},${lastPoint.y} `;
        }

        let lastHorizDirection = RIGHT;
        let lastVertDirection = UP;
        let horizontalDirection = RIGHT;
        let verticalDirection = DOWN;        
        for (let i = 0; i <= this.corners.length; i++) {
            let currentPoint = {};
            if (i < this.corners.length) {
                currentPoint = this.corners[i];
            } else if ((this.connectors.length > 1) && (this.connectors[1] != null)) {
                currentPoint = this.connectors[1].getPoint();
            } else {
                // no end connector to connect to from here
                return dataString;
            }

            let radius = this.curveRadius;
            let verticalDifference = Math.abs(lastPoint.y - currentPoint.y);
            if (verticalDifference < 2 * this.curveRadius) {
                radius = verticalDifference / 2;
            }

            if (currentPoint.x < lastPoint.x) {
                lastHorizDirection = horizontalDirection;
                horizontalDirection = LEFT;
            } else {
                lastHorizDirection = horizontalDirection;
                horizontalDirection = RIGHT;
            }

            if (currentPoint.y < lastPoint.y) {
                lastVertDirection = verticalDirection;
                verticalDirection = UP;
            } else {
                lastVertDirection = verticalDirection;
                verticalDirection = DOWN;
            }

            let middleX = lastPoint.x + horizontalDirection * radius;
            if (lastHorizDirection != horizontalDirection) {
                // special case when turning around
                middleX = lastPoint.x + lastHorizDirection * radius;
            }

            let attractor1 = { 
                x: middleX,
                y: lastPoint.y
            };
            let attractor2 = {
                x: middleX,
                y: currentPoint.y
            };
            let a = {
                x: middleX,
                y: lastPoint.y + verticalDirection * radius
            };
            let b = {
                x: middleX,
                y: currentPoint.y - verticalDirection * radius
            };
            let c = {
                x: middleX + horizontalDirection * radius,
                y: currentPoint.y
            };

            dataString += `Q${attractor1.x},${attractor1.y} ${a.x},${a.y} `;
            dataString += `L${b.x},${b.y} `;
            dataString += `Q${attractor2.x},${attractor2.y} ${c.x},${c.y} `;
            dataString += `L${currentPoint.x},${currentPoint.y} `;

            lastPoint = currentPoint;
        }

        let endPoint = this.connectors[1].getPoint();
        dataString += `L${endPoint.x},${endPoint.y}`;
        return dataString;
    }

    getStartConnector() { return this.connectors[0]; }
    getEndConnector() { return this.connectors[1]; }

    setStartConnector(newConnector) {
        this.connectors[0] = newConnector;

        this.updateLines();
    }

    setEndConnector(newConnector) {
        this.connectors[1] = newConnector;

        this.updateLines();
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

            if (!this.path) {
                this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                this.path.setAttribute('class', 'connectorLine');
                this.path.setAttribute('d', this.getDataString());
                this.topGroup.appendChild(this.path);
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

        // update the corresponding SVG path element data
        this.updateLines();
    }

    setValue(value) {
        this.value = value;
        if (value == 1) {
            this.path.setAttribute('class', 'connectorOne');
        } else  if (value == 0) {
            this.path.setAttribute('class', 'connectorZero');
        } else {
            this.path.setAttribute('class', 'connectorError');
        }
    }

    getValue() { return this.value; }

    updateLines() {
        this.path.setAttribute('d', this.getDataString());
    }

    appendTo(svg) {
        svg.appendChild(this.topGroup);
    }
}
