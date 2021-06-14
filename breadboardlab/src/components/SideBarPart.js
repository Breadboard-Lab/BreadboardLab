import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import {
    SvgIcon,
    ListItem,
    ListItemAvatar, ListItemText, ListItemSecondaryAction
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ReactDOM from "react-dom";
import Interactable from "./Interactable";
import CanvasPart from "./CanvasPart";

let index = 0;
let svg;

export default class SideBarPart extends React.Component {
    added = false;
    listening = false;

    addPart = (e, event, interaction) => {
        let newPart = <CanvasPart name={this.props.name} ref={node => this.node = node} key={index} index={index}>{this.props.part}</CanvasPart>;
        let hoverElement = document.elementFromPoint(e.pageX || e.touches[0].pageX, e.pageY || e.touches[0].pageY);
        let element = hoverElement.parentNode;

        while (element) {
            // Reason for '==' and NOT '===': Changing HTML in console
            if (element == svg) {
                if (!this.added || e.touches) {
                    window.removeEventListener("mousemove", this.mousemove);
                    window.removeEventListener("touchmove", this.mousemove);
                    index += 1;
                    this.props.ondrag(newPart);
                    this.listening = false;
                    this.added = true;
                }               
                break;
            }
            element = element.parentNode
        }
        if (this.added) {
            console.log("start")
            interaction.start({name: "drag"}, event.interactable, ReactDOM.findDOMNode(newPart._self.node));
        }
    }

    draggingOptions = {
        manualStart: true,
        listeners: {
            move: (event) => {
                if (event.target) {
                    let element = event.target.getElementsByTagName("g")[0];
                    const regexTranslate = /translate\((([\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([\d]+)?(\.[\d]+)?)(px)?\)/i;
                    const regexScale = /scale\((([\d]+)?(\.[\d]+)?),?[\s]?(([\d]+)?(\.[\d]+)?)\)/i;
                    const scale = regexScale.exec(element.getAttribute("transform"));
    
                    svg.addEventListener("mousemove", logKey);
                    window.addEventListener("touchmove", logKey);
                    let transform = element.getAttribute("transform");
    
                    if (transform && scale)
                        element.setAttribute("transform", transform.replace(regexTranslate, `translate(${Number(scale[1]) / 2}, ${Number(scale[4]) / 2})`));
                }
                
                // Get cursor location
                function logKey(e) {
                    svg.removeEventListener("mousemove", logKey);
                    window.addEventListener("touchend", () => {
                        window.removeEventListener("touchmove", logKey);
                    });

                    let pos = svg.createSVGPoint();
                    const rect = event.target.getBoundingClientRect();
                    pos.x = (e.clientX || e.touches[0].clientX ) - rect.width / 2;
                    pos.y = (e.clientY || e.touches[0].clientY) - rect.height / 2;
                    var cursorpt = pos.matrixTransform(svg.getScreenCTM().inverse());

                    event.target.setAttribute("transform", `translate(${cursorpt.x.toPrecision(5)}, ${cursorpt.y.toPrecision(5)})`);
                }
            },
            end: () => {
                this.mousedown = false;
                this.added = false;
            }
        }
    }

    ondown = () => {
        this.mousedown = true;
    }

    onmove = (event) => {
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
            <Interactable draggable={true} draggableOptions={this.draggingOptions} onmove={this.onmove} ondown={this.ondown}>
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