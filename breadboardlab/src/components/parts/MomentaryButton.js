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
                        let point = document.getElementById("AppSVG").createSVGPoint();
                        let t = attachRef.state.rotation * Math.PI / 180;
                        let breadboardDim = this.props.getDimensions(connector);
                        let breadboardWidth = breadboardDim.width * Math.cos(t) + breadboardDim.height * Math.sin(t);
                        let breadboardHeight = breadboardDim.height * Math.cos(t) + breadboardDim.width * Math.sin(t);

                        point.x = breadboardDim.x + breadboardWidth / 2;
                        point.y = breadboardDim.y + breadboardHeight / 2;
                        const svgBreadboard = point.matrixTransform(document.getElementById("AppSVG").getScreenCTM().inverse());

                        point.x = breadboardWidth / 2 * Math.cos(t) + breadboardHeight / 2 * Math.sin(t);
                        point.y = breadboardHeight / 2 * Math.cos(t) + breadboardWidth / 2 * Math.sin(t);
                        const radius = point.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );

                        t = this.state.rotation * Math.PI / 180;
                        let connectorDim = this.props.getDimensions(refData.ref.current);
                        let connectorWidth = Math.abs((connectorDim.width) * Math.cos(t) + (connectorDim.height) * Math.sin(t));
                        let connectorHeight = Math.abs((connectorDim.height) * Math.cos(t) + (connectorDim.width) * Math.sin(t));

                        point.x = connectorDim.right - connectorWidth / 2 * Math.cos(t) - connectorHeight / 2 * Math.sin(t);
                        point.y = connectorDim.bottom - connectorHeight / 2 * Math.cos(t) - connectorWidth / 2 * Math.sin(t);
                        const svgConnector = point.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );

                        point.x = 0;
                        point.y = 0;
                        const origin = point.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );

                        let radiusX = radius.x - origin.x;
                        let radiusY = radius.y - origin.y;

                        let ellispeArea = (svgConnector.x - svgBreadboard.x) * (svgConnector.x - svgBreadboard.x) / (radiusX * radiusX) + (svgConnector.y - svgBreadboard.y) * (svgConnector.y - svgBreadboard.y) / (radiusY * radiusY);
    
                        if (ellispeArea <= 1) {
                            element = connector;
                            break;
                        }
                    }
                }
                
                if (element) {
                    if (attachRef.connectedParts && (attachRef.connectedParts.get(element.id) === undefined || attachRef.connectedParts.get(element.id).ref === this))
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