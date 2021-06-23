import React from "react";
import interact from "interactjs";

export default class Transistor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.onDoubleTap = this.onDoubleTap.bind(this)
        this.state = {
            type: "Transistor",
            name: "Lorem Ipsum",
        }
        this.scale = {x: 50, y: 50};
        this.offSet = {x: 0.5, y: 0.45};
    }

    componentDidMount() {
        interact(this.node.current.parentNode).styleCursor(false).draggable({
			listeners: {
				move: this.props.movePart
			},
		})
    }

    onDoubleTap() {
        return this.state;
    }

    render() {
        return(
            <g ref={this.node} transform="translate(30,40),scale(50,50)">
                <path d="M -0.48 0.2 A 0.5 0.5 180 1 1 0.48 0.2 Z"
                        fill="#000000" stroke-opacity="0"/>
                <circle cx="-0.3" cy="0" r="0.032" fill="#707070" />
                <circle cx="0" cy="0" r="0.032" fill="#707070" />
                <circle cx="0.3" cy="0" r="0.032" fill="#707070" />
            </g>
        )
    }
}