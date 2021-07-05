import React from "react";
import interact from "interactjs";

export default class Resistor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        
        this.state = {
            type: "Resistor",
            name: "Resistor",
            resistance: "220",
            resistanceEnabled: true,
            band1Colour: "#CC0000",
            band2Colour: "#CC0000",
            band3Colour: "#512627",
            band4Colour: "#C08327",
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

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

    changeBandColours(value) {
        /*
            black  == 0 | x1    Ω
            brown  == 1 | x10   Ω
            red    == 2 | x100  Ω
            orange == 3 | x1   kΩ
            yellow == 4 | x10  kΩ
            green  == 5 | x100 kΩ
            blue   == 6 | x1   MΩ
            purple == 7 | x10  MΩ
            grey   == 8 | x100 MΩ
            white  == 9 | x1   GΩ
         */
        /* rough pseudocode:
                get first char of number string
                    switch case char setState band1Colour
                get second char of number string
                    switch case char setState band2Colour
                get third char of number string
                    if len number string is greater than 3rd char index AND
                    if 3rd char is greater than 5
                        switch case char + 1 setState band2Colour
                        (This handles the case where resistance should be rounded to the proper band colour)
                    else
                        switch case char setState band3Colour
         */
        // console.log("resistance", value)
        // First Band
        switch(value[0]) {
            case '0':
                this.setState({band1Colour: '#000'})
                break
            case '1':
                this.setState({band1Colour: '#964B00'})
                break
            case '2':
                this.setState({band1Colour: '#CC0000'})
                break
            case '3':
                this.setState({band1Colour: '#D87347'})
                break
            case '4':
                this.setState({band1Colour: '#E6C951'})
                break
            case '5':
                this.setState({band1Colour: '#528F65'})
                break
            case '6':
                this.setState({band1Colour: '#0F5190'})
                break
            case '7':
                this.setState({band1Colour: '#9400D3'})
                break
            case '8':
                this.setState({band1Colour: '#7D7D7D'})
                break
            case '9':
                this.setState({band1Colour: '#fff'})
                break
            default:
                this.setState({band1Colour: '#000'})
        }
        // Second Band
        switch(value[1]) {
            case '0':
                this.setState({band2Colour: '#000'})
                break
            case '1':
                this.setState({band2Colour: '#964B00'})
                break
            case '2':
                this.setState({band2Colour: '#CC0000'})
                break
            case '3':
                this.setState({band2Colour: '#D87347'})
                break
            case '4':
                this.setState({band2Colour: '#E6C951'})
                break
            case '5':
                this.setState({band2Colour: '#528F65'})
                break
            case '6':
                this.setState({band2Colour: '#0F5190'})
                break
            case '7':
                this.setState({band2Colour: '#9400D3'})
                break
            case '8':
                this.setState({band2Colour: '#7D7D7D'})
                break
            case '9':
                this.setState({band1Colour: '#fff'})
                break
            default:
                this.setState({band2Colour: '#000'})
        }
        // Third Band
        switch(value.slice(2).length) {
            case 0:
                this.setState({band3Colour: '#000'})
                break
            case 1:
                this.setState({band3Colour: '#964B00'})
                break
            case 2:
                this.setState({band3Colour: '#CC0000'})
                break
            case 3:
                this.setState({band3Colour: '#D87347'})
                break
            case 4:
                this.setState({band3Colour: '#E6C951'})
                break
            case 5:
                this.setState({band3Colour: '#528F65'})
                break
            case 6:
                this.setState({band3Colour: '#0F5190'})
                break
            case 7:
                this.setState({band3Colour: '#9400D3'})
                break
            case 8:
                this.setState({band3Colour: '#7D7D7D'})
                break
            case (value.slice(2).length > 9):
                this.setState({band3Colour: '#fff'})
                break
            default:
                this.setState({band3Colour: '#000'})
        }


    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "resistance") {
            this.setState({resistance: value}, this.onDoubleClick);

            this.changeBandColours(value)
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
                    {propName: "Resistance", propType: "textfield", value: this.state.resistance, adornment: 'Ω'},
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
                <path fill={this.state.band1Colour} d="M-0.447-0.382c0.009,0.005,0.019,0.005,0.028,0v-0.143c-0.009-0.005-0.019-0.005-0.028,0"/>
                <path fill={this.state.band2Colour} d="M-0.378-0.389h0.025v-0.129h-0.025"/>
                <path fill={this.state.band3Colour} d="M-0.325-0.389H-0.3v-0.129h-0.025"/>
                <path fill={this.state.band4Colour} d="M-0.261-0.382c0.009,0.005,0.019,0.005,0.028,0v-0.143c-0.009-0.005-0.019-0.005-0.028,0"/>
            </g>
        )
    }
}