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
                let endPoint = event.currentTarget.parentNode.getElementsByClassName("end")[0];

                this.setPoints({x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale},
                               {x: Number(endPoint.getAttribute("cx")), y: Number(endPoint.getAttribute("cy"))});
            }
        }
    }

    draggableOptionsEndPoint = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                let startPoint = event.currentTarget.parentNode.getElementsByClassName("start")[0];

                this.setPoints({x: Number(startPoint.getAttribute("cx")), y: Number(startPoint.getAttribute("cy"))},
                               {x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale});
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
                              <ellipse className="wire start connector" stroke="grey" strokeWidth="1.5" strokeOpacity="1" fill="black" cx={this.state.startPoint.x} cy={this.state.startPoint.y} rx="4.5" ry="4.5"/>
                          </Interactable>
        
        this.endPoint = <Interactable draggable={true} draggableOptions={this.draggableOptionsEndPoint}>
                            <ellipse className="wire end connector" stroke="grey" strokeWidth="1.5" strokeOpacity="1" fill="black" cx={this.state.endPoint.x} cy={this.state.endPoint.y} rx="4.5" ry="4.5"/>
                        </Interactable>
                        
        return(
            <CanvasPart draggable={false} transform={this.props.transform}>
                <path stroke="darkred" strokeWidth="6" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                <path stroke="red" strokeWidth="3" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                {this.startPoint}
                {this.endPoint}
            </CanvasPart>
        );
    }
}