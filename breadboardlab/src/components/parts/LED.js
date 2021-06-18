import React from "react"

export default class LED extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
    }
    
    render() {
        return(
            <g ref={this.node} transform="translate(10,40), scale(20,20)">
                <path d="M 0 0.8 A 0.7 0.7 90 1 1 0.8 0.8 Z"
                        fill="#a00000" stroke-opacity="0" />
                <circle cx="0.4" cy="0.2" r="0.6" fill="#ff8080" />
                <circle cx="0.4" cy="-0.1" r="0.08" fill="#707070" />
                <circle cx="0.4" cy="0.5" r="0.08" fill="#707070" />
            </g>
        )
    }
}