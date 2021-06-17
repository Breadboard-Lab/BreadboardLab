import React from "react";
import Interactable from "./Interactable";
import interact from "interactjs";

export default class CanvasPart extends React.Component {
    constructor(props){
        super(props)
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
        },
        modifiers: [
            /*
                Snaps object to grid.
                    Modify line 34 x, y to change grid square size.
                    Modify line 37 x, y to change grid center.
                    Should be in-sync with SideBarPart.js snap grid.
             */
            interact.modifiers.snap({
                targets: [
                    interact.snappers.grid({x: 50, y: 50})
                ],
                range: Infinity,
                relativePoints: [{x: 0, y: 0}]
            }),
        ],
    }



    render() {
        return(
            <Interactable
                draggable
                draggableOptions={this.draggableOptions}
                onDoubleTap={this.props.onDoubleTap}
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