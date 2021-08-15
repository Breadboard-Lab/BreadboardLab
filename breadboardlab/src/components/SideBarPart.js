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
                        movePart: this.props.movePart,
                        moveLead: this.props.moveLead,
                        addLeadHistory: this.props.addLeadHistory,
                        getDimensions: getDimensions,
                        checkConnected: checkConnected,
                        handlePartSelect: this.props.handlePartSelect,
                        updatePropertiesPanel: this.props.updatePropertiesPanel,
                        key: App.partKey._currentValue,
                    }
                );
                window.removeEventListener("mousemove", this.mousemove);
                window.removeEventListener("touchmove", this.mousemove);

                this.props.ondrag(part);
                this.listening = false;
                this.added = true;
                let element = this.node.node.current;
                App.partKey._currentValue++;

                if (element) {
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
                let part = this.node.node.current;
                let findConnector = part.querySelector(".connector");

                if (findConnector && !event.currentTarget.classList.contains("connector")) {
                    event.interaction.stop();
                    event.interaction.start({name: "drag"}, event.interactable, findConnector);
                } else {
                    let pos = svg.createSVGPoint();
                    pos.x = event.client.x - part.getBoundingClientRect().width / 2;
                    pos.y = event.client.y - part.getBoundingClientRect().height / 2;
                    let cursorpt = pos.matrixTransform(svg.getScreenCTM().inverse());

                    if (cursorpt) {
                        this.node.setState({translation: {x: cursorpt.x, y: cursorpt.y}});
                        this.node.dragged = true;
                    }
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
        let icon = React.cloneElement(this.props.part, {icon: true})

        return (
            <Interactable draggable={true} draggableOptions={this.draggingOptions} onMove={this.onMove}
                          onDown={this.onDown}>
                <div className={"part-container"}>
                    <ListItem button>
                        <ListItemAvatar>
                            <SvgIcon viewBox="0 0 64 64" fontSize="large">
                                {icon}
                            </SvgIcon>
                        </ListItemAvatar>
                        {this.props.width < 'xs' ?
                            <>
                                <ListItemText
                                    primary={this.props.name}
                                    primaryTypographyProps={{variant: "body2"}}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="info" onClick={this.handleDialog}>
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

function getDimensions(element, angle) {
    let t = angle || 0;
    let point = svg.createSVGPoint();
    const matrix = element.getCTM();
    
    point.x = element.getBBox().x;
    point.y = element.getBBox().y;
    const XY = point.matrixTransform(matrix);

    point.x = element.getBBox().x + element.getBBox().width;
    point.y = element.getBBox().y + element.getBBox().height;
    const RB = point.matrixTransform(matrix);

    return {x: XY.x, y: XY.y, left: XY.x, right: RB.x, top: XY.y, bottom: RB.y, width: Math.abs((RB.x - XY.x) * Math.cos(t) + (RB.y - XY.y) * Math.sin(t)), height: Math.abs((RB.y - XY.y) * Math.cos(t) + (RB.x - XY.x) * Math.sin(-t))}
}

function checkConnected(ref, attachRef, connectorPosition) {
    let elementID = [];
    let connectors = Array.prototype.slice.call(attachRef.connectors);

    if (connectors) {
        for (let refData of ref.refArray) {
            let element = (refData.ref.current.node) ? refData.ref.current.node : refData.ref.current;
            
            for (let connector of connectors) {
                let rect1 = element.getBoundingClientRect();
                let rect2 = connector.getBoundingClientRect();
                let overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);

                if (overlap) {
                    let t = attachRef.state.rotation * Math.PI / 180;
                    let point = document.getElementById("AppSVG").createSVGPoint();
                    let breadboardDim = getDimensions(connector, t);

                    point.x = breadboardDim.x + breadboardDim.width / 2 * Math.cos(t) + breadboardDim.height / 2 * Math.sin(-t);
                    point.y = breadboardDim.y + breadboardDim.width / 2 * Math.sin(t) + breadboardDim.height / 2 * Math.cos(t);
                    const svgBreadboard = point.matrixTransform(document.getElementById("AppSVG").getScreenCTM().inverse());

                    t = ref.state.rotation * Math.PI / 180;
                    let connectorDim = getDimensions(element, t);

                    switch(connectorPosition) {
                        case "bottomCentre":
                            point.x = connectorDim.x + connectorDim.width / 2 * Math.cos(t) + connectorDim.height * Math.sin(-t);
                            point.y = connectorDim.y + connectorDim.width / 2 * Math.sin(t) + connectorDim.height * Math.cos(t);
                            break;
                        default:
                            point.x = connectorDim.x + connectorDim.width / 2 * Math.cos(t) + connectorDim.height / 2 * Math.sin(-t);
                            point.y = connectorDim.y + connectorDim.width / 2 * Math.sin(t) + connectorDim.height / 2 * Math.cos(t);
                            break;
                    }
                    const svgConnector = point.matrixTransform(document.getElementById("AppSVG").getScreenCTM().inverse());

                    let radiusX = connector.getBBox().width / 2 * attachRef.scale.x;
                    let radiusY = connector.getBBox().height / 2 * attachRef.scale.y;
                    let ellispeArea = (svgConnector.x - svgBreadboard.x) * (svgConnector.x - svgBreadboard.x) / (radiusX * radiusX) + (svgConnector.y - svgBreadboard.y) * (svgConnector.y - svgBreadboard.y) / (radiusY * radiusY);

                    if (ellispeArea <= 1) {
                        if (attachRef.connectedParts && (attachRef.connectedParts.get(connector.id) === undefined || attachRef.connectedParts.get(connector.id).ref === ref))
                            elementID.push(connector.id);
                        break;
                    }
                }
            }
        }
    }
    return elementID;
}

export default withWidth()(withStyles(styles)(SideBarPart));