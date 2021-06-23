import React from "react";
import Interactable from "./Interactable";
import interact from "interactjs";

export default class CanvasPart extends React.Component {
    constructor(props) {
        super(props);
        this.onDoubleTap = this.onDoubleTap.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.mouseDown = false;
    }

    draggableOptions = {
        listeners: {
            move: (event) => {
                const regex = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
                const currentTransform = event.target.getAttribute("transform");
                const transform = regex.exec(currentTransform);

                if (currentTransform && !this.node.onSpecificMove) {
                    if (transform && transform.length > 1) {
                        if (this.node.onAdditionalMove) {
                            this.node.onAdditionalMove(event);
                        }
                        let scale = event.target.parentNode.getAttribute("scale");
                        let xPos = (Number(transform[1]) + event.dx * scale).toPrecision(5);
                        let yPos = (Number(transform[5]) + event.dy * scale).toPrecision(5);
                        
                        event.target.setAttribute("transform", currentTransform.replace(regex, `translate(${xPos}, ${yPos})`));
                    } else {
                        event.target.setAttribute("transform", currentTransform.replace(regex, "translate(0, 0)"));
                    }
                } else if (this.node.onSpecificMove) {
                    this.node.onSpecificMove.function(event)
                } else {
                    event.target.setAttribute("transform", "translate(0, 0)");
                }
            }
        },
        // modifiers: [
        //     /*
        //         Snaps object to grid.
        //             Modify line 34 x, y to change grid square size.
        //             Modify line 37 x, y to change grid center.
        //             Should be in-sync with SideBarPart.js snap grid.
        //      */
        //     interact.modifiers.snap({
        //         targets: [
        //             interact.snappers.grid({x: 50, y: 50})
        //         ],
        //         range: Infinity,
        //         relativePoints: [{x: 0, y: 0}]
        //     }),
        // ],
    }

    onMove = event => {
        const {interaction} = event;
        
        if (interaction.pointerIsDown && !interaction.interacting() && this.mouseDown) {
            if (this.node.onSpecificMove) {
                event.interaction.stop();
                event.interaction.start({name:"drag"}, event.interactable, this.node.onSpecificMove.element)
            }
        }
    }

    onMouseDown() {
        this.mouseDown = true;
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
                onMove={this.onMove}
                onDoubleTap={this.onDoubleTap}
                styleCursor={false}
            >
                <g onMouseDown={this.onMouseDown} className={"part"} transform={this.props.transform}>
                    { React.Children.toArray(this.props.children).map(c => React.cloneElement(
                        c,
                        {ref: (node) => {this.node = node}, addpart: this.props.addPart, partData: this.props.partData},
                    ))}
                </g>
            </Interactable>
        );
    }
}