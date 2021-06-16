import React from "react";
import Interactable from "./Interactable";
import interact from "interactjs";

export default class CanvasPart extends React.Component {
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
        },
        modifiers: [
            /*
                Snaps object to grid.
                    Modify line 34 x, y to change grid square size.
                    Modify line 37 x, y to change grid center.
             */
            interact.modifiers.snap({
                targets: [
                    interact.snappers.grid({x: 10, y: 10})
                ],
                range: Infinity,
                relativePoints: [{x: 0, y: 0}]
            }),
        ],
    }

    onDoubleTap = event => {
        console.log("Name: " + this.props.name);
        console.log("X-coor: " + event.target.getBoundingClientRect().x);
        console.log("Y-coor: " + event.target.getBoundingClientRect().y);
        console.log(event.type, event.target)
        event.currentTarget.classList.toggle('selected')
        event.preventDefault()
        /* TODO push key to an array of selectedParts
            if selectedParts is not empty
                1. open properties panel with first index/part info
                2. on tool button press; rotate, delete, etc
        */
    }

    render() {
        return(
            <Interactable
                draggable
                draggableOptions={this.draggableOptions}
                onDoubleTap={this.onDoubleTap}
                styleCursor={false}
            >
                <g className={"part"}>
                    { React.Children.toArray(this.props.children).map(c => React.cloneElement(
                        c,
                        {ref: (node) => {this.node = node}},
                    ))}
                </g>
            </Interactable>
        );
    }
}