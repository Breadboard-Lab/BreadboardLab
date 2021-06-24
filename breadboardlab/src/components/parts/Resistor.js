import React from "react";
import interact from "interactjs";

export default class Resistor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.onDoubleClick = this.onDoubleClick.bind(this);
        
        this.state = {
            type: "Resistor",
            name: "Lorem Ipsum",
            resistance: 220,
            resistanceEnabled: true,
        }
        this.scale = {x: 100, y: 75};
        this.offSet = {x: 0.5, y: 0.53};
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

    updateProp(props) {
        console.log(props)
    }

    getProps() {
        return(
            {
                callBack: this.updateProp,
                props:  [   
                            {propName: "Type", propType: "string", value: "Resistor"},
                            {propName: "Name", propType: "textfield", value: "Lorem Ipsum"},
                            {propName: "Resistance", propType: "select", options: ["220 Ω", "470 Ω", "1 kΩ", "10 kΩ"]}
                        ]
            }
            
        )
    }

    render() {
        return(
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(100,105), scale(200,150)">
                <path fill="#A08968" d="M-0.5-0.435c0.025,0,0.036,0.053,0.053,0.053h0.028c0.009-0.005,0.017-0.007,0.021-0.007h0.071h0.043
                    c0.009,0.005,0.017,0.007,0.021,0.007h0.028c0.018,0,0.028-0.053,0.053-0.053v-0.036c-0.025,0-0.036-0.053-0.053-0.053h-0.027
                    c-0.005,0-0.012,0.002-0.021,0.007h-0.122c0,0-0.005-0.002-0.014-0.007h-0.029c-0.018,0-0.028,0.053-0.053,0.053"/>
                <path fill="#754F3D" d="M-0.447-0.382c0.009,0.005,0.019,0.005,0.028,0v-0.143c-0.009-0.005-0.019-0.005-0.028,0"/>
                <path fill="#0B050F" d="M-0.378-0.389h0.025v-0.129h-0.025"/>
                <path fill="#6C403A" d="M-0.325-0.389H-0.3v-0.129h-0.025"/>
                <path fill="#856E4F" d="M-0.261-0.382c0.009,0.005,0.019,0.005,0.028,0v-0.143c-0.009-0.005-0.019-0.005-0.028,0"/>
            </g>
        )
    }
}