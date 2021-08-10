import React from "react";
import interact from "interactjs";

export default class NPNTransistor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "NPN Transitor",
            name: "NPN Transitor",
            isSelected: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.scale = {x: 1, y: 1};
        this.offSet = {x: -12.72975, y: -0.5};
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
        this.props.handlePartSelect(this.getProps());
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
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `` : `scale(${this.scale.x} ${this.scale.y}) rotate(${0} ${0} ${0}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <path id="collectorpin" fill="#606161" d="M16.311,63.488c-0.829,0-1.5-0.672-1.5-1.5v-5.352l4.729-4.729v-4.11c0-0.827,0.671-1.5,1.5-1.5
            s1.5,0.673,1.5,1.5v5.353l-4.729,4.729v4.108C17.811,62.816,17.139,63.488,16.311,63.488z"/>
                    <path id="basepin" fill="#606161" d="M32,63.488c-0.829,0-1.5-0.672-1.5-1.5v-14.19c0-0.828,0.671-1.5,1.5-1.5s1.5,0.672,1.5,1.5
            v14.19C33.5,62.816,32.829,63.488,32,63.488z"/>
                    <path id="emitterpin" fill="#606161" d="M47.689,63.488c-0.828,0-1.5-0.672-1.5-1.5V57.88l-4.73-4.729v-5.353c0-0.827,0.672-1.5,1.5-1.5
            s1.5,0.673,1.5,1.5v4.11l4.73,4.729v5.352C49.189,62.816,48.518,63.488,47.689,63.488z"/>

                    <g id="body">
                        <path id="sides" fill="#1F1F1F" d="M50.919,43.899c0,2.154-1.589,3.898-3.548,3.898H16.628c-1.96,0-3.548-1.744-3.548-3.898
                V10.105c0-2.153,1.588-3.899,3.548-3.899h30.743c1.959,0,3.548,1.746,3.548,3.899V43.899z"/>
                        <ellipse id="top" fill="#151515" cx="32" cy="9.96" rx="18.92" ry="9.46"/>
                        <path id="front" fill="#0f0f0f" d="M14.264,13.26v33.526c0.629,0.625,1.452,1.012,2.364,1.012h30.743c0.913,0,1.737-0.387,2.366-1.012V13.26
                H14.264z"/>
                    </g>

                    <g id="labels">
                        <path id="E" fill="#8C8C8C"
                            d="M43.767,43.891h-1.088v1.033h1.303v0.537h-1.99v-3.555h1.984v0.539h-1.297v0.908h1.088V43.891z"/>
                        <path id="B" fill="#8C8C8C" d="M30.879,45.461v-3.555h1.018c0.371,0,0.66,0.08,0.867,0.242s0.31,0.404,0.31,0.727
                c0,0.168-0.037,0.316-0.114,0.447c-0.075,0.131-0.188,0.229-0.335,0.293c0.199,0.041,0.346,0.135,0.443,0.285
                c0.097,0.15,0.145,0.324,0.145,0.525c0,0.34-0.098,0.598-0.296,0.771c-0.197,0.176-0.479,0.264-0.846,0.264H30.879z M31.568,43.41
                h0.361c0.148-0.004,0.261-0.045,0.339-0.125s0.117-0.195,0.117-0.346c0-0.17-0.041-0.295-0.122-0.375s-0.204-0.119-0.366-0.119
                h-0.33V43.41z M31.568,43.887v1.037h0.503c0.15,0,0.263-0.043,0.339-0.127s0.115-0.207,0.115-0.371
                c0-0.17-0.035-0.301-0.105-0.393c-0.07-0.094-0.179-0.143-0.327-0.146h-0.024H31.568z"/>
                        <path id="C" fill="#8C8C8C" d="M22.287,44.357l0.005,0.015c0.006,0.381-0.091,0.666-0.292,0.854
                c-0.201,0.19-0.488,0.284-0.86,0.284c-0.382,0-0.686-0.112-0.911-0.338c-0.225-0.225-0.337-0.545-0.337-0.961v-1.055
                c0-0.413,0.109-0.733,0.326-0.962c0.218-0.229,0.511-0.342,0.88-0.342c0.389,0,0.688,0.095,0.896,0.283s0.309,0.475,0.303,0.856
                l-0.005,0.015h-0.669c0-0.229-0.04-0.387-0.121-0.479c-0.08-0.092-0.215-0.137-0.404-0.137c-0.172,0-0.302,0.063-0.388,0.187
                c-0.086,0.125-0.129,0.315-0.129,0.573v1.059c0,0.26,0.046,0.451,0.139,0.575c0.093,0.125,0.233,0.187,0.42,0.187
                c0.171,0,0.294-0.045,0.369-0.135c0.075-0.091,0.112-0.252,0.112-0.482h0.666V44.357z"/>
                        <path id="N" fill="#8C8C8C" d="M37.291,35.137h-2.893l-4.737-9.525l-0.062,0.01v9.515h-2.892V20.208H29.6l4.738,9.536l0.061-0.01
                v-9.526h2.893V35.137z"/>
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
            </g>
        )
    }
}