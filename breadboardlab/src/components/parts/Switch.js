import React from "react";
import interact from "interactjs";

export default class CeramicCapacitor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "Switch",
            name: "Switch",
            isSelected: false,
            isToggled: false
        }
        this.scale = {x: 1, y: 1};
        this.offSet = {x: 0, y: 0};
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);
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

        //For testing purposes:
        this.setState({isToggled: !this.state.isToggled})
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
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
                ]
            }

        )
    }

    render() {
        return (
            <g ref={this.node} onDoubleClick={this.onDoubleClick}>
                <path id="pin1" fill="#707070" d="M17,46.272c0,0.553-0.448,1-1,1l0,0c-0.552,0-1-0.447-1-1L14,39c0-0.553,1.448-1,2-1l0,0
		c0.552,0,2,0.447,2,1L17,46.272z"/>
                <path id="pin2" fill="#707070" d="M33,46.272c0,0.553-0.448,1-1,1l0,0c-0.552,0-1-0.447-1-1L30,39c0-0.553,1.448-1,2-1l0,0
		c0.552,0,2,0.447,2,1L33,46.272z"/>
                <path id="pin3" fill="#707070" d="M49,46.272c0,0.553-0.447,1-1,1l0,0c-0.553,0-1-0.447-1-1L46,39c0-0.553,1.447-1,2-1l0,0
		c0.553,0,2,0.447,2,1L49,46.272z"/>

                <path id="body" fill="#3A3A3A" d="M63.5,37.667c0,2.75-2.25,5-5,5h-53c-2.75,0-5-2.25-5-5V26.333c0-2.75,2.25-5,5-5h53c2.75,0,5,2.25,5,5
			V37.667z"/>
                <rect id="innerbevel" x="16" y="24" fill="#141414" width="32" height="16"/>
                <rect id="togglebevelbody" x={this.state.isToggled ? "32" : "18"} y="26" fill="#606161" width="14"
                      height="12"/>
                <rect id="togglebevel1" x={this.state.isToggled ? "32" : "18"} y="26" fill="#707071" width="2"
                      height="12"/>
                <rect id="togglebevel2" x={this.state.isToggled ? "36" : "22"} y="26" fill="#707071" width="2"
                      height="12"/>
                <rect id="togglebevel3" x={this.state.isToggled ? "40" : "26"} y="26" fill="#707071" width="2"
                      height="12"/>
                <rect id="togglebevel4" x={this.state.isToggled ? "44" : "30"} y="26" fill="#707071" width="2"
                      height="12"/>

                <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeMiterlimit="10"
                      d="M58.5,21.333h-53c-2.75,0-5,2.25-5,5v11.334
		c0,2.75,2.25,5,5,5h9.004L15,46.272c0,0.553,0.448,1,1,1s1-0.447,1-1l0.496-3.605h13.009L31,46.272c0,0.553,0.448,1,1,1
		s1-0.447,1-1l0.496-3.605h13.008L47,46.272c0,0.553,0.447,1,1,1s1-0.447,1-1l0.496-3.605H58.5c2.75,0,5-2.25,5-5V26.333
		C63.5,23.583,61.25,21.333,58.5,21.333z"/>
            </g>
        )
    }
}