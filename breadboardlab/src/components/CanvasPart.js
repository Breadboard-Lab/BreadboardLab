import React from "react";
import Interactable from "./Interactable";
import interact from "interactjs";

export default class CanvasPart extends React.Component {
    constructor(props) {
        super(props);
        this.onDoubleTap = this.onDoubleTap.bind(this);
    }

    draggableOptions = {
        listeners: {
            move: (event) => {
                const regex = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
                const currentTransform = event.target.getAttribute("transform");
                const transform = regex.exec(currentTransform);

                if (transform && transform.length > 1) {
                    let scale = event.target.parentNode.getAttribute("scale");
                    let xPos = (Number(transform[1]) + event.dx * scale).toPrecision(5);
                    let yPos = (Number(transform[5]) + event.dy * scale).toPrecision(5);
                    
                    event.target.setAttribute("transform", currentTransform.replace(regex, `translate(${xPos}, ${yPos})`));

                    if (this.node.connectedParts) {
                        for (let element of this.node.connectedParts) {
                            if (element.getAttribute("transform")) {
                                const elementTransform = regex.exec(element.getAttribute("transform"));
                                xPos = (Number(elementTransform[1]) + event.dx * scale).toPrecision(5);
                                yPos = (Number(elementTransform[5]) + event.dy * scale).toPrecision(5);
    
                                element.setAttribute("transform", elementTransform.replace(regex, `translate(${xPos}, ${yPos})`));
                            } else if (element.getAttribute("cx") && element.getAttribute("cy")) {
                                xPos = (Number(element.getAttribute("cx")) + event.dx * scale).toPrecision(5);
                                yPos = (Number(element.getAttribute("cy")) + event.dy * scale).toPrecision(5);
                                
                                this.node.moveConnector(element, xPos, yPos);
                            }
                        }
                    }
                } else {
                    event.target.setAttribute("transform", currentTransform.replace(regex, "translate(0, 0)"));
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

    onDoubleTap(event) {
        if (this.node.onDoubleTap) {
            this.props.parentCallback(this.node.onDoubleTap());
        }

        event.currentTarget.classList.toggle('selected')
        event.preventDefault();
    }

    render() {
        return(
            <Interactable
                draggable={(this.props.draggable === undefined) ? true : this.props.draggable}
                draggableOptions={this.draggableOptions}
                onDoubleTap={this.onDoubleTap}
                styleCursor={false}
            >
                <g className={"part"} transform={this.props.transform}>
                    { React.Children.toArray(this.props.children).map(c => React.cloneElement(
                        c,
                        {ref: (node) => {this.node = node}, addpart: this.props.addPart, partData: this.props.partData},
                    ))}
                </g>
            </Interactable>
        );
    }
}