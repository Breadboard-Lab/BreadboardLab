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
        this.setPoints = this.setPoints.bind(this);
    }

    draggableOptionsStartPoint = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");

                this.setPoints({x: this.state.startPoint.x + event.delta.x * scale, y: this.state.startPoint.y + event.delta.y * scale}, this.state.endPoint);
            }
        }
    }

    draggableOptionsEndPoint = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");

                this.setPoints(this.state.startPoint, {x: this.state.endPoint.x + event.delta.x * scale, y: this.state.endPoint.y + event.delta.y * scale});
            }
        }
    }

    setPoints(startPoint, endPoint) {
        this.setState({
            startPoint: startPoint,
            endPoint: endPoint
        })
    }

    render() {
        this.startPoint = <Interactable draggable={true} draggableOptions={this.draggableOptionsStartPoint}>
                              <ellipse stroke="grey" strokeWidth="1.5" strokeOpacity="1" fill="black" cx={this.state.startPoint.x} cy={this.state.startPoint.y} rx="4.5" ry="4.5"/>
                          </Interactable>
        
        this.endPoint = <Interactable draggable={true} draggableOptions={this.draggableOptionsEndPoint}>
                            <ellipse stroke="grey" strokeWidth="1.5" strokeOpacity="1" fill="black" cx={this.state.endPoint.x} cy={this.state.endPoint.y} rx="4.5" ry="4.5"/>
                        </Interactable>
                        
        return(
            <CanvasPart transform={this.props.transform}>
                <path stroke="darkred" strokeWidth="6" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x}  ${this.state.endPoint.y}`}/>
                <path stroke="red" strokeWidth="3" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x}  ${this.state.endPoint.y}`}/>
                {this.startPoint}
                {this.endPoint}
            </CanvasPart>
        );
    }
}