import React from "react";
import Interactable from "../Interactable";
import CanvasPart from "../CanvasPart";

export default class Wire extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startPoint: this.props.startPoint,
            endPoint: this.props.endPoint
        }
    }

    draggableOptions = {
        listeners: {
            move: (event) => {
               
            }
        }
    }

    render() {
        return(
            <CanvasPart transform={this.props.transform}>
                <path stroke="darkred" strokeWidth="1" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x}  ${this.state.endPoint.y}`}/>
                <path stroke="red" strokeWidth="0.5" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x}  ${this.state.endPoint.y}`}/>
                <Interactable draggable={true} draggableOptions={this.draggableOptions}>
                    <ellipse stroke="darkblue" strokeWidth="0.25" strokeOpacity="1" fill="blue" cx={this.state.startPoint.x} cy={this.state.startPoint.y} rx="0.75" ry="0.75"/>
                </Interactable>
                <ellipse stroke="darkblue" strokeWidth="0.25" strokeOpacity="1" fill="blue" cx={this.state.endPoint.x} cy={this.state.endPoint.y} rx="0.75" ry="0.75"/>
            </CanvasPart>
        );
    }
}