import React from "react";
import interact from "interactjs";

export default class LED extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.onDoubleClick = this.onDoubleClick.bind(this);
        
        this.state = {
            type: "LED",
            name: "Lorem Ipsum",
            colour: "red",
            colourEnabled: true,
        }
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
        console.log("test")
        this.props.onDoubleTap(this.getProps());
    }

    updateProp(props) {
        console.log(props)
    }

    getProps() {
        return(
            {
                callBack: this.updateProp,
                props:  [
                    {propName: "Type", propType: "string", value: "LED"},
                    {propName: "Name", propType: "textfield", value: "Lorem Ipsum"},
                    {propName: "Colour", propType: "select", options: ["Red", "Blue", "Green", "Yellow"]}
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