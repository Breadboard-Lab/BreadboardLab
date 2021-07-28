import React from "react";
import interact from "interactjs";

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.topLeftConnector = React.createRef();
        this.topRightConnector = React.createRef();
        this.bottomLeftConnector = React.createRef();
        this.bottomRightConector = React.createRef();
        
        this.state = {
            type: "Momentary Button",
            name: "Momentary Button",
            isSelected: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 50, y: 50};
        this.offSet = {x: 0.3, y: 0.35};
        this.attachTo = new Map();
        this.refArray = [
            {id: "topLeft", ref: this.topLeftConnector},
            {id: "topRight", ref: this.topRightConnector},
            {id: "bottomLeft", ref: this.bottomLeftConnector},
            {id: "bottomRight", ref: this.bottomRightConector}
        ];
    }

    componentDidMount() {
        interact(this.node.current.parentNode).styleCursor(false).draggable({
			listeners: {
				move: event => {
                    if (event.currentTarget === this.topLeftConnector.current && typeof this.props.movePart === "function") {
                        this.props.movePart(event, this);
                    } else {
                        const {interaction} = event;
                        interaction.stop();
                        interaction.start({name: "drag"}, event.interactable, this.topLeftConnector.current)
                    }
                }
			},
		})
    }

    onDoubleClick() {
        this.props.onDoubleTap(this.getProps());
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type")
            this.setState({type: value}, this.onDoubleClick);
        else if (propName.toLowerCase() === "name")
            this.setState({name: value}, this.onDoubleClick);
    }

    getProps() {
        return(
            {
                ref: this,
                callback: this.updateProp,
                props: [
                    {propName: "Type", propType: "string", value: this.state.type},
                    {propName: "Name", propType: "textfield", value: this.state.name},
                ]
            }
        )
    }

    highlight(event, attachRef) {
        let elementID = this.checkConnected(attachRef);

        if (elementID.length === 4) {
            this.highlightID = {ids: elementID, ref: attachRef};

            for (let connectorID of this.highlightID.ids)
                attachRef.node.current.querySelector("#" + connectorID).setAttribute("filter", "url(#f3)")
        }
    }

    connect(relatedTarget, currentTarget, attachRef) {        
        let pointBreadboard = document.getElementById("AppSVG").createSVGPoint();
        pointBreadboard.x = currentTarget.getBoundingClientRect().x + currentTarget.getBoundingClientRect().width / 2;
        pointBreadboard.y = currentTarget.getBoundingClientRect().y + currentTarget.getBoundingClientRect().height / 2;
        const svgBreadboard = pointBreadboard.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );

        let pointConnector = document.getElementById("AppSVG").createSVGPoint();
        pointConnector.x = this.topLeftConnector.current.getBoundingClientRect().x + this.topLeftConnector.current.getBoundingClientRect().width / 2;
        pointConnector.y = this.topLeftConnector.current.getBoundingClientRect().y + this.topLeftConnector.current.getBoundingClientRect().height / 2;
        const svgConnector = pointConnector.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );


        if (this.highlightID && this.highlightID.ids.length === 4) {
            for (let i = 0; i < this.refArray.length; i++) {
                this.attachTo.set(this.refArray[i].id, {id: this.highlightID.ids[i], ref: attachRef});
                
                if (typeof attachRef.connectPart === "function") 
                    attachRef.connectPart(this.highlightID.ids[i], this.refArray[i].id, this);
            }
            this.setState({translation: {
                x: this.state.translation.x + svgBreadboard.x - svgConnector.x + 0.8 * Math.cos((this.state.rotation - 135) * Math.PI / 180),
                y: this.state.translation.y + svgBreadboard.y - svgConnector.y + 0.8 * Math.sin((this.state.rotation - 135) * Math.PI / 180)}
            });
        }
    }

    disconnect() {
        if (this.highlightID)
            for (let id of this.highlightID.ids)
                this.highlightID.ref.node.current.querySelector("#" + id).setAttribute("filter", "");

        for (let refData of this.refArray) {
            if (this.attachTo.get(refData.id) && typeof this.attachTo.get(refData.id).ref.disconnectPart === "function") {
                this.attachTo.get(refData.id).ref.disconnectPart(this.attachTo.get(refData.id).id, this);
            }
            this.attachTo.set(refData.id, undefined);
        }
        this.highlightID = undefined;
    }

    rotate(attahRef) {
        this.setState({rotation: this.state.rotation + 15}, () => {
            if (attahRef) {
                this.connect(this.topLeftConnector.current, attahRef.node.current.querySelector("#" + this.attachTo.get("topLeft").id), attahRef);
            } else {
                this.disconnect();
            }
        })
    }

    checkConnected(attachRef) {
        let elementID = [];
        let connectors = Array.prototype.slice.call(attachRef.connectors);

        if (connectors) {
            for (let refData of this.refArray) {
                let element = undefined;

                for (let connector of connectors) {
                    let rect1 = refData.ref.current.getBoundingClientRect();
                    let rect2 = connector.getBoundingClientRect();
                    let overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);

                    if (overlap) {
                        let xConnection = refData.ref.current.getBoundingClientRect().x + refData.ref.current.getBoundingClientRect().width / 2;
                        let yConnection = refData.ref.current.getBoundingClientRect().y + refData.ref.current.getBoundingClientRect().height / 2;
    
                        let xConnector = connector.getBoundingClientRect().x + connector.getBoundingClientRect().width / 2;
                        let yConnector = connector.getBoundingClientRect().y + connector.getBoundingClientRect().height / 2;

                        let t = attachRef.state.rotation * (Math.PI / 180);
                        let w, h;

                        if (attachRef.state.rotation % 360 !== 45) {
                            w = (1 / (Math.cos(t) * Math.cos(t) - Math.sin(t) * Math.sin(t))) * ( connector.getBoundingClientRect().width * Math.cos(t) - connector.getBoundingClientRect().height * Math.sin(t))
                            h = (1 / (Math.cos(t) * Math.cos(t) - Math.sin(t) * Math.sin(t))) * (-connector.getBoundingClientRect().width * Math.sin(t) + connector.getBoundingClientRect().height * Math.cos(t))
                        } else {
                            w = (connector.getBoundingClientRect().width * Math.cos(t) + connector.getBoundingClientRect().height * Math.sin(t)) / 2;
                            h = (connector.getBoundingClientRect().width * Math.sin(t) + connector.getBoundingClientRect().height * Math.cos(t)) / 2;
                        }            
                        let radiusX = Math.abs(w) / 2;
                        let radiusY = Math.abs(h) / 2;
                        let ellispeArea = (xConnection - xConnector) * (xConnection - xConnector) / (radiusX * radiusX) + (yConnection - yConnector) * (yConnection - yConnector) / (radiusY * radiusY);
    
                        if (ellispeArea <= 1) 
                            element = connector;
                        break;
                    }
                }
                
                if (element) {
                    let rect1 = refData.ref.current.getBoundingClientRect();
                    let rect2 = element.getBoundingClientRect();
                    let overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);

                    if (overlap && attachRef.connectedParts && (attachRef.connectedParts.get(element.id) === undefined || attachRef.connectedParts.get(element.id).ref === this))
                        elementID.push(element.id);
                }
            }
        }
        return elementID;
    }
    
    render() {
        let rotatePointX;
        let rotatePointY;

        if (this.node.current) {
            let partBBox = this.node.current.firstChild.getBBox();
            rotatePointX = partBBox.width / 2;
            rotatePointY = partBBox.height / 2;
            
        } else {
            rotatePointX = 0;
            rotatePointY = 0;
        }

        return(
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `translate(30,33),scale(90,90)` : `scale(${this.scale.x} ${this.scale.y}) rotate(${this.state.rotation} ${rotatePointX} ${rotatePointY}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <rect x="-0.3" y="-0.3" width="0.6" height="0.6" rx=".1" fill="#202020" />
                    <rect x="-0.27" y="-0.27" width="0.54" height="0.54" rx=".1" fill="#707070" />
                    <rect ref={this.topLeftConnector} className="connector" x="-0.2" y="-0.35" width="0.06" height="0.05" fill="#707070" />
                    <rect ref={this.topRightConnector} x="0.14" y="-0.35" width="0.06" height="0.05" fill="#707070" />
                    <rect ref={this.bottomLeftConnector} x="-0.2" y="0.3" width="0.06" height="0.05" fill="#707070" />
                    <rect ref={this.bottomRightConector} x="0.14" y="0.3" width="0.06" height="0.05" fill="#707070" />
                    <circle cx="0" cy="0" r="0.15" fill="#000000" />
                    <circle cx="0" cy="0" r="0.1" fill="#202020" />
                    <circle cx="-0.18" cy="-0.18" r="0.03" fill="#202020" />
                    <circle cx="0.18" cy="-0.18" r="0.03" fill="#202020" />
                    <circle cx="-0.18" cy="0.18" r="0.03" fill="#202020" />
                    <circle cx="0.18" cy="0.18" r="0.03" fill="#202020" />
                    <rect x="-0.3" y="-0.3" width="0.6" height="0.6" rx=".1"
                        fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="0.025" strokeMiterlimit="50" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>
        )
    }
}