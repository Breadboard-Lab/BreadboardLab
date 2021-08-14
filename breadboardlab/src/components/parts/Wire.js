import React from "react";
import Interactable from "../Interactable";

export default class Wire extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.startPoint = React.createRef();
        this.endPoint = React.createRef();

        this.state = {
            startPoint: this.props.startPoint,
            endPoint: this.props.endPoint,
            type: "Wire",
            name: "Wire",
            colour: "Red",
            visualColourOuter: "hsl(0, 100%, 31%)",
            visualColourInner: "hsl(0, 100%, 75%)",
            isSelected: false,
            translation: {x: this.props.translation.x, y: this.props.translation.y},
            rotation: this.props.rotation
        }
        this.setPoints = this.setPoints.bind(this);
        this.movePart = this.movePart.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.attachTo = new Map();
        this.refArray = [
            {id: "start", ref: this.startPoint},
            {id: "end", ref: this.endPoint},
        ];
    }

    draggableOptionsStartPoint = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                let endPoint = this.endPoint.current.node;
                this.dragged = true;

                this.setPoints({x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale},
                               {x: Number(endPoint.getAttribute("cx")), y: Number(endPoint.getAttribute("cy"))});
            }
        }
    }

    draggableOptionsEndPoint = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                let startPoint = this.startPoint.current.node;
                this.dragged = true;

                this.setPoints({x: Number(startPoint.getAttribute("cx")), y: Number(startPoint.getAttribute("cy"))},
                               {x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale});
            }
        }
    }

    onMouseUp() {
        if (!this.dragged) {
            this.props.handlePartSelect(this.getProps());
        }
        this.dragged = false;
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, () => this.props.updatePropertiesPanel(this.getProps()));
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, () => this.props.updatePropertiesPanel(this.getProps()));
        } else if (propName.toLowerCase() === "colour") {
            this.setState({colour: value}, () => this.props.updatePropertiesPanel(this.getProps()));

            // Changes LED colour based on Properties Panel Colour Selection
            switch (value) {
                case "Red":
                    this.setState({visualColourOuter: "hsl(0, 100%, 31%)"})
                    this.setState({visualColourInner: "hsl(0, 100%, 75%)"})
                    break
                case "Blue":
                    this.setState({visualColourOuter: "hsl(210,100%,31%)"})
                    this.setState({visualColourInner: "hsl(210,100%,75%)"})
                    break
                case "Green":
                    this.setState({visualColourOuter: "hsl(100, 100%, 31%)"})
                    this.setState({visualColourInner: "hsl(125,100%,75%)"})
                    break
                case "Yellow":
                    this.setState({visualColourOuter: "hsl(55,100%,31%)"})
                    this.setState({visualColourInner: "hsl(55, 100%, 75%)"})
                    break
                default:
                    this.setState({visualColourOuter: "hsl(0, 100%, 31%)"})
                    this.setState({visualColourInner: "hsl(0, 100%, 75%)"})
            }
        }
    }

    getProps() {
        return (
            {
                ref: this,
                callback: this.updateProp,
                props: [
                    {propName: "Type", propType: "string", value: this.state.type},
                    {propName: "Name", propType: "textfield", value: this.state.name},
                    {
                        propName: "Colour",
                        propType: "select",
                        value: this.state.colour,
                        options: ["Red", "Blue", "Green", "Yellow"]
                    }
                ]
            }

        )
    }

    highlight(event, attachRef) {
        let elementID = this.props.checkConnected(this, attachRef);
        this.highlightID = {ids: elementID, ref: attachRef};

        for (let connectorID of this.highlightID.ids)
            if (connectorID)
                attachRef.node.current.querySelector("#" + connectorID).setAttribute("filter", "url(#f3)")
    }

    connect(relatedTarget, currentTarget, attachRef) {
		if (this.highlightID) {
            for (let i = 0; i < this.refArray.length; i++) {
                if (this.highlightID.ids[i]) {
                    const xPos = (Number(attachRef.node.current.querySelector("#" + this.highlightID.ids[i]).getAttribute("cx")) + attachRef.offSet.x) * attachRef.scale.x + attachRef.state.translation.x - this.state.translation.x;
                    const yPos = (Number(attachRef.node.current.querySelector("#" + this.highlightID.ids[i]).getAttribute("cy")) + attachRef.offSet.y) * attachRef.scale.y + attachRef.state.translation.y - this.state.translation.y;

                    this.attachTo.set(this.refArray[i].id, {id: this.highlightID.ids[i], ref: attachRef});

                    if (typeof attachRef.connectPart === "function") {
                        attachRef.connectPart(this.highlightID.ids[i], this.refArray[i].id, this);
                    }
                    this.moveConnector(this.refArray[i].ref.current.node, xPos, yPos);
                }
            }
        }
	}

    disconnect(event) {
        if (event) {
            if (this.startPoint.current.node === event.relatedTarget && this.attachTo.get("start") !== undefined) {
                if (typeof this.attachTo.get("start").ref.disconnectPart === "function")
                    this.attachTo.get("start").ref.disconnectPart(this.attachTo.get("start").id, this);
                
                this.attachTo.set("start", undefined);
            } else if (this.endPoint.current.node === event.relatedTarget && this.attachTo.get("end") !== undefined) {
                if (typeof this.attachTo.get("end").ref.disconnectPart === "function")
                    this.attachTo.get("end").ref.disconnectPart(this.attachTo.get("end").id, this);
                
                this.attachTo.set("end", undefined);
            } else if ((this.endPoint.current.node === event.relatedTarget && ((this.attachTo.get("start") && this.attachTo.get("start").id !== event.currentTarget.id) || !this.attachTo.get("start")))  ||
                       (this.startPoint.current.node === event.relatedTarget && ((this.attachTo.get("end") && this.attachTo.get("end").id !== event.currentTarget.id) || !this.attachTo.get("start")))) {
                event.currentTarget.setAttribute("filter", "");
            }
        } else {
            if (this.highlightID)
                for (let id of this.highlightID.ids)
                    if (id)
                        this.highlightID.ref.node.current.querySelector("#" + id).setAttribute("filter", "");

            for (let refData of this.refArray) {
                if (this.attachTo.get(refData.id) && typeof this.attachTo.get(refData.id).ref.disconnectPart === "function") {
                    this.attachTo.get(refData.id).ref.disconnectPart(this.attachTo.get(refData.id).id, this);
                }
                this.attachTo.set(refData.id, undefined);
            }
            this.highlightID = undefined;
        }
    }

    movePart(dx, dy) {
        this.setPoints({x: this.state.startPoint.x + dx, y: this.state.startPoint.y + dy}, this.state.endPoint);
        this.setPoints(this.state.startPoint, {x: this.state.endPoint.x + dx, y: this.state.endPoint.y + dy});
    }
    
	moveConnector(connector, xPos, yPos) {
		if (connector === this.startPoint.current.node) {
            this.setState({startPoint: {x: xPos, y: yPos}});
        } else {
            this.setState({endPoint: {x: xPos, y: yPos}});
        }
	}
    
    setPoints(startPoint, endPoint) {
        this.setState({
            startPoint: startPoint,
            endPoint: endPoint
        })
    }

    onMouseEnter(event) {
        event.target.setAttribute("style", "cursor: move");
    }

    onMouseLeave(event) {
        event.target.setAttribute("style", "");
    }

    render() {                        
        return(
            <g ref={this.node} onMouseUp={this.onMouseUp} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <path stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="9" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                <path stroke={this.state.visualColourOuter} strokeWidth="6" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                <path stroke={this.state.visualColourInner} strokeWidth="3" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                
                <Interactable ref={this.startPoint} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsStartPoint}>
                    <ellipse 
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        className="wire start connector" strokeOpacity="0" fillOpacity="0" cx={this.state.startPoint.x} cy={this.state.startPoint.y} rx="2" ry="2"/>
                </Interactable>
                
                <Interactable ref={this.endPoint} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsEndPoint}>
                    <ellipse
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        className="wire end connector" strokeOpacity="0" fillOpacity="0" cx={this.state.endPoint.x} cy={this.state.endPoint.y} rx="2" ry="2"/>
                </Interactable>
            </g>
        );
    }
}