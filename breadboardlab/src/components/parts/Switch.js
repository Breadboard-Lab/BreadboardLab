import React from "react";
import interact from "interactjs";

export default class Switch extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "Switch",
            name: "Switch",
            isSelected: false,
            isToggled: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.scale = {x: 0.65, y: 0.65};
        this.offSet = {x: -0.5, y: -15.441};
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);
    }

    componentDidMount() {
        interact(this.node.current).styleCursor(false).draggable({
            listeners: {
                move: (event) => {
                    this.props.movePart(event, this)
                }
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
            <g ref={this.node} onDoubleClick={this.onDoubleClick}  transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `` : `scale(${this.scale.x} ${this.scale.y}) rotate(${0} ${0} ${0}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <path id="pin1" fill="#606161" d="M10.023,47.095c0,0.81-0.657,1.465-1.465,1.465l0,0c-0.809,0-1.465-0.655-1.465-1.465
            L5.628,36.441c0-0.811,2.122-1.466,2.93-1.466l0,0c0.809,0,2.93,0.655,2.93,1.466L10.023,47.095z"/>
                    <path id="pin2" fill="#606161" d="M33.465,47.095c0,0.81-0.656,1.465-1.465,1.465l0,0c-0.809,0-1.465-0.655-1.465-1.465
            L29.07,36.441c0-0.811,2.122-1.466,2.93-1.466l0,0c0.809,0,2.931,0.655,2.931,1.466L33.465,47.095z"/>
                    <path id="pin3" fill="#606161" d="M56.907,47.095c0,0.81-0.655,1.465-1.466,1.465l0,0c-0.81,0-1.465-0.655-1.465-1.465
            l-1.465-10.653c0-0.811,2.12-1.466,2.93-1.466l0,0c0.811,0,2.931,0.655,2.931,1.466L56.907,47.095z"/>
                    <path id="body" fill="#3A3A3A" d="M63.5,35.631c0,3.399-2.251,6.182-5.001,6.182H5.5c-2.75,0-5-2.782-5-6.182V21.622
            c0-3.399,2.25-6.181,5-6.181h52.999c2.75,0,5.001,2.781,5.001,6.181V35.631z"/>
                    <rect id="innerbevel" x="8.558" y="19.197" fill="#141414" width="46.883" height="18.861"/>
                    <rect id="togglebevelbody" x={this.state.isToggled ? "32" : "11.49"} y="21.666" fill="#606161" width="20.376" height="13.919"/>
                    <rect id="togglebevel1" x={this.state.isToggled ? "32" : "11.49"} y="21.666" fill="#707071" width="2.93" height="13.922"/>
                    <rect id="togglebevel2" x={this.state.isToggled ? "37.859" : "17.349"} y="21.665" fill="#707071" width="2.931" height="13.92"/>
                    <rect id="togglebevel3" x={this.state.isToggled ? "43.72" : "23.209"} y="21.666" fill="#707071" width="2.93" height="13.922"/>
                    <rect id="togglebevel4" x={this.state.isToggled ? "49.58" : "29.07"} y="21.665" fill="#707071" width="2.93" height="13.92"/>
                    <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"}  strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="
            M58.499,15.441H5.5c-2.75,0-5,2.781-5,6.181v14.009c0,3.399,2.25,6.182,5,6.182h0.867l0.727,5.282c0,0.81,0.656,1.465,1.465,1.465
            s1.465-0.655,1.465-1.465l0.727-5.282h19.059l0.726,5.282c0,0.81,0.657,1.465,1.465,1.465s1.465-0.655,1.465-1.465l0.727-5.282
            H53.25l0.727,5.282c0,0.81,0.655,1.465,1.465,1.465c0.811,0,1.466-0.655,1.466-1.465l0.727-5.282h0.865
            c2.75,0,5.001-2.782,5.001-6.182V21.622C63.5,18.222,61.249,15.441,58.499,15.441z"/>
                </g>
            </g>
        )
    }
}