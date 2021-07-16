import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import {
    SvgIcon,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    withWidth,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    withStyles,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Interactable from "./Interactable";
import CloseIcon from '@material-ui/icons/Close';
import App from "../App";
//import interact from "interactjs";


const styles = theme => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

let svg;

class SideBarPart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }
    }

    added = false;
    listening = false;

    addPart = (e, event, interaction) => {
        let xPos = (e.touches !== undefined) ? e.touches[0].clientX : e.clientX;
        let yPos = (e.touches !== undefined) ? e.touches[0].clientY : e.clientY;
        let element = document.elementFromPoint(xPos, yPos);

        while (element) {
            if (element === svg) {
                let part = React.cloneElement(
                    this.props.part,
                    {
                        ref: (node) => this.node = node,
                        addPart: this.props.ondrag,
                        movePart: movePart,
                        onDoubleTap: this.props.onDoubleTap,
                        key: App.partKey._currentValue,
                    }
                );
                window.removeEventListener("mousemove", this.mousemove);
                window.removeEventListener("touchmove", this.mousemove);

                this.props.ondrag(<g key={App.partKey._currentValue} className="part">{part}</g>);
                this.listening = false;
                this.added = true;
                let element = this.node.node.current;
                App.partKey._currentValue++;

                if (element) {
                    if (this.node.scale && this.node.offSet) {
                        let scale = this.node.scale;
                        let offSet = this.node.offSet;

                        element.setAttribute("transform", `translate(${offSet.x * scale.x} ${offSet.y * scale.y}) scale(${scale.x} ${scale.y})`);
                    } else {
                        element.setAttribute("transform", `translate(0 0) scale(1 1)`);
                    }
                    interaction.stop();
                    interaction.start({name: "drag"}, event.interactable, element)
                    App.listOfRefs._currentValue.push(this.node);
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
                let part = this.node.node.current.closest(".part");
                let findConnector = part.querySelector(".connector");

                if (findConnector && !event.currentTarget.classList.contains("connector")) {
                    event.interaction.stop();
                    event.interaction.start({name: "drag"}, event.interactable, findConnector);
                } else {
                    let pos = svg.createSVGPoint();
                    pos.x = event.client.x - part.getBoundingClientRect().width / 2;
                    pos.y = event.client.y - part.getBoundingClientRect().height / 2;
                    let cursorpt = pos.matrixTransform(svg.getScreenCTM().inverse());

                    // Centers rotation on part's center
                    let partBBox = part.getBBox()
                    let rotatePointX = partBBox.x + (partBBox.width/2)
                    let rotatePointY = partBBox.y + (partBBox.height/2)


                    if (cursorpt)
                        // part.setAttribute("transform", `translate(${cursorpt.x} ${cursorpt.y})`);
                        part.setAttribute("transform", `translate(${cursorpt.x} ${cursorpt.y}) rotate(0 ${rotatePointX} ${rotatePointY})`);

                    if (typeof this.node.disconnect === "function")
                        this.node.disconnect()
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

    handleDialog = () => {
        this.setState({open: !this.state.open})
    }

    render() {
        const {classes} = this.props;

        return (
            <Interactable draggable={true} draggableOptions={this.draggingOptions} onMove={this.onMove}
                          onDown={this.onDown}>
                <div className={"part-container"}>
                    <ListItem button>
                        <ListItemAvatar>
                            <SvgIcon viewBox="0 0 64 64" fontSize="large">
                                {this.props.part}
                            </SvgIcon>
                        </ListItemAvatar>
                        {this.props.width < 'xs' ?
                            <>
                                <ListItemText
                                    primary={this.props.name}
                                    primaryTypographyProps={{variant: "body2"}}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={this.handleDialog}>
                                        <InfoIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </> : null}
                    </ListItem>
                    <Dialog aria-labelledby="dialog" open={this.state.open} onClose={this.handleDialog}>
                        <DialogTitle id="dialog-title" onClose={this.handleDialog}>
                            <Typography>{this.props.name}</Typography>
                            <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleDialog}>
                                <CloseIcon/>
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Typography gutterBottom>
                                {this.props.description}
                            </Typography>
                        </DialogContent>
                    </Dialog>
                </div>
            </Interactable>
        );
    }
}

function movePart(event) {
    const scale = svg.getAttribute("scale");
    const part = event.currentTarget.closest(".part");
    const regex = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
    const currentTransform = part.getAttribute("transform");
    const transform = regex.exec(currentTransform);
    
    if (transform) {
        let xPos = Number(transform[1]) + event.dx * scale;
        let yPos = Number(transform[5]) + event.dy * scale;

        // Centers rotation on part's center
        // let partBBox = part.getBBox()
        // let rotatePointX = partBBox.x + (partBBox.width/2)
        // let rotatePointY = partBBox.y + (partBBox.height/2)
        //
        // let rotation = 0;   // TODO adjust rotation on App.js handleRotate


        // part.setAttribute("transform", `translate(${xPos} ${yPos}) rotate(${rotation} ${rotatePointX} ${rotatePointY})`);
        part.setAttribute("transform", `translate(${xPos} ${yPos})`);
        return {dx: event.dx * scale, dy: event.dy * scale}
    } else {
        part.setAttribute("transform", `translate(0 0)`);
        return {dx: 0, dy: 0}
    }
}

export default withWidth()(withStyles(styles)(SideBarPart));