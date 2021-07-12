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

    highlight(event, attachRef) {
        event.currentTarget.setAttribute("filter", "url(#f3)");
    }

    connect(event, id, attachRef, callback) {
		const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
		const relatedTargetTranslate = regexTranslate.exec(event.relatedTarget.closest(".part").getAttribute("transform"));
		const breadboardTranslate = regexTranslate.exec(event.currentTarget.closest(".part").getAttribute("transform"));

		if (breadboardTranslate && relatedTargetTranslate) {
			const xPos = (Number(event.currentTarget.getAttribute("cx")) + attachRef.offSet.x) * attachRef.scale.x - Number(relatedTargetTranslate[1]) + Number(breadboardTranslate[1]);
			const yPos = (Number(event.currentTarget.getAttribute("cy")) + attachRef.offSet.y) * attachRef.scale.y - Number(relatedTargetTranslate[5]) + Number(breadboardTranslate[5]);
            
            if (this.startPoint.current.node === event.relatedTarget && (!this.attachTo.get("end") || this.attachTo.get("end").id !== id)) {
                this.attachTo.set("start", {id: id, ref: attachRef});
                this.moveConnector(event.relatedTarget, xPos, yPos);

                if (typeof callback === "function")
                    callback(id, "start", this);
            } else if (this.endPoint.current.node === event.relatedTarget && (!this.attachTo.get("start") || this.attachTo.get("start").id !== id)) {
                this.attachTo.set("end", {id: id, ref: attachRef});
                this.moveConnector(event.relatedTarget, xPos, yPos);

                if (typeof callback === "function")
                    callback(id, "end", this);
            }
		}
	}

    disconnect(event, id, callback) {
        if (this.startPoint.current.node === event.relatedTarget && this.attachTo.get("start") !== undefined) {
            this.attachTo.set("start", undefined);

            if (typeof callback === "function")
                callback(id, this);
        } else if (this.endPoint.current.node === event.relatedTarget && this.attachTo.get("end") !== undefined) {
            this.attachTo.set("end", undefined);

            if (typeof callback === "function")
                callback(id, this);
        } else if ((this.endPoint.current.node === event.relatedTarget && this.attachTo.get("start") && this.attachTo.get("start").id !== event.currentTarget.id) ||
                   (this.startPoint.current.node === event.relatedTarget && this.attachTo.get("end") && this.attachTo.get("end").id !== event.currentTarget.id)) {
            event.currentTarget.setAttribute("filter", "");
        }
    }

    movePart(id, dx, dy) {
        if (id === "start") {
            this.setPoints({x: this.state.startPoint.x + dx, y: this.state.startPoint.y + dy}, this.state.endPoint);
        } else if (id === "end") {
            this.setPoints(this.state.startPoint, {x: this.state.endPoint.x + dx, y: this.state.endPoint.y + dy});
        }
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
            <g ref={this.node} onDoubleClick={this.onDoubleClick} className="part" transform={this.props.transform}>
                <path stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="9" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                <path stroke={this.state.visualColourOuter} strokeWidth="6" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                <path stroke={this.state.visualColourInner} strokeWidth="3" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                
                <Interactable ref={this.startPoint} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsStartPoint}>
                    <ellipse 
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        className="wire start connector" strokeOpacity="0" fillOpacity="0" cx={this.state.startPoint.x} cy={this.state.startPoint.y} rx="3.5" ry="3.5"/>
                </Interactable>
                
                <Interactable ref={this.endPoint} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsEndPoint}>
                    <ellipse
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        className="wire end connector" strokeOpacity="0" fillOpacity="0" cx={this.state.endPoint.x} cy={this.state.endPoint.y} rx="3.5" ry="3.5"/>
                </Interactable>
            </g>
        );
    }
}