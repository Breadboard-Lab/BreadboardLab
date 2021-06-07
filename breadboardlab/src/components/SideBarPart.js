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
                const regex = /translate\((([\d]+)(\.[\d]+)?)px, (([\d]+)(\.[\d]+)?)px\)/i;
                const transform = regex.exec(event.target.style.transform);

                if (transform && transform.length > 1) {
                    event.target.style.transform = `translate(${Number(transform[1]) + event.dx}px, ${Number(transform[4]) + event.dy}px)`;
                } else {
                    document.getElementById("AppSVG").addEventListener('mousemove', logKey);

                    function logKey(e) {
                        document.getElementById("AppSVG").removeEventListener('mousemove', logKey);
                        const rect = event.target.getBoundingClientRect();
                        let xPos = e.clientX - rect.width / 2;
                        let yPos = e.clientY - rect.height / 2;
                        event.target.style.transform = `translate(${xPos}px, ${yPos}px)`;
                    }
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