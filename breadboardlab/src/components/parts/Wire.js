import React from "react";
import Interactable from "../Interactable";

export default class Wire extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

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

    onMouseEnter(event) {
        event.target.setAttribute("stroke-opacity", "0.5");
        event.target.setAttribute("fill-opacity", "0.5");
        event.target.setAttribute("style", "cursor: move");
    }

    onMouseLeave(event) {
        event.target.setAttribute("stroke-opacity", "0");
        event.target.setAttribute("fill-opacity", "0");
        event.target.setAttribute("fill-opacity", "0");
        event.target.setAttribute("style", "");
    }

    render() {
        this.startPoint = <Interactable styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsStartPoint}>
                              <ellipse onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
                                       className="wire start connector" stroke="grey" strokeWidth="1.5" strokeOpacity="0" fill="black" fillOpacity="0" cx={this.state.startPoint.x} cy={this.state.startPoint.y} rx="3.5" ry="3.5"/>
                          </Interactable>
        
        this.endPoint = <Interactable styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsEndPoint}>
                            <ellipse onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} 
                                     className="wire end connector" stroke="grey" strokeWidth="1.5" strokeOpacity="0" fill="black" fillOpacity="0" cx={this.state.endPoint.x} cy={this.state.endPoint.y} rx="3.5" ry="3.5"/>
                        </Interactable>
                        
        return(
            <g ref={this.node} transform={this.props.transform}>
                <path stroke="darkred" strokeWidth="6" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                <path stroke="red" strokeWidth="3" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                {this.startPoint}
                {this.endPoint}
            </g>
        );
    }
}