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
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.attachTo = new Map();
    }

    draggableOptionsStartPoint = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                let endPoint = this.endPoint.current.node;

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

                this.setPoints({x: Number(startPoint.getAttribute("cx")), y: Number(startPoint.getAttribute("cy"))},
                               {x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale});
            }
        }
    }

    onDoubleClick() {
        this.props.onDoubleTap(this.getProps());
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "colour") {
            this.setState({colour: value}, this.onDoubleClick);

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

    highlight(event) {
        event.currentTarget.setAttribute("filter", "url(#f3)");
    }

    connect(relatedTarget, currentTarget, attachRef) {
		const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
		const relatedTargetTranslate = regexTranslate.exec(this.node.current.getAttribute("transform"));

		if (relatedTargetTranslate) {
			const xPos = (Number(currentTarget.getAttribute("cx")) + attachRef.offSet.x) * attachRef.scale.x - Number(relatedTargetTranslate[1]) + attachRef.state.translation.x;
			const yPos = (Number(currentTarget.getAttribute("cy")) + attachRef.offSet.y) * attachRef.scale.y - Number(relatedTargetTranslate[5]) + attachRef.state.translation.y;
            
            if (this.startPoint.current.node === relatedTarget && (!this.attachTo.get("end") || this.attachTo.get("end").id !== currentTarget.id)) {
                this.attachTo.set("start", {id: currentTarget.id, ref: attachRef});
                this.moveConnector(relatedTarget, xPos, yPos);

                if (typeof attachRef.connectPart === "function")
                    attachRef.connectPart(currentTarget.id, "start", this);
            } else if (this.endPoint.current.node === relatedTarget && (!this.attachTo.get("start") || this.attachTo.get("start").id !== currentTarget.id)) {
                this.attachTo.set("end", {id: currentTarget.id, ref: attachRef});
                this.moveConnector(relatedTarget, xPos, yPos);

                if (typeof attachRef.connectPart === "function")
                    attachRef.connectPart(currentTarget.id, "end", this);
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
            if (this.attachTo.get("start")) {
                this.attachTo.get("start").ref.node.current.querySelector("#" + this.attachTo.get("start").id).setAttribute("filter", "");

                if (typeof this.attachTo.get("start").ref.disconnectPart === "function") {
                    this.attachTo.get("start").ref.disconnectPart(this.attachTo.get("start").id, this);
                }
            }
             
            if (this.attachTo.get("end")) {
                this.attachTo.get("end").ref.node.current.querySelector("#" + this.attachTo.get("end").id).setAttribute("filter", "");

                if (typeof this.attachTo.get("end").ref.disconnectPart === "function") {
                    this.attachTo.get("end").ref.disconnectPart(this.attachTo.get("end").id, this);
                }
            }
            this.attachTo.set("start", undefined);
            this.attachTo.set("end", undefined);
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
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
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