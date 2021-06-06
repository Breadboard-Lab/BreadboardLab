import React from "react";
import ReactDOM from "react-dom";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import Interactable from "./Interactable"

const useStyles = makeStyles(() => ({
    partContainer: {
        width: '125px',
        height: '125px',
        backgroundColor: 'white',
        borderRadius: '5px',
        margin: '5px',
        cursor: 'pointer',
    },
    part: {
        width: '100%',
        height: '100%',
    },
}));

const dragMoveListener = (event) => {
    const regex = /translate\((([\d]+)(\.[\d]+)?)px, (([\d]+)(\.[\d]+)?)px\)/i;
    const transform = regex.exec(event.target.style.transform);

    if (transform && transform.length > 1) {
        event.target.style.transform = `translate(${Number(transform[1]) + event.dx}px, ${Number(transform[4]) + event.dy}px)`;
    } else {
        document.getElementById("AppSVG").addEventListener('mousemove', logKey);

        function logKey(e) {
            let xPos = e.clientX - 125 / 2;
            let yPos = e.clientY - 125 / 2;
            event.target.style.transform = `translate(${xPos}px, ${yPos}px)`;
            document.getElementById("AppSVG").removeEventListener('mousemove', logKey);
        }
    }
}

const draggingOptions = {
    manualStart: true,
    listeners: {
        move(event) {
            dragMoveListener(event);
        }
    }
}

let childrenRefs = {}
let index = 0;

let setChildRef = index => el => childrenRefs[index] = el;

class CanvasPart extends React.Component {
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
                dragMoveListener(event);
            }
        }
    }

    render() {
        return(
            <Interactable draggable={true} draggableOptions={this.draggableOptions}>
                <g onDoubleClick={() => {this.handleDoubleClick()}} className={"part"}>
                    { React.Children.toArray(this.props.children).map((c, index) => React.cloneElement(
                        c,
                        {ref: setChildRef(index)},
                    ))}
                </g>
            </Interactable>
        );
    }
}

function RenderSideBarPart(props) {
    const classes = useStyles();
    
    const part = <CanvasPart key={index} index={index} name={props.name}>{props.part}</CanvasPart>

    const onmove = (event) => {
        const { currentTarget, interaction } = event;	
		if (interaction.pointerIsDown && !interaction.interacting() && currentTarget.style.transform === "") {
            index += 1;
            let newPart = React.cloneElement(part, {ref: setChildRef(index), key: index});
            props.ondrag(newPart);
		}
		interaction.start({ name: "drag" }, event.interactable, ReactDOM.findDOMNode(childrenRefs[index]));
    }
    
    return(
        <Interactable draggable={true} draggableOptions={draggingOptions} onmove={onmove}>
            <div className={clsx(classes.partContainer, "part-container")}>
                <svg style={{width: "100%", height: "100%"}}>
                    {props.part}
                    <text textAnchor="middle" x="50%" y="90%">{props.name}</text>
                </svg>
            </div>
        </Interactable>
    );
}

export default class SideBarPart extends React.Component {
    render() {
        return(<RenderSideBarPart ondrag={this.props.ondrag} part={this.props.part} name={this.props.name} />);
    }
}