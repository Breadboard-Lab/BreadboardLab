import React from "react";
import interact from "interactjs";
import Interactable from "../Interactable";

export default class LED extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.cathode = React.createRef();
        this.anode = React.createRef();

        this.state = {
            type: "LED",
            name: "LED",
            colour: "Red",
            visualColourOuter: "hsl(0, 100%, 31%)",
            visualColourInner: "hsl(0, 100%, 75%)",
            cathodePoint: {x: 0.1, y: 0.2},
            anodePoint: {x: 0.7, y: 0.2},
            isSelected: false,
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 20, y: 20};
        this.offSet = {x: 0.3, y: 0.5};
        this.attachTo = new Map();
    }

    draggableOptionsCathode = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                this.setState({cathodePoint: {x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale / this.scale.x, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale / this.scale.y}});
            }
        }
    }

    draggableOptionsAnode = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");

                this.setState({anodePoint: {x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale / this.scale.x, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale / this.scale.y}});
            }
        }
    }

    componentDidMount() {
        interact(this.node.current.parentNode).styleCursor(false).draggable({
            listeners: {
                move: this.props.movePart
            },
        })
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

    connect(event, id, attachRef) {
		const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
		const relatedTargetTranslate = regexTranslate.exec(event.relatedTarget.closest(".part").getAttribute("transform"));
		const breadboardTranslate = regexTranslate.exec(event.currentTarget.closest(".part").getAttribute("transform"));

		if (breadboardTranslate && relatedTargetTranslate) {
			const xPos = (Number(event.currentTarget.getAttribute("cx")) + attachRef.offSet.x) * attachRef.scale.x / this.scale.x - this.offSet.x + (Number(breadboardTranslate[1]) - Number(relatedTargetTranslate[1])) / this.scale.x;
			const yPos = (Number(event.currentTarget.getAttribute("cy")) + attachRef.offSet.y) * attachRef.scale.y / this.scale.x - this.offSet.y + (Number(breadboardTranslate[5]) - Number(relatedTargetTranslate[5])) / this.scale.y;
            
            if (this.cathode.current.node === event.relatedTarget && (!this.attachTo.get("anode") || this.attachTo.get("anode").id !== id)) {
                this.attachTo.set("cathode", {id: id, ref: attachRef});
                this.moveConnector(event.relatedTarget, xPos, yPos);

                if (typeof attachRef.connectPart === "function")
                    attachRef.connectPart(id, "cathode", this);
            } else if (this.anode.current.node === event.relatedTarget && (!this.attachTo.get("cathode") || this.attachTo.get("cathode").id !== id)) {
                this.attachTo.set("anode", {id: id, ref: attachRef});
                this.moveConnector(event.relatedTarget, xPos, yPos);

                if (typeof attachRef.connectPart === "function")
                    attachRef.connectPart(id, "anode", this);
            }
		}
	}

    moveConnector(connector, xPos, yPos) {
		if (connector === this.cathode.current.node) {
            this.setState({cathodePoint: {x: xPos, y: yPos}});
        } else {
            this.setState({anodePoint: {x: xPos, y: yPos}});
        }
	}

    movePart(id, dx, dy) {
        const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
		const translate = regexTranslate.exec(this.node.current.closest(".part").getAttribute("transform"));
        
        if (translate) {
            if (this.attachTo.get("cathode") && this.attachTo.get("anode"))
                this.node.current.closest(".part").setAttribute("transform", `translate(${Number(translate[1]) + dx / 2} ${Number(translate[5]) + dy / 2})`);
            else 
                this.node.current.closest(".part").setAttribute("transform", `translate(${Number(translate[1]) + dx} ${Number(translate[5]) + dy})`);
        }
    }

    onMouseEnter(event) {
        event.target.setAttribute("style", "cursor: move");
    }

    onMouseLeave(event) {
        event.target.setAttribute("style", "");
    }

    render() {
        return (
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(17,28) scale(40,40)">
                <path stroke="#707070" strokeWidth="0.16" strokeLinecap="round" d={`M 0.1 0.2 L ${this.state.cathodePoint.x} ${this.state.cathodePoint.y}`}/>
                <path stroke="#707070" strokeWidth="0.16" strokeLinecap="round" d={`M 0.7 0.2 L ${this.state.anodePoint.x} ${this.state.anodePoint.y}`}/>

                <path d="M 0 0.8 A 0.7 0.7 90 1 1 0.8 0.8 Z"
                      fill={this.state.visualColourInner} strokeWidth="0.1" strokeOpacity="1" fillOpacity="0.8"/>
                <path d="M 0 0.8 A 0.7 0.7 90 1 1 0.8 0.8 Z"
                      stroke={this.state.visualColourOuter} strokeWidth="0.1" strokeOpacity="1" fillOpacity="0"/>


                <circle cx="0.1" cy="0.2" r="0.08" fill="#707070"/>
                <circle cx="0.7" cy="0.2" r="0.08" fill="#707070"/>
                <Interactable ref={this.cathode} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsCathode}>
                    <ellipse 
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        className="connector" strokeOpacity="1" fillOpacity="0" cx={this.state.cathodePoint.x} cy={this.state.cathodePoint.y} rx="0.08" ry="0.08"/>
                </Interactable>

                <Interactable ref={this.anode} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsAnode}>
                    <ellipse 
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        className="connector" strokeOpacity="1" fillOpacity="0" cx={this.state.anodePoint.x} cy={this.state.anodePoint.y} rx="0.08" ry="0.08"/>
                </Interactable>

                <path d="M -0.06 0.85 A 0.77 0.77 90 1 1 0.85 0.85 Z"
                      fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="0.075" strokeMiterlimit="50" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        )
    }
}