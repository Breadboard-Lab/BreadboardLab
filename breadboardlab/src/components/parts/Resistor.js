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
            band1Colour: "#ff0000",
            band2Colour: "#ff0000",
            band3Colour: "#964b00",
            band4Colour: "#cfb53b",
            isSelected: false,
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

    setBandColour(band, value) {
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
        switch (value) {
            case '0':
                this.setState({[band]: '#000'})
                break
            case '1':
                this.setState({[band]: '#964b00'})
                break
            case '2':
                this.setState({[band]: '#ff0000'})
                break
            case '3':
                this.setState({[band]: '#ffa500'})
                break
            case '4':
                this.setState({[band]: '#ffff00'})
                break
            case '5':
                this.setState({[band]: '#9acd32'})
                break
            case '6':
                this.setState({[band]: '#6495ed'})
                break
            case '7':
                this.setState({[band]: '#9400d3'})
                break
            case '8':
                this.setState({[band]: '#a0a0a0'})
                break
            case '9':
                this.setState({[band]: '#fff'})
                break
            case 'gold':
                this.setState({[band]: '#cfb53b'})
                break
            default:
                this.setState({[band]: '#fff'})
        }
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "resistance") {
            this.setState({resistance: value}, this.onDoubleClick);

            if (value.length === 1) {
                // If resistance is 1 digits length
                if (value === '0') {
                    /* If resistor is 0 Ohms, switch to 1 band resistor by setting rest of bands to colour of resistor
                    and band 2 to black */
                    this.setState({band1Colour: '#A08968'})
                    this.setBandColour('band2Colour', '0')
                    this.setState({band3Colour: '#A08968'})
                    this.setState({band4Colour: '#A08968'})
                } else {
                    // If resistor is not 0, change band 1 colour, default band 2 to black and band 3 to gold multiplier
                    this.setBandColour('band1Colour', value[0])
                    this.setBandColour('band2Colour', '0')
                    this.setBandColour('band3Colour', 'gold')
                    this.setBandColour('band4Colour', 'gold')
                }
            } else if (value.length === 2) {
                // If resistance is 2 digits length, default band 3 to black
                this.setBandColour('band1Colour', value[0])
                this.setBandColour('band2Colour', value[1])
                this.setBandColour('band3Colour', '0')
                this.setBandColour('band4Colour', 'gold')

            } else if (value.length > 2) {
                // If resistance is n digits length greater than 2
                this.setBandColour('band1Colour', value[0])
                this.setBandColour('band2Colour', value[1])
                this.setBandColour('band3Colour', value.slice(2).length.toString())
                this.setBandColour('band4Colour', 'gold')
            } else {
                // If resistance is undefined, default to 0 Ohm resistor
                this.setState({band1Colour: '#A08968'})
                this.setBandColour('band2Colour', '0')
                this.setState({band3Colour: '#A08968'})
                this.setState({band4Colour: '#A08968'})
            }
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
                        propName: "Resistance",
                        propType: "textfield",
                        value: this.state.resistance,
                        adornment: 'Ω',
                        type: 'number'
                    },
                ]
            }

        )
    }

    render() {
        return (
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(100,105), scale(200,150)">
                <path fill="#A08968" d="M -0.5 -0.435 c 0.025 0 0.036 0.053 0.053 0.053 h 0.028 c 0.009 -0.005 0.017 -0.007 0.021 -0.007 h 0.071 h 0.043 
                    c 0.009 0.005 0.017 0.007 0.021 0.007 h 0.028 c 0.018 0 0.028 -0.053 0.053 -0.053 v -0.036 c -0.025 0 -0.036 -0.053 -0.053 -0.053 h -0.027 c -0.005 0 -0.012 0.002 -0.021 0.007 h -0.122
                    c 0 0 -0.005 -0.002 -0.014 -0.007 h -0.029 c -0.018 0 -0.028 0.053 -0.052 0.053z"/>
                <path fill={this.state.band1Colour}
                      d="M-0.447-0.382c0.009,0.005,0.019,0.005,0.028,0v-0.143c-0.009-0.005-0.019-0.005-0.028,0"/>
                <path fill={this.state.band2Colour} d="M-0.378-0.389h0.025v-0.129h-0.025"/>
                <path fill={this.state.band3Colour} d="M-0.325-0.389H-0.3v-0.129h-0.025"/>
                <path fill={this.state.band4Colour}
                      d="M-0.261-0.382c0.009,0.005,0.019,0.005,0.028,0v-0.143c-0.009-0.005-0.019-0.005-0.028,0"/>
                <path fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="0.015" strokeMiterlimit="50" strokeLinecap="round" strokeLinejoin="round" d="M -0.5 -0.435 c 0.025 0 0.036 0.053 0.053 0.053 h 0.028 c 0.009 -0.005 0.017 -0.007 0.021 -0.007 h 0.071 h 0.043
                    c 0.009 0.005 0.017 0.007 0.021 0.007 h 0.028 c 0.018 0 0.028 -0.053 0.053 -0.053 v -0.036 c -0.025 0 -0.036 -0.053 -0.053 -0.053 h -0.027 c -0.005 0 -0.012 0.002 -0.021 0.007 h -0.122
                    c 0 0 -0.005 -0.002 -0.014 -0.007 h -0.029 c -0.018 0 -0.028 0.053 -0.052 0.053z"/>
            </g>
        )
    }
}