import React from "react";
import Interactable from "./Interactable";
import ReactDOM from "react-dom";

export default class CanvasPart extends React.Component {
    constructor(props) {
        super(props);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleDoubleClick() {
        let element = ReactDOM.findDOMNode(this);
        console.log("Name: " + this.props.name);
        console.log("X-coor: " + element.getBoundingClientRect().x);
        console.log("Y-coor: " + element.getBoundingClientRect().y);
    }

    draggableOptions = {
        listeners: {
            move(event) {
                const regex = /translate\((([\d]+)(\.[\d]+)?)px, (([\d]+)(\.[\d]+)?)px\)/i;
                const transform = regex.exec(event.target.style.transform);

                if (transform && transform.length > 1) {
                    event.target.style.transform = `translate(${Number(transform[1]) + event.dx}px, ${Number(transform[4]) + event.dy}px)`;
                }
            }
        }
    }

    render() {
        return(
            <Interactable draggable={true} draggableOptions={this.draggableOptions}>
                <g onDoubleClick={() => {this.handleDoubleClick()}} className={"part"}>
                    { React.Children.toArray(this.props.children).map((c, index) => React.cloneElement(
                        c,
                        {ref: (node) => {this.node = node}},
                    ))}
                </g>
            </Interactable>
        );
    }
}