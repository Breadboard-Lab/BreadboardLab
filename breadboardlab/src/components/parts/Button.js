import React from "react";
import interact from "interactjs";

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.onDoubleClick = this.onDoubleClick.bind(this);
        
        this.state = {
            partData: {
                type: "MomentaryButton",
                name: "Lorem Ipsum",
            },
        }
        this.scale = {x: 50, y: 50};
        this.offSet = {x: 0.3, y: 0.35};
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
                    {propName: "Type", propType: "string", value: "MomentaryButton"},
                    {propName: "Name", propType: "textfield", value: "Lorem Ipsum"},
                ]
            }

        )
    }
    
    render() {
        return(
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(30, 33) scale(90,90)">
                <rect x="-0.3" y="-0.3" width="0.6" height="0.6" rx=".1" fill="#202020" />
                <rect x="-0.27" y="-0.27" width="0.54" height="0.54" rx=".1" fill="#707070" />
                <rect className="connector" x="-0.2" y="-0.35" width="0.06" height="0.05" fill="#707070" />
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