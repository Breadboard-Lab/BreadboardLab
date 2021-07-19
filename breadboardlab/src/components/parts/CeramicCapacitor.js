import React from "react";
import interact from "interactjs";

export default class CeramicCapacitor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "Ceramic Capacitor",
            name: "Ceramic Capacitor",
            capacitance: "1000",
            isSelected: false,
        }
        this.scale = {x: 0.65, y: 0.65};
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
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "capacitance") {
            this.setState({capacitance: value}, this.onDoubleClick);
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
                        propName: "Capacitance",
                        propType: "textfield",
                        value: this.state.capacitance,
                        adornment: 'F',
                        type: 'number'
                    },
                ]
            }

        )
    }

    render() {
        return (
            <g ref={this.node} onDoubleClick={this.onDoubleClick}>
                <path id="rightpin" fill="#019ABF" d="M46.799,62.589c0,0.498-0.805,0.911-1.788,0.911l0,0c-0.981,0-1.787-0.411-1.787-0.911
		l-4.337-12.817c0-0.503,5.143-0.909,6.124-0.909l0,0c0.983,0,6.125,0.406,6.125,0.909L46.799,62.589z"/>
                <path id="leftpin" fill="#019ABF" d="M20.775,62.589c0,0.498-0.8,0.911-1.783,0.911l0,0c-0.986,0-1.787-0.411-1.787-0.911
		l-4.337-12.817c0-0.503,5.138-0.909,6.125-0.909l0,0c0.983,0,6.12,0.406,6.12,0.909L20.775,62.589z"/>
                <circle id="body" fill="#019ABF" cx="32" cy="29.063" r="28.563"/>
                <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeMiterlimit="10" d="M60.563,29.063C60.563,13.288,47.774,0.5,32,0.5
		S3.438,13.288,3.438,29.063c0,8.527,3.743,16.178,9.669,21.413l4.099,12.113c0,0.5,0.8,0.911,1.787,0.911
		c0.983,0,1.783-0.413,1.783-0.911l2.177-6.436c2.845,0.951,5.884,1.473,9.047,1.473c3.164,0,6.203-0.521,9.046-1.473l2.178,6.436
		c0,0.5,0.806,0.911,1.787,0.911c0.983,0,1.788-0.413,1.788-0.911L50.9,50.47C56.823,45.236,60.563,37.588,60.563,29.063z"/>
            </g>
        )
    }
}