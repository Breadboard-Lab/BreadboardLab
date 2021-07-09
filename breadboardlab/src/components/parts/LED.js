import React from "react";
import interact from "interactjs";
import Interactable from "../Interactable";

export default class LED extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "LED",
            name: "LED",
            colour: "Red",
            visualColourOuter: "hsl(0, 100%, 31%)",
            visualColourInner: "hsl(0, 100%, 75%)",
            isSelected: false,
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 20, y: 20};
        this.offSet = {x: 0.3, y: 0.5};
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

    onMouseEnter(event) {
        event.target.setAttribute("style", "cursor: move");
    }

    onMouseLeave(event) {
        event.target.setAttribute("style", "");
    }

    render() {
        return (
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(17,28) scale(40,40)">
                <path d="M 0 0.8 A 0.7 0.7 90 1 1 0.8 0.8 Z"
                      fill={this.state.visualColourOuter} strokeOpacity="0"/>
                <circle cx="0.4" cy="0.2" r="0.6" fill={this.state.visualColourInner}/>
                {/* <circle cx="0.4" cy="-0.1" r="0.08" fill="#707070"/>
                <circle cx="0.4" cy="0.5" r="0.08" fill="#707070"/> */}
                <path stroke="#707070" strokeWidth="0.16" strokeLinecap="round" d="M 0.4 -0.1 L 0.4 -0.1"/>
                <path stroke="#707070" strokeWidth="0.16" strokeLinecap="round" d="M 0.4 0.5 L 0.4 0.5"/>
                <Interactable styleCursor={false} draggable={true}>
                    <ellipse 
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        strokeOpacity="0" fillOpacity="0" cx="0.4" cy="-0.1" rx="0.08" ry="0.08"/>
                </Interactable>
                <Interactable styleCursor={false} draggable={true}>
                    <ellipse 
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        strokeOpacity="0" fillOpacity="0" cx="0.4" cy="0.5" rx="0.08" ry="0.08"/>
                </Interactable>
                <path d="M 0 0.8 A 0.7 0.7 90 1 1 0.8 0.8 Z"
                      fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="0.075" strokeMiterlimit="50" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        )
    }
}