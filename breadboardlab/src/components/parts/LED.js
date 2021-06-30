import React from "react";
import interact from "interactjs";

export default class LED extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        
        this.state = {
            type: "LED",
            name: "LED",
            colour: "Red",
            colourEnabled: true,
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
        }
    }

    getProps() {
        return(
            {
                ref: this,
                callback: this.updateProp,
                props:  [
                    {propName: "Type", propType: "string", value: this.state.type},
                    {propName: "Name", propType: "textfield", value: this.state.name},
                    {propName: "Colour", propType: "select", value: this.state.colour, options: ["Red", "Blue", "Green", "Yellow"]}
                ]
            }

        )
    }
    
    render() {
        return(
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(17,28) scale(40,40)">
                <path d="M 0 0.8 A 0.7 0.7 90 1 1 0.8 0.8 Z"
                        fill="#a00000" strokeOpacity="0" />
                <circle cx="0.4" cy="0.2" r="0.6" fill="#ff8080" />
                <circle cx="0.4" cy="-0.1" r="0.08" fill="#707070" />
                <circle cx="0.4" cy="0.5" r="0.08" fill="#707070" />
            </g>
        )
    }
}