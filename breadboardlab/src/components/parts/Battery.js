import React from "react";
import interact from "interactjs";

export default class Battery extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "Battery",
            name: "Battery",
            voltage: "9",
            isSelected: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.scale = {x: 3.5, y: 3.5};
        this.offSet = {x: -2.61, y: -20};
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
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "voltage") {
            this.setState({voltage: value}, this.onDoubleClick);
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
                        propName: "Voltage",
                        propType: "textfield",
                        value: this.state.voltage,
                        adornment: 'V',
                        type: 'number'
                    },
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

        return (
            <g ref={this.node} onDoubleClick={this.onDoubleClick}  transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `` : `scale(${this.scale.x} ${this.scale.y}) rotate(${this.state.rotation} ${rotatePointX} ${rotatePointY}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <path id="powerpin" fill="#ED1F24" d="M63.5,31.887c0,0.493-0.456,0.892-1.02,0.892h-1.527c-0.563,0-1.02-0.399-1.02-0.892l0,0
            c0-0.493,0.457-0.892,1.02-0.892h1.527C63.044,30.995,63.5,31.394,63.5,31.887L63.5,31.887z"/>
                    <path id="groundpin" fill="#000" d="M63.5,36.642c0,0.492-0.456,0.892-1.02,0.892h-1.527c-0.563,0-1.02-0.399-1.02-0.892l0,0
            c0-0.492,0.457-0.892,1.02-0.892h1.527C63.044,35.75,63.5,36.149,63.5,36.642L63.5,36.642z"/>

                    <path id="batterypower" fill="#B7B7B7" d="M59.34,29.509c0,0.657-0.532,1.189-1.188,1.189h-0.595v-7.132h0.595
            c0.656,0,1.188,0.533,1.188,1.189h0.594v4.754H59.34z"/>
                    <path id="batteryground" fill="#B7B7B7" d="M58.151,39.019c0-0.656,0.531-1.188,1.188-1.188h0.594v7.132H59.34
            c-0.657,0-1.188-0.531-1.188-1.188h-0.595v-4.755H58.151z"/>
                    <path id="body1" fill="#353535" d="M2.61,20c-1.164,0-2.11,1.064-2.11,2.377v23.774c0,1.313,0.946,2.377,2.11,2.377h43.06V20H2.61z
            "/>
                    <path id="body2" fill="#D08C50" d="M54.973,20H45.67v28.528h9.303c1.43,0,2.584-1.063,2.584-2.377V22.377
            C57.557,21.064,56.402,20,54.973,20z"/>
                    <path id="powerbar" fill="#1F1F1F" d="M61.717,48.231c0,0.164-0.134,0.297-0.297,0.297h-1.188c-0.164,0-0.298-0.133-0.298-0.297
            V20.298c0-0.165,0.134-0.297,0.298-0.297h1.188c0.163,0,0.297,0.133,0.297,0.297V48.231z"/>
                    <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"}
                        strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="
            M62.48,35.75h-0.764v-2.972h0.764c0.563,0,1.02-0.399,1.02-0.892s-0.456-0.892-1.02-0.892h-0.764V20.298
            c0-0.165-0.134-0.297-0.297-0.297h-1.188c-0.164,0-0.298,0.133-0.298,0.297v4.457H59.34c0-0.656-0.532-1.189-1.188-1.189h-0.595
            v-1.188c0-1.313-1.154-2.377-2.584-2.377H45.67H2.61c-1.164,0-2.11,1.064-2.11,2.377v23.774c0,1.313,0.946,2.377,2.11,2.377h43.06
            h9.303c1.43,0,2.584-1.063,2.584-2.377v-2.378h0.595c0,0.657,0.531,1.188,1.188,1.188h0.594v3.27c0,0.164,0.134,0.297,0.298,0.297
            h1.188c0.163,0,0.297-0.133,0.297-0.297V37.533h0.764c0.563,0,1.02-0.399,1.02-0.892S63.044,35.75,62.48,35.75z"/>
                </g>
            </g>
        )
    }
}