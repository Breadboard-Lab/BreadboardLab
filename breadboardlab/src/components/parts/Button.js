import React from "react";
import interact from "interactjs";

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.refConnector = React.createRef();
        
        this.state = {
            type: "Momentary Button",
            name: "Momentary Button",
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 50, y: 50};
        this.offSet = {x: 0.3, y: 0.35};
    }

    componentDidMount() {
        interact(this.node.current.parentNode).styleCursor(false).draggable({
			listeners: {
				move: event => {
                    if (event.currentTarget.classList.contains("connector")) {
                        this.props.movePart(event);
                    } else {
                        const {interaction} = event;
                        interaction.stop();
                        interaction.start({name: "drag"}, event.interactable, this.refConnector.current)
                    }
                }
			},
		})
    }

    onDoubleClick() {
        console.log("test")
        this.props.onDoubleTap(this.getProps());
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        }
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

    snapConnector() {
        // TODO: snap button
    }
    
    render() {
        return(
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(30, 33) scale(90,90)">
                <rect x="-0.3" y="-0.3" width="0.6" height="0.6" rx=".1" fill="#202020" />
                <rect x="-0.27" y="-0.27" width="0.54" height="0.54" rx=".1" fill="#707070" />
                <rect ref={this.refConnector} className="connector" x="-0.2" y="-0.35" width="0.06" height="0.05" fill="#707070" />
                <rect className="connector" x="0.14" y="-0.35" width="0.06" height="0.05" fill="#707070" />
                <rect className="connector" x="-0.2" y="0.3" width="0.06" height="0.05" fill="#707070" />
                <rect className="connector" x="0.14" y="0.3" width="0.06" height="0.05" fill="#707070" />
                <circle cx="0" cy="0" r="0.15" fill="#000000" />
                <circle cx="0" cy="0" r="0.1" fill="#202020" />
                <circle cx="-0.18" cy="-0.18" r="0.03" fill="#202020" />
                <circle cx="0.18" cy="-0.18" r="0.03" fill="#202020" />
                <circle cx="-0.18" cy="0.18" r="0.03" fill="#202020" />
                <circle cx="0.18" cy="0.18" r="0.03" fill="#202020" />
            </g>
        )
    }
}