import React from "react";
import InfoIcon from '@material-ui/icons/Info';
import {
    SvgIcon,
    ListItem,
    List,
    ListItemAvatar, ListItemText, ListItemSecondaryAction
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ReactDOM from "react-dom";
import Interactable from "./Interactable";
import CanvasPart from "./CanvasPart";

let childrenRefs = {}
let index = 0;

let setChildRef = index => el => childrenRefs[index] = el;

export default class SideBarPart extends React.Component {
    part = <CanvasPart resetTransform={true} key={index} index={index} name={this.props.name}>{this.props.part}</CanvasPart>

    draggingOptions = {
        manualStart: true,
        listeners: {
            move(event) {
                let element = event.target.getElementsByTagName('g')[0];
                const regexTranslate = /translate\((([\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([\d]+)?(\.[\d]+)?)(px)?\)/i;
                const regexScale = /scale\((([\d]+)?(\.[\d]+)?),?[\s]?(([\d]+)?(\.[\d]+)?)\)/i;
                const scale = regexScale.exec(element.getAttribute("transform"));

                document.getElementById("AppSVG").addEventListener('mousemove', logKey);
                let transform = element.getAttribute("transform");
                element.setAttribute("transform", transform.replace(regexTranslate, `translate(${Number(scale[1]) / 2}, ${Number(scale[4]) / 2})`))
                
                // Get cursor location
                function logKey(e) {
                    let svg = document.getElementById("AppSVG");
                    svg.removeEventListener('mousemove', logKey);
                    let pos = svg.createSVGPoint();
                    const rect = event.target.getBoundingClientRect();
                    pos.x = e.clientX - rect.width / 2;
                    pos.y = e.clientY - rect.height / 2;
                    var cursorpt =  pos.matrixTransform(svg.getScreenCTM().inverse());
                    event.target.setAttribute("transform", `translate(${cursorpt.x}, ${cursorpt.y})`);
                }
            }
        }
    }

    onmove = (event) => {
        const { currentTarget, interaction } = event;	
		if (interaction.pointerIsDown && !interaction.interacting() && currentTarget.style.transform === "") {
            index += 1;
            let newPart = React.cloneElement(this.part, {ref: setChildRef(index), key: index, draggable:true});
            this.props.ondrag(newPart);
		}
		interaction.start({ name: "drag" }, event.interactable, ReactDOM.findDOMNode(childrenRefs[index]));
    }

    render() {
        return(
            <Interactable draggable={true} draggableOptions={this.draggingOptions} onmove={this.onmove}>
                <div className={"part-container"}>
                    <List dense>
                        <ListItem button>
                            <ListItemAvatar>
                                <SvgIcon viewBox='0 0 64 64' fontSize='large'>
                                    {this.props.part}
                                </SvgIcon>
                            </ListItemAvatar>
                            <ListItemText
                                primary={this.props.name}
                                secondary='Lorem Ipsum'
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete">
                                    <InfoIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </div>
            </Interactable>
        );
    }
}