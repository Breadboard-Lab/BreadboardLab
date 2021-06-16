import React from "react";
import Interactable from "./Interactable";

export default class CanvasPart extends React.Component {
    constructor(props) {
        super(props);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleDoubleClick() {
        let node = this.node.node ? this.node.node.current : this.node;

        if (this.node.handleDoubleClick)
            this.node.handleDoubleClick();

        console.log("Name: " + this.props.name);
        console.log("X-coor: " + node.getBoundingClientRect().x);
        console.log("Y-coor: " + node.getBoundingClientRect().y);
        console.log(node.classList.toggle('selected'));
        /* TODO push key to an array of selectedParts
            if selectedParts is not empty
                1. open properties panel with first index/part info
                2. on tool button press; rotate, delete, etc
        */
    }

    draggableOptions = {
        listeners: {
            move(event) {
                const regex = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
                const transform = regex.exec(event.target.getAttribute("transform"));

                if (transform && transform.length > 1) {
                    let scale = event.target.parentNode.getAttribute("scale");
                    let xPos = (Number(transform[1]) + event.dx * scale).toPrecision(5);
                    let yPos = (Number(transform[5]) + event.dy * scale).toPrecision(5)
                    event.target.setAttribute("transform", `translate(${xPos}, ${yPos})`);
                } else {
                    event.target.setAttribute("transform", "translate(0, 0)");
                }
            }
        }
    }

    render() {
        return(
            <Interactable draggable={true} draggableOptions={this.draggableOptions} styleCursor={false}>
                <g onDoubleClick={() => {this.handleDoubleClick()}} className={"part"}>
                    { React.Children.toArray(this.props.children).map(c => React.cloneElement(
                        c,
                        {ref: (node) => {this.node = node}},
                    ))}
                </g>
            </Interactable>
        );
    }
}