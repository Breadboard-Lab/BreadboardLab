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
            unit: "F",
            isSelected: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.scale = {x: 0.65, y: 0.65};
        this.offSet = {x: -3.437, y: -0.563};
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
        } else if (propName.toLowerCase() === "capacitance") {
            if (isNaN(value)) {
                this.setState({unit: value}, this.onDoubleClick)
            } else {
                this.setState({capacitance: value}, this.onDoubleClick);
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
                        propName: "Capacitance",
                        propType: "autocomplete",
                        value: this.state.capacitance,
                        defaultOptions: [
                            {label: "100 farads", value: "100", unit: "F"},
                            {label: "1000 millifarads", value: "1000", unit: "mF"},
                            {label: "10000 microfarads", value: "10000", unit: "μF"},
                        ],
                        units: ["F", "mF", "μF"],
                        selectedUnit: this.state.unit,
                        type: 'number',
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
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `` : `scale(${this.scale.x} ${this.scale.y}) rotate(${this.state.rotation} ${rotatePointX} ${rotatePointY}) translate(${this.offSet.x} ${this.offSet.y})`}>
                <path id="rightpin" fill="#cb6c34" d="M46.799,62.589c0,0.498-0.805,0.911-1.787,0.911l0,0c-0.982,0-1.787-0.411-1.787-0.911
			l-4.338-12.817c0-0.502,5.143-0.908,6.125-0.908l0,0c0.982,0,6.125,0.406,6.125,0.908L46.799,62.589z"/>
                    <path id="leftpin" fill="#019ABF" d="M20.775,62.589c0,0.498-0.8,0.911-1.783,0.911l0,0c-0.986,0-1.787-0.411-1.787-0.911
                l-4.337-12.817c0-0.502,5.138-0.908,6.125-0.908l0,0c0.983,0,6.12,0.406,6.12,0.908L20.775,62.589z"/>
                    <circle id="body" fill="#019ABF" cx="32" cy="29.063" r="28.563"/>
                    <path id="shadows" fill="#018AAC" d="M43.68,55.128c0.147-0.438,0.337-0.865,0.6-1.271c0.004-0.006,0.007-0.013,0.011-0.02
                c-1.12,0.535-2.276,1.005-3.473,1.393c-2.777,0.901-5.739,1.396-8.817,1.396c-3.069,0-6.021-0.49-8.792-1.387
                c-1.205-0.389-2.369-0.862-3.497-1.401c0.004,0.007,0.007,0.015,0.012,0.021c0.262,0.405,0.452,0.832,0.599,1.27
                c1.271,3.763-1.333,8.371-1.333,8.371c0.982,0,1.787-0.411,1.787-0.911l2.178-6.434c2.843,0.949,5.882,1.471,9.045,1.471
                c3.163,0,6.203-0.521,9.047-1.472l2.178,6.435c0,0.5,0.805,0.911,1.787,0.911C45.012,63.5,42.407,58.891,43.68,55.128z"/>
                    <path id="lights" fill="#35ADCA" d="M13.52,12.909c-0.128,0-0.259-0.025-0.385-0.078c-0.508-0.213-0.749-0.795-0.538-1.304
                c0.083-0.2,2.097-4.917,7.324-5.456c0.539-0.061,1.041,0.342,1.097,0.892c0.057,0.549-0.343,1.041-0.892,1.097
                c-4.021,0.414-5.617,4.08-5.683,4.236C14.281,12.678,13.91,12.909,13.52,12.909z"/>
                    <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeMiterlimit="10"
                        d="M60.563,29.063
                C60.563,13.288,47.773,0.5,32,0.5C16.226,0.5,3.438,13.288,3.438,29.063c0,8.527,3.743,16.178,9.669,21.414l4.099,12.112
                c0,0.5,0.8,0.911,1.787,0.911c0.983,0,1.783-0.413,1.783-0.911l2.177-6.437c2.845,0.951,5.884,1.474,9.047,1.474
                c3.164,0,6.203-0.521,9.046-1.474l2.179,6.437c0,0.5,0.805,0.911,1.787,0.911s1.787-0.413,1.787-0.911L50.9,50.471
                C56.823,45.236,60.563,37.588,60.563,29.063z"/>
                </g>
            </g>
        )
    }
}