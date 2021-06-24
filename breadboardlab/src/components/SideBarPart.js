import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import {
    SvgIcon,
    ListItem,
    ListItemAvatar, ListItemText, ListItemSecondaryAction
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Interactable from "./Interactable";
//import interact from "interactjs";

let svg;

export default class SideBarPart extends React.Component {
    added = false;
    listening = false;   

    addPart = (e, event, interaction) => {
        let part = React.cloneElement(this.props.part, {ref: (node) => this.node = node, addPart: this.props.ondrag, movePart: movePart, onDoubleTap: this.props.onDoubleTap});
        let xPos = (e.touches !== undefined) ? e.touches[0].clientX : e.clientX;
        let yPos = (e.touches !== undefined) ? e.touches[0].clientY : e.clientY;
        let hoverElement = document.elementFromPoint(xPos, yPos);
        let element = hoverElement.parentNode;

        while (element) {
            if (element === svg) {
                window.removeEventListener("mousemove", this.mousemove);
                window.removeEventListener("touchmove", this.mousemove);

                this.props.ondrag(<g className="part">{part}</g>);
                this.listening = false;
                this.added = true;
                let element = this.node.node.current;

                if (element) {
                    if (this.node.scale && this.node.offSet) {
                        let scale = this.node.scale;
                        let offSet = this.node.offSet;
                    
                        element.setAttribute("transform", `translate(${offSet.x * scale.x} ${offSet.y * scale.y}) scale(${scale.x} ${scale.y})`);
                    } else {
                        element.setAttribute("transform", `translate(0 0) scale(1 1)`);
                    }
                    interaction.stop();
                    interaction.start({name: "drag"}, event.interactable, element);
                }
                break;
            }
            element = element.parentNode;
        }
    }

    draggingOptions = {
        manualStart: true,
        listeners: {
            move: (event) => {
                let pos = svg.createSVGPoint();
                pos.x = event.client.x - event.rect.width / 2;
                pos.y = event.client.y - event.rect.height / 2;
                var cursorpt = pos.matrixTransform(svg.getScreenCTM().inverse());
            
                if (cursorpt.x && cursorpt.y) {
                    this.node.node.current.parentNode.setAttribute("transform", `translate(${cursorpt.x} ${cursorpt.y})`);
                }
            },
            end: () => {
                this.mousedown = false;
                this.added = false;
            }
        },
        // modifiers: [
        //     /*
        //         Snaps object to grid.
        //             Modify line 104 x, y to change grid square size.
        //             Modify line 107 x, y to change grid center.
        //             Should be in-sync with CanvasPart.js snap grid.
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

    onDown = () => {
        this.mousedown = true;
    }

    onMove = (event) => {
        const {interaction} = event;

        if (interaction.pointerIsDown && !interaction.interacting() && !this.listening && this.mousedown) {
            this.listening = true;
            this.mousemove = (e) => this.addPart(e, event, interaction);
            window.addEventListener("mousemove", this.mousemove);
            window.addEventListener("touchmove", this.mousemove);
        }
    }

    componentDidMount() {
        svg = document.getElementById("AppSVG");

        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", this.mousemove);
            this.added = false;
            this.listening = false;
        });

        window.addEventListener("touchend", () => {
            window.removeEventListener("touchmove", this.mousemove);
            this.added = false;
            this.listening = false;
        });
    }

    render() {
        return (
            <Interactable draggable={true} draggableOptions={this.draggingOptions} onMove={this.onMove} onDown={this.onDown}>
                <div className={"part-container"}>
                    <ListItem button>
                        <ListItemAvatar>
                            <SvgIcon viewBox="0 0 64 64" fontSize="large">
                                {this.props.part}
                            </SvgIcon>
                        </ListItemAvatar>
                        <ListItemText
                            primary={this.props.name}
                            primaryTypographyProps={{variant: "body2"}}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <InfoIcon/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </div>
            </Interactable>
        );
    }
}

function movePart(event) {    
    let scale = svg.getAttribute("scale")
    const regex = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
    const currentTransform = event.currentTarget.getAttribute("transform");
    const transform = regex.exec(currentTransform);
    let xPos = Number(transform[1]) + event.dx * scale;
    let yPos = Number(transform[5]) + event.dy * scale;

    event.currentTarget.setAttribute("transform", `translate(${xPos} ${yPos})`);
    return {dx: event.dx * scale, dy: event.dy * scale}
}