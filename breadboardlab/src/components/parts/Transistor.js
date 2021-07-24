import React from "react";
import interact from "interactjs";

export default class Transistor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        
        this.state = {
            type: "Transistor",
            name: "Transistor",
            isSelected: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 50, y: 50};
        this.offSet = {x: 0.5, y: 0.45};
    }

    componentDidMount() {
        interact(this.node.current).styleCursor(false).draggable({
			listeners: {
				move: event => {
                    this.props.movePart(event, this)
                }
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

    render() {
        let rotatePointX;
        let rotatePointY;

        if (this.node.current) {
            let partBBox = this.node.current.firstChild.getBBox();
            rotatePointX = partBBox.width / 2;
            rotatePointY = partBBox.height / 2;
            
        } else {
            rotatePointX = 0;
            rotatePointY = 0;
        }
        
        return(
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `translate(30,40),scale(50,50)` : `scale(${this.scale.x} ${this.scale.y}) rotate(${this.state.rotation} ${rotatePointX} ${rotatePointY}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <path d="M -0.50 0.22 A 0.525 0.525 90 1 1 0.50 0.22 ZZ"
                        fill="#707070" strokeOpacity="0"/>
                    <path d="M -0.48 0.2 A 0.5 0.5 180 1 1 0.48 0.2 Z"
                        fill="#000000" strokeOpacity="0"/>
                    <circle cx="-0.3" cy="0" r="0.032" fill="#707070" />
                    <circle cx="0" cy="0" r="0.032" fill="#707070" />
                    <circle cx="0.3" cy="0" r="0.032" fill="#707070" />
                    <path d="M -0.50 0.22 A 0.525 0.525 90 1 1 0.50 0.22 ZZ"
                        fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="0.025" strokeMiterlimit="50" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>
        )
    }
}