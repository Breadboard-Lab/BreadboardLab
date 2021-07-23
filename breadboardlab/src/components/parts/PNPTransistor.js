import React from "react";
import interact from "interactjs";

export default class PNPTransistor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "PNP Transitor",
            name: "PNP Transitor",
            isSelected: false,
        }
        //this.scale = {x: 0.65, y: 0.65};
        //this.offSet = {x: 0, y: 0};
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
                <path id="emitterpin" fill="#606161" d="M16.31,63.488c-0.829,0-1.5-0.672-1.5-1.5v-5.351l4.729-4.729v-4.11c0-0.828,0.671-1.5,1.5-1.5
		s1.5,0.672,1.5,1.5v5.353L17.81,57.88v4.108C17.81,62.816,17.139,63.488,16.31,63.488z"/>
                <path id="basepin" fill="#606161" d="M32,63.488c-0.829,0-1.5-0.672-1.5-1.5v-14.19c0-0.828,0.671-1.5,1.5-1.5s1.5,0.672,1.5,1.5
		v14.19C33.5,62.816,32.829,63.488,32,63.488z"/>
                <path id="collectorpin" fill="#606161" d="M47.689,63.488c-0.828,0-1.5-0.672-1.5-1.5V57.88l-4.73-4.729v-5.353c0-0.828,0.672-1.5,1.5-1.5
		s1.5,0.672,1.5,1.5v4.11l4.73,4.729v5.351C49.189,62.816,48.518,63.488,47.689,63.488z"/>

                <g id="body">
                    <path id="sides" fill="#1F1F1F" d="M50.919,43.899c0,2.154-1.589,3.898-3.548,3.898H16.628c-1.96,0-3.548-1.744-3.548-3.898
			V10.105c0-2.153,1.588-3.899,3.548-3.899h30.743c1.959,0,3.548,1.746,3.548,3.899V43.899z"/>
                    <ellipse id="top" fill="#151515" cx="32" cy="9.96" rx="18.92" ry="9.46"/>
                    <path id="front" fill="#0f0f0f" d="M14.264,13.26v33.526c0.629,0.625,1.452,1.012,2.364,1.012h30.743c0.913,0,1.737-0.387,2.366-1.012V13.26
			H14.264z"/>
                </g>

                <g id="labels">
                    <path id="C" fill="#8C8C8C" d="M44.178,44.357l0.006,0.015c0.006,0.381-0.092,0.666-0.293,0.855
			c-0.201,0.19-0.486,0.284-0.859,0.284c-0.383,0-0.686-0.112-0.91-0.338c-0.225-0.225-0.338-0.545-0.338-0.961v-1.055
			c0-0.413,0.109-0.733,0.326-0.961c0.217-0.229,0.51-0.342,0.881-0.342c0.389,0,0.688,0.094,0.895,0.283
			c0.209,0.188,0.311,0.475,0.303,0.856l-0.004,0.015h-0.67c0-0.229-0.039-0.387-0.121-0.479c-0.08-0.092-0.215-0.137-0.402-0.137
			c-0.174,0-0.303,0.063-0.389,0.187c-0.086,0.125-0.129,0.315-0.129,0.573v1.059c0,0.26,0.045,0.451,0.139,0.575
			c0.092,0.125,0.232,0.187,0.42,0.187c0.17,0,0.293-0.045,0.369-0.135c0.074-0.091,0.111-0.252,0.111-0.482H44.178z"/>
                    <path id="B" fill="#8C8C8C" d="M30.879,45.461v-3.555h1.018c0.371,0,0.66,0.08,0.867,0.242s0.31,0.404,0.31,0.727
			c0,0.168-0.037,0.316-0.114,0.447c-0.075,0.131-0.188,0.229-0.335,0.293c0.199,0.041,0.346,0.135,0.443,0.285
			c0.097,0.15,0.145,0.324,0.145,0.525c0,0.34-0.098,0.598-0.296,0.771c-0.197,0.176-0.479,0.264-0.846,0.264H30.879z M31.568,43.41
			h0.361c0.148-0.004,0.261-0.045,0.339-0.125s0.117-0.195,0.117-0.346c0-0.17-0.041-0.295-0.122-0.375s-0.204-0.119-0.366-0.119
			h-0.33V43.41z M31.568,43.887v1.037h0.503c0.15,0,0.263-0.043,0.339-0.127s0.115-0.207,0.115-0.371
			c0-0.17-0.035-0.301-0.105-0.393c-0.07-0.094-0.179-0.143-0.327-0.146h-0.024H31.568z"/>
                    <path id="E" fill="#8C8C8C"
                          d="M21.875,43.891h-1.086v1.033h1.301v0.537H20.1v-3.555h1.985v0.539h-1.296v0.908h1.086V43.891z"/>
                    <path id="P" fill="#8C8C8C" d="M30.185,29.733v5.403h-2.892V20.208h4.994c1.497,0,2.684,0.439,3.559,1.317
			c0.875,0.879,1.313,2.029,1.313,3.451c0,1.429-0.438,2.579-1.313,3.451c-0.875,0.871-2.062,1.307-3.559,1.307H30.185z
			 M30.185,27.467h2.102c0.649,0,1.143-0.232,1.482-0.697c0.338-0.465,0.507-1.056,0.507-1.774c0-0.731-0.169-1.334-0.507-1.81
			c-0.34-0.475-0.833-0.712-1.482-0.712h-2.102V27.467z"/>
                </g>

                <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeLinecap="round"
                      strokeLinejoin="round" strokeMiterlimit="10" d="M50.92,9.96c0-5.224-8.472-9.46-18.92-9.46S13.08,4.736,13.08,9.96
		c0,0.023,0.007,0.046,0.007,0.069c0,0.026-0.007,0.05-0.007,0.076v33.794c0,1.402,0.679,2.62,1.688,3.308
		c0.004,0.002,0.008,0.004,0.012,0.007c0.173,0.116,0.354,0.222,0.545,0.305c0.062,0.027,0.129,0.042,0.192,0.065
		c0.141,0.051,0.28,0.106,0.428,0.139c0.221,0.048,0.448,0.075,0.683,0.075h2.912v4.11l-4.729,4.729v5.351
		c0,0.828,0.671,1.5,1.5,1.5s1.5-0.672,1.5-1.5V57.88l4.729-4.729v-5.353h7.96v14.19c0,0.828,0.671,1.5,1.5,1.5s1.5-0.672,1.5-1.5
		v-14.19h7.959v5.353l4.73,4.729v4.108c0,0.828,0.672,1.5,1.5,1.5s1.5-0.672,1.5-1.5v-5.351l-4.73-4.729v-4.11h2.912
		c0.234,0,0.463-0.027,0.684-0.075c0.139-0.03,0.27-0.083,0.402-0.131c0.073-0.026,0.149-0.043,0.221-0.075
		c0.179-0.077,0.346-0.177,0.509-0.284c0.017-0.011,0.035-0.019,0.051-0.03c0.176-0.12,0.338-0.258,0.491-0.409
		c0.003-0.002,0.006-0.004,0.009-0.007v-0.001c0.721-0.713,1.182-1.735,1.182-2.886V10.105c0-0.024-0.006-0.047-0.007-0.071
		C50.913,10.009,50.92,9.985,50.92,9.96z"/>
            </g>
        )
    }
}