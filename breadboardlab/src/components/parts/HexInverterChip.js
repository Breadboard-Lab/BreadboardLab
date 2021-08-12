import React from "react";
import interact from "interactjs";

export default class HexInverterChip extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "74HC04",
            name: "Hex NOT Inverter Chip",
            isSelected: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.scale = {x: 1.75, y: 1.75};
        this.offSet = {x: -0.5, y: -17.418};
        this.onMouseUp = this.onMouseUp.bind(this);
        this.updateProp = this.updateProp.bind(this);
    }

    componentDidMount() {
        interact(this.node.current).styleCursor(false).draggable({
            listeners: {
                move: (event) => {
                    this.dragged = true;
                    this.props.movePart(event, this)
                }
            },
        })
    }

    onMouseUp() {
        if (!this.dragged) {
            this.props.handlePartSelect(this.getProps());
        }
        this.dragged = false;
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, () => this.props.updatePropertiesPanel(this.getProps()));
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, () => this.props.updatePropertiesPanel(this.getProps()));
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
            <g ref={this.node} onMouseUp={this.onMouseUp} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `` : `scale(${this.scale.x} ${this.scale.y}) rotate(${0} ${0} ${0}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <g id="pins">
                        <path id="pin_x5F_14" fill="#606262" d="M3,23l1-4.582c0-0.552,0.448-1,1-1s1,0.448,1,1L7,23H3z"/>
                        <path id="pin_x5F_13" fill="#606262" d="M12,23l1-4.582c0-0.552,0.448-1,1-1s1,0.448,1,1L16,23H12z"/>
                        <path id="pin_x5F_12" fill="#606262" d="M21,23l1-4.582c0-0.552,0.448-1,1-1s1,0.448,1,1L25,23H21z"/>
                        <path id="pin_x5F_11" fill="#606262" d="M30,23l1-4.582c0-0.552,0.448-1,1-1s1,0.448,1,1L34,23H30z"/>
                        <path id="pin_x5F_10" fill="#606262" d="M39,23l1-4.582c0-0.552,0.447-1,1-1s1,0.448,1,1L43,23H39z"/>
                        <path id="pin_x5F_9" fill="#606262" d="M48,23l1-4.582c0-0.552,0.447-1,1-1s1,0.448,1,1L52,23H48z"/>
                        <path id="pin_x5F_8" fill="#606262" d="M57,23l1-4.582c0-0.552,0.447-1,1-1s1,0.448,1,1L61,23H57z"/>
                        <path id="pin_x5F_7" fill="#606262" d="M61,41l-1,4.582c0,0.553-0.447,1-1,1s-1-0.447-1-1L57,41H61z"/>
                        <path id="pin_x5F_6" fill="#606262" d="M52,41l-1,4.582c0,0.553-0.447,1-1,1s-1-0.447-1-1L48,41H52z"/>
                        <path id="pin_x5F_5" fill="#606262" d="M43,41l-1,4.582c0,0.553-0.447,1-1,1s-1-0.447-1-1L39,41H43z"/>
                        <path id="pin_x5F_4" fill="#606262" d="M34,41l-1,4.582c0,0.553-0.448,1-1,1s-1-0.448-1-1L30,41H34z"/>
                        <path id="pin_x5F_3" fill="#606262" d="M25,41l-1,4.582c0,0.552-0.447,1-1,1s-1-0.448-1-1L21,41H25z"/>
                        <path id="pin_x5F_2" fill="#606262" d="M16,41l-1,4.582c0,0.552-0.447,1-1,1s-1-0.448-1-1L12,41H16z"/>
                        <path id="pin_x5F_1" fill="#606262" d="M7,41l-1,4.582c0,0.552-0.447,1-1,1s-1-0.448-1-1L3,41H7z"/>
                    </g>
                    <g id="body">
                        <path fill="#303030" d="M63.5,40.999c0,0.553-0.449,1.001-1.002,1.001H1.5c-0.554,0-1-0.448-1-1.001V23c0-0.552,0.446-1,1-1h60.998
            c0.553,0,1.002,0.448,1.002,1V40.999z"/>
                        <path fill="#262626" d="M0.5,28.5C2.433,28.5,4,30.067,4,32s-1.567,3.5-3.5,3.5"/>
                        <circle fill="#262626" cx="5" cy="38" r="1.75"/>
                    </g>
                    <text transform="matrix(1 0 0 1 15.667 34.9219)" fill="#EFEFEF" fontFamily="Roboto" fontSize="10"
                        fontStretch="condensed" fontWeight="bold">74HC04
                    </text>
                    <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeLinecap="round"
                        strokeLinejoin="round" strokeMiterlimit="10" d="
            M62.498,22h-1.717L60,18.418c0-0.552-0.447-1-1-1s-1,0.448-1,1L57.219,22h-5.438L51,18.418c0-0.552-0.447-1-1-1s-1,0.448-1,1
            L48.219,22h-5.438L42,18.418c0-0.552-0.447-1-1-1s-1,0.448-1,1L39.219,22h-5.438L33,18.418c0-0.552-0.448-1-1-1s-1,0.448-1,1
            L30.218,22h-5.437L24,18.418c0-0.552-0.448-1-1-1s-1,0.448-1,1L21.218,22h-5.437L15,18.418c0-0.552-0.448-1-1-1s-1,0.448-1,1
            L12.218,22H6.782L6,18.418c0-0.552-0.448-1-1-1s-1,0.448-1,1L3.218,22H1.5c-0.554,0-1,0.448-1,1v5.5v7v5.499
            C0.5,41.552,0.946,42,1.5,42h1.718L4,45.582c0,0.552,0.447,1,1,1s1-0.448,1-1L6.782,42h5.437L13,45.582c0,0.552,0.447,1,1,1
            s1-0.448,1-1L15.782,42h5.437L22,45.582c0,0.552,0.447,1,1,1s1-0.448,1-1L24.782,42h5.437L31,45.582c0,0.552,0.448,1,1,1
            s1-0.447,1-1L33.781,42h5.438L40,45.582c0,0.553,0.447,1,1,1s1-0.447,1-1L42.781,42h5.438L49,45.582c0,0.553,0.447,1,1,1
            s1-0.447,1-1L51.781,42h5.438L58,45.582c0,0.553,0.447,1,1,1s1-0.447,1-1L60.781,42h1.717c0.553,0,1.002-0.448,1.002-1.001V23
            C63.5,22.448,63.051,22,62.498,22z"/>
                </g>
            </g>
        )
    }
}