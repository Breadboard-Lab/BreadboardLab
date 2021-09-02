import React, {Component} from 'react';
import './App.css';
import {
    AppBar,
    CssBaseline,
    IconButton, Menu, MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    withStyles, withWidth,
} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles'
import clsx from "clsx";
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from './components/Drawer';
import themeDark from './themes/themeDark';
import themeLight from './themes/themeLight';
import Canvas from './components/Canvas';
import AppbarToolsCollapseMenu from "./components/appbars/AppbarToolsCollapseMenu";
import AppbarSettingsCollapseMenu from "./components/appbars/AppbarSettingsCollapseMenu";
import AppbarToolsMenu from "./components/appbars/AppbarToolsMenu";
import AppbarSettingsMenu from "./components/appbars/AppbarSettingsMenu";
import {getCircuits} from "./utils/getPaths";
import createGraph from "ngraph.graph";

const drawerWidth = 240;
const listOfRefs = React.createContext([]);
const partKey = React.createContext(0);
const selectedTool = React.createContext("select_tool");

const styles = theme => ({
    root: {
        display: 'flex',
        height: '100%'
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        marginTop: 48
    },
    appBarShift: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }
    },
    menuHide: {
        display: 'none',
    },
    canvas: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    title: {
        flexGrow: 1,
    },
});

class App extends Component {
    static listOfRefs = listOfRefs;
    static partKey = partKey;
    static selectedTool = selectedTool;

    constructor(props) {
        super(props)
        this.state = {
            openDrawer: true,
            listOfParts: [],
            themeState: true,
            selectedTool: 'select_tool',
            theme: {...themeDark},
            hideProperties: true,
            partData: {},
            isSimulating: false,
            mouseX: null,
            mouseY: null,
            circuitsGraph: createGraph(),
            cycles: [],
            rootNode: null
        }
        this.movePart = this.movePart.bind(this);
        this.moveLead = this.moveLead.bind(this);
        this.getDimensions = this.getDimensions.bind(this);
        this.checkConnected = this.checkConnected.bind(this);
        this.addLeadHistory = this.addLeadHistory.bind(this);
        this.addMoveHistory = this.addMoveHistory.bind(this);
        this.addAddPartHistory = this.addAddPartHistory.bind(this);
        this.addDeletePartHistory = this.addDeletePartHistory.bind(this);
        this.updatePropertiesPanel = this.updatePropertiesPanel.bind(this);
        this.canvasNode = React.createRef();

        this.tail = new LinkedListNode();
        this.current = this.tail;
    }

    /**
     * Unselects part and hides the properties panel
     *
     * @callback callback - Function to callback when unselecting part
     * @param {callback}
     */
    unselectPart(callback) {
        this.setState({
            hideProperties: true,
            partData: {},
        });
        this.selectedPart.ref.setState({isSelected: false}, callback);
        this.selectedPart = undefined;
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress, false);
    }

    /**
     * Switches between dark theme and light theme.
     */
    handleThemeChange = () => {
        this.setState(state => ({themeState: !state.themeState}));
        this.setState(state => ({theme: state.themeState ? {...themeDark} : {...themeLight}}))
    };

    /**
     * Switches between drawer opened or closed.
     */
    handleDrawer = () => {
        this.setState(state => ({openDrawer: !state.openDrawer}));
    };

    /**
     * Adds part to the canvas
     *
     * @param {React.ReactElement} part - Part to be added
     */
    addPart = (part) => {
        this.state.listOfParts.push(part)
        this.setState(state => ({listOfParts: [...state.listOfParts]}));
    };

    /**
     * Selects tool:
     * - Wire tool: Places only wires
     * - Select tool: Adds/move parts
     *
     * @param {Event} event - Event fired
     * @param {string} newTool - Tool to be selected
     */
    handleTool = (event, newTool) => {
        this.setState({selectedTool: newTool});

        if (newTool === "wire_tool")
            this.setState({openDrawer: false});
        else if (newTool === "select_tool")
            this.setState({openDrawer: true});

        App.selectedTool._currentValue = newTool
    };

    /**
     *  Increments the selected part's rotate state by 15 degrees.
     */
    handleRotate = () => {
        if (this.selectedPart && typeof this.selectedPart.ref.rotate === "function")
            this.selectedPart.ref.rotate()
    };

    /**
     * If a part is selected, disconnect & unmount anything important from
     * the part then filter remove part from listOfParts and listOfRefs.
     */
    handleDelete = () => {
        if (this.selectedPart) {
            this.addDeletePartHistory(this.selectedPart.ref, this.state.listOfParts.find(part => part.key === this.selectedPart.ref._reactInternals.key), this.selectedPart.ref.attachTo, this.selectedPart.ref.connectedParts);

            if (typeof this.selectedPart.ref.disconnect === "function")
                this.selectedPart.ref.disconnect();

            let newListOfParts = this.state.listOfParts.filter(part => {
                return part.key !== this.selectedPart.ref._reactInternals.key
            });
            App.listOfRefs._currentValue = App.listOfRefs._currentValue.filter(ref => {
                return ref !== this.selectedPart.ref
            });

            this.setState({listOfParts: newListOfParts});

            // Unselects deleted part
            this.unselectPart();
        }
    };

    /**
     * Fires different commands based on keyboard input
     *
     * @param {Event} event - Event fired
     */
    handleKeyPress = (event) => {
        if (event.key === 'Delete') {
            this.handleDelete()
        } else if (event.key === "z" && event.ctrlKey) {
            this.handleUndo();
        } else if (event.key === "y" && event.ctrlKey) {
            this.handleRedo();
        }
    }

    /**
     * Undoes the most recent action
     *
     * Valid actions:
     * - Lead movements
     * - Part movements
     * - Adding parts
     * - Deleting parts
     */
    handleUndo = () => {
        if (this.current.prev) {
            this.current = this.current.prev;

            if (this.current.undoOptions) {
                let ref = App.listOfRefs._currentValue[Number(this.current.undoOptions.parameters[2])];

                switch (this.current.undoOptions.actionType) {
                    case "lead":
                        this.moveLead(this.current.undoOptions.parameters[0], this.current.undoOptions.parameters[1], ref, this.current.undoOptions.parameters[3], () => {
                            ref.disconnect();

                            this.current.undoOptions.connectedParts.forEach((value, key) => {
                                if (value) {
                                    let connectedRef = App.listOfRefs._currentValue[Number(value.ref._reactInternals.key)];
                                    ref.highlight(connectedRef);
                                    ref.connect(connectedRef);
                                }
                            });
                        });
                        break;
                    case "move":
                        this.movePart(this.current.undoOptions.parameters[0], this.current.undoOptions.parameters[1], ref, () => {
                            if (!ref.connectedParts)
                                ref.disconnect();
                            else
                                ref.connectedParts.forEach((value, key) => {
                                    this.movePart(this.current.undoOptions.parameters[0], this.current.undoOptions.parameters[1], value.ref)
                                });

                            this.current.undoOptions.connectedParts.forEach((value, key) => {
                                if (value) {
                                    let connectedRef = App.listOfRefs._currentValue[Number(value.ref._reactInternals.key)];
                                    ref.highlight(connectedRef);
                                    ref.connect(connectedRef);
                                }
                            });
                        });
                        break;
                    case "add":
                        if (typeof this.current.undoOptions.parameters[0].disconnect === "function") {
                            this.current.undoOptions.parameters[0].disconnect();
                        }

                        let updatePartsLists = () => {
                            let newListOfParts = this.state.listOfParts.filter(part => part.key !== this.current.undoOptions.parameters[1].key);
                            App.listOfRefs._currentValue = App.listOfRefs._currentValue.filter(ref => Number(ref._reactInternals.key) !== Number(this.current.undoOptions.parameters[0]._reactInternals.key));

                            this.setState({listOfParts: newListOfParts});
                        }

                        if (this.selectedPart && this.selectedPart.ref === this.current.undoOptions.parameters[0]) {
                            this.unselectPart(() => {
                                updatePartsLists();
                            });
                        } else {
                            updatePartsLists();
                        }
                        break;
                    case "delete":
                        let newListOfParts = [...this.state.listOfParts];
                        let part = React.cloneElement(this.current.undoOptions.parameters[1], {
                            key: this.current.undoOptions.parameters[1].key,
                            ref: node => this.node = node
                        });
                        newListOfParts.splice(this.current.undoOptions.parameters[1].key, 0, part);

                        this.setState({listOfParts: newListOfParts}, () => {
                            this.current.next.redoOptions.parameters[0] = this.node;
                            App.listOfRefs._currentValue.splice(this.current.undoOptions.parameters[0]._reactInternals.key, 0, this.node);
                            this.node.setState(this.current.undoOptions.parameters[0].state, () => {
                                this.current.undoOptions.connectedParts.forEach((value, key) => {
                                    if (value) {
                                        let connectedRef = App.listOfRefs._currentValue[Number(value.ref._reactInternals.key)];
                                        this.node.highlight(connectedRef);
                                        this.node.connect(connectedRef);
                                    }
                                });
                            });
                            this.node.setState({isSelected: false});
                            this.current.undoOptions.parameters[0] = this.node;
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    };

    /**
     * Redoes the most recent action
     *
     * Valid actions:
     * - Lead movements
     * - Part movements
     * - Adding parts
     * - Deleting parts
     */
    handleRedo = () => {
        if (this.current.next) {
            this.current = this.current.next;

            if (this.current.redoOptions) {
                let ref = App.listOfRefs._currentValue[Number(this.current.redoOptions.parameters[2])];
                switch (this.current.redoOptions.actionType) {
                    case "lead":
                        this.moveLead(this.current.redoOptions.parameters[0], this.current.redoOptions.parameters[1], ref, this.current.redoOptions.parameters[3], () => {
                            ref.disconnect();

                            this.current.redoOptions.connectedParts.forEach((value, key) => {
                                if (value) {
                                    let connectedRef = App.listOfRefs._currentValue[Number(value.ref._reactInternals.key)];
                                    ref.highlight(connectedRef);
                                    ref.connect(connectedRef);
                                }
                            });
                        });
                        break;
                    case "move":
                        this.movePart(this.current.redoOptions.parameters[0], this.current.redoOptions.parameters[1], ref, () => {
                            if (!ref.connectedParts)
                                ref.disconnect();
                            else
                                ref.connectedParts.forEach((value, key) => {
                                    this.movePart(this.current.undoOptions.parameters[0], this.current.undoOptions.parameters[1], value.ref);
                                });

                            this.current.redoOptions.connectedParts.forEach((value, key) => {
                                if (value) {
                                    let connectedRef = App.listOfRefs._currentValue[Number(value.ref._reactInternals.key)];
                                    ref.highlight(connectedRef);
                                    ref.connect(connectedRef);
                                }
                            });
                        });
                        break;
                    case "add":
                        let newListOfParts = [...this.state.listOfParts];
                        let part = React.cloneElement(this.current.redoOptions.parameters[1], {
                            key: this.current.redoOptions.parameters[1].key,
                            ref: node => this.node = node
                        });
                        newListOfParts.splice(this.current.redoOptions.parameters[1].key, 0, part);

                        this.setState({listOfParts: newListOfParts}, () => {
                            this.current.prev.undoOptions.parameters[0] = this.node;
                            App.listOfRefs._currentValue.splice(this.current.redoOptions.parameters[0]._reactInternals.key, 0, this.node);
                            this.node.setState(this.current.redoOptions.parameters[0].state, () => {
                                this.current.redoOptions.connectedParts.forEach((value, key) => {
                                    if (value) {
                                        let connectedRef = App.listOfRefs._currentValue[Number(value.ref._reactInternals.key)];
                                        this.node.highlight(connectedRef);
                                        this.node.connect(connectedRef);
                                    }
                                });
                            });
                            this.node.setState({isSelected: false});
                            this.current.redoOptions.parameters[0] = this.node;
                        });
                        break;
                    case "delete":
                        if (typeof this.current.redoOptions.parameters[0].disconnect === "function") {
                            this.current.redoOptions.parameters[0].disconnect();
                        }

                        let updatePartsLists = () => {
                            let newListOfParts = this.state.listOfParts.filter(part => part.key !== this.current.redoOptions.parameters[1].key);
                            App.listOfRefs._currentValue = App.listOfRefs._currentValue.filter(ref => Number(ref._reactInternals.key) !== Number(this.current.redoOptions.parameters[0]._reactInternals.key));

                            this.setState({listOfParts: newListOfParts});
                        }

                        if (this.selectedPart && this.selectedPart.ref === this.current.redoOptions.parameters[0]) {
                            this.unselectPart(() => {
                                updatePartsLists();
                            });
                        } else {
                            updatePartsLists();
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    };

    /**
     * Handles the on/off simulation
     * When turned on, a undirected graph will be produced and will detect any cycles that starts with a battery (power) and ends with a battery (ground).
     * If a cycle has been detected, the voltage, resistace and current will be calculated and "turn on" all the components in the cycle
     */
    handleSimulation = () => {
        console.log('handleSimulation clicked.')

        // try {
        //     App.listOfRefs._currentValue.forEach((element) => {
        //         if (element.state.type === "Breadboard") {
        //             let temp = element.getCircuits()
        //             this.setState({
        //                 circuitsGraph: temp.graph,
        //                 rootNode: temp.batteryKey,
        //                 cycles: getPaths(temp.graph, temp.batteryKey)
        //             }, () => {

        //                 if (this.state.isSimulating) {
        //                     this.startSim()
        //                 } else {
        //                     this.stopSim()
        //                 }
        //             })
        //         }
        //     });
        // } catch (err) {
        //     console.log(err)
        // }

        this.setState({
            isSimulating: !this.state.isSimulating,
            openDrawer: !this.state.openDrawer
        }, () => {
            if (this.state.isSimulating) {
                let circuit = createGraph();
                let listOfBatteries = [];
                App.listOfRefs._currentValue.forEach((element, index) => {
                    if (!circuit.getNode(element._reactInternals.key)) {
                        circuit.addNode(element._reactInternals.key, element);
                    }

                    if (element.state.type === "Battery") {
                        listOfBatteries.push(circuit.getNode(element._reactInternals.key));
                    }

                    if (element.attachTo) {
                        element.attachTo.forEach((attachedPart, key) => {
                            if (attachedPart) {
                                if (attachedPart.ref.state.type === "Breadboard") {
                                    attachedPart.ref.getConnectedComponents(attachedPart.id, element).forEach((connectedPart) => {
                                        if (!(connectedPart.id === "ground" || key === "ground")) {
                                            if (!circuit.getNode(connectedPart.ref._reactInternals.key))
                                                circuit.addNode(connectedPart.ref._reactInternals.key, connectedPart.ref);
                                            circuit.addLink(element._reactInternals.key, connectedPart.ref._reactInternals.key);
                                        }
                                    })
                                } else if (!(attachedPart.id === "ground" || key === "ground")) {
                                    if (!circuit.getNode(attachedPart.ref._reactInternals.key))
                                        circuit.addNode(attachedPart.ref._reactInternals.key, attachedPart.ref);
                                    circuit.addLink(element._reactInternals.key, attachedPart.ref._reactInternals.key);
                                }
                            }
                        });
                    }
                });

                this.setState({
                    circuit: circuit,
                    cycles: getCircuits(circuit, listOfBatteries)
                }, () => {
                    this.startSim();
                })
            } else {
                this.stopSim();
            }
        })
    };

    /**
     * Iterates through the cycles and calculates the voltage, resistance and current
     */
    startSim = () => {
        console.log("Starting simulation...");

        if (this.selectedPart) {
            this.unselectPart()
        }

        for (let cycle of this.state.cycles) {
            let voltage = this.state.circuit.getNode(cycle[0]).data.state.voltage;
            let totalResistance = 0;
            let buttonPass = true

            for (let i = 1; i < cycle.length; i++) {
                let node = this.state.circuit.getNode(cycle[i]);

                if (node.data.state.type === "Resistor") {
                    totalResistance += this.getResistance(node.data);
                }
                if (node.data.state.isToggled === true) {
                    buttonPass = false
                }
                if (node.data.state.isPressed === false) {
                    buttonPass = false
                }
            }

            for (let i = 1; i < cycle.length; i++) {
                let node = this.state.circuit.getNode(cycle[i]);
                if (buttonPass) {
                    this.setCurrent(node.data, voltage, totalResistance);
                } else {
                    this.setCurrent(node.data, 0, 0);
                }
            }
            console.log(cycle)
        }
    }

    /**
     * Transveres the graph and sets the current to zero for all components
     */
    stopSim = () => {
        this.state.circuit.forEachNode((node) => {
            this.setCurrent(node.data, 0, 0)
        });
        console.log("Stopping simulation...")
    }

    handleShare = () => {
        // TODO handle Share
        console.log('Share clicked')
    };

    /**
     * Selects and highlights the part and displays the part's relevant information in the properties panel
     *
     * @param {Object} childData - Object containing the part's data
     */
    handlePartSelect = (childData) => {
        if (!childData.ref.state.isSelected) {
            this.setState({
                hideProperties: false,
                partData: childData
            });

            if (this.selectedPart) {
                this.selectedPart.ref.setState({isSelected: false});
            }
            childData.ref.setState({isSelected: true}, () => {
                this.selectedPart = childData;
            });
        } else {
            this.unselectPart();
        }
    }

    handlePartToggle = (childData) => {
        if (this.state.isSimulating) {
            // console.log(childData.ref)
            this.startSim()
        }
    }

    handlePartDown = (childData) => {
        if (this.state.isSimulating) {
            // console.log(childData.ref)
            this.startSim()
        }
    }

    /**
     * Updates the properties panel based on the Object given
     *
     * @param {Object} childData - Object containing the part's data
     */
    updatePropertiesPanel(childData) {
        this.setState({
            hideProperties: false,
            partData: childData
        });
    }

    /**
     * Moves part based on dx and dy. Scaling is applied to the distance to be moved.
     *
     * @param {Number} dx - Distance to move on the x-axis
     * @param {Number} dy - Distance to move on the y-axis
     * @param {React.RefObject} ref - Ref to the react element
     *
     * @returns {Object} Distance moved on the x-axis and y-axis with canvas scaling applied
     *
     * @callback callback - Callback function when moving part
     * @param {callback}
     */
    movePart(dx, dy, ref, callback) {
        const scale = this.canvasNode.current.scale;
        if (ref && App.selectedTool._currentValue === "select_tool") {
            if (ref.state.translation.x !== undefined && ref.state.translation.y !== undefined) {
                let xPos = ref.state.translation.x + dx * scale;
                let yPos = ref.state.translation.y + dy * scale;

                ref.setState({translation: {x: xPos, y: yPos}}, callback);
                return {dx: dx * scale, dy: dy * scale}
            } else {
                ref.setState({translation: {x: 0, y: 0}}, callback);
                return {dx: 0, dy: 0}
            }
        } else if (App.selectedTool._currentValue === "wire_tool") {
            let viewBox = {...this.canvasNode.current.state.viewBox};
            viewBox.x -= dx * scale;
            viewBox.y -= dy * scale;
            this.canvasNode.current.setViewBox(viewBox);
        }
        return {dx: 0, dy: 0}
    }

    /**
     * Moves lead based on dx and dy. Scaling is applied to the distance to be moved.
     *
     * @param {Number} dx - Distance to move on the x-axis
     * @param {Number} dy - Distance to move on the y-axis
     * @param {React.RefObject} ref - Ref to the react element
     * @param {string} propertyName - The name of the lead
     *
     * @callback callback - Callback function when moving lead
     * @param {callback}
     */
    moveLead(dx, dy, ref, propertyName, callback) {
        const scale = this.canvasNode.current.scale;
        const refScale = ref.scale || {x: 1, y: 1};
        let angle = ref.state.rotation * Math.PI / 180;

        ref.setState({
            [propertyName]: {
                x: ref.state[propertyName].x + dx * scale / refScale.x * Math.cos(angle) + dy * scale / refScale.y * Math.sin(angle),
                y: ref.state[propertyName].y + dy * scale / refScale.y * Math.cos(angle) + dx * scale / refScale.x * Math.sin(-angle)
            }
        }, callback);
    }

    /**
     * Determines the bounding box based on SVG coordinates. The width/height is the actual width/height of the element, not the bounding box
     *
     * @param {object} element - The SVG element to act on
     * @param {Number} angle - Angle of rotation the element is in
     *
     * @returns {object} Returns the dimensions of the element
     */
    getDimensions(element, angle) {
        let t = angle || 0;
        let point = this.canvasNode.current.node.current.createSVGPoint();
        const matrix = element.getCTM();

        point.x = element.getBBox().x;
        point.y = element.getBBox().y;
        const XY = point.matrixTransform(matrix);

        point.x = element.getBBox().x + element.getBBox().width;
        point.y = element.getBBox().y + element.getBBox().height;
        const RB = point.matrixTransform(matrix);

        return {
            x: XY.x,
            y: XY.y,
            left: XY.x,
            right: RB.x,
            top: XY.y,
            bottom: RB.y,
            width: Math.abs((RB.x - XY.x) * Math.cos(t) + (RB.y - XY.y) * Math.sin(t)),
            height: Math.abs((RB.y - XY.y) * Math.cos(t) + (RB.x - XY.x) * Math.sin(-t))
        }
    }

    /**
     * Checks if a component can be attached or not
     *
     * @param {React.RefObject} ref - Ref to the react element to check if it can be attached to the component
     * @param {React.RefObject} attachRef - Ref to the react element to check if it can be connected to
     * @param {string} connectorPosition - If given, it will check where to take the coordinate of the connectors/leads. Default is the center of the connectors/leads
     *
     * @returns {object[]} A list of ids to each of the connectors/leads that can be attached to the component
     */
    checkConnected(ref, attachRef, connectorPosition) {
        let elementID = [];
        let connectors = Array.prototype.slice.call(attachRef.connectors);

        if (connectors) {
            for (let refData of ref.refArray) {
                let element = (refData.ref.current.node) ? refData.ref.current.node : refData.ref.current;
                let found = false;

                for (let connector of connectors) {
                    let rect1 = element.getBoundingClientRect();
                    let rect2 = connector.getBoundingClientRect();
                    let overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);

                    if (overlap) {
                        let t = attachRef.state.rotation * Math.PI / 180;
                        let point = document.getElementById("AppSVG").createSVGPoint();
                        let breadboardDim = this.getDimensions(connector, t);

                        point.x = breadboardDim.x + breadboardDim.width / 2 * Math.cos(t) + breadboardDim.height / 2 * Math.sin(-t);
                        point.y = breadboardDim.y + breadboardDim.width / 2 * Math.sin(t) + breadboardDim.height / 2 * Math.cos(t);
                        const svgBreadboard = point.matrixTransform(document.getElementById("AppSVG").getScreenCTM().inverse());

                        t = ref.state.rotation * Math.PI / 180;
                        let connectorDim = this.getDimensions(element, t);

                        switch (connectorPosition) {
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
                            if (attachRef.connectedParts && (attachRef.connectedParts.get(connector.id) === undefined || attachRef.connectedParts.get(connector.id).ref === ref)) {
                                found = true;
                                elementID.push(connector.id);
                                break;
                            }
                        }
                    }
                }
                if (!found)
                    elementID.push(undefined);
            }
        }
        return elementID;
    }

    /**
     * Adds to history when a lead has been moved
     *
     * @param {Number} dx - Distance moved on the x-axis
     * @param {Number} dy - Distance moved on the y-axis
     * @param {string} key - Key of the react element
     * @param {string} propertyName - The name of the lead
     * @param {Map} attachedParts - Parts that have been attached initially
     * @param {Map} connectedParts - Parts that have been connected initially
     */
    addLeadHistory(dx, dy, key, propertyName, attachedParts, connectedParts) {
        this.addtoHistory("lead", [dx, dy, key, propertyName], [-dx, -dy, key, propertyName], attachedParts);
    }

    /**
     * Adds to history when a part has been moved
     *
     * @param {Number} dx - Distance moved on the x-axis
     * @param {Number} dy - Distance moved on the y-axis
     * @param {string} key - Key of the react element
     * @param {Map} attachedParts - Parts that have been attached initially
     * @param {Map} connectedParts - Parts that have been connected initially
     */
    addMoveHistory(dx, dy, key, attachedParts, connectedParts) {
        this.addtoHistory("move", [dx, dy, key], [-dx, -dy, key], attachedParts);
    }

    /**
     * Adds to history when a part has been added to the canvas
     *
     * @param {React.RefObject} ref - Ref to the react element
     * @param {React.ReactElement} reactElement - React element that have been added
     * @param {Map} attachedParts - Parts that have been attached
     * @param {Map} connectedParts - Parts that have been connected
     */
    addAddPartHistory(ref, reactElement, attachedParts, connectedParts) {
        this.addtoHistory("add", [ref, reactElement], [ref, reactElement], attachedParts)
    }

    /**
     * Adds to history when a part has been deleted to the canvas
     *
     * @param {React.RefObject} ref - Ref to the react element
     * @param {React.ReactElement} reactElement - React element that have been added
     * @param {Map} attachedParts - Parts that have been attached
     * @param {Map} connectedParts - Parts that have been connected
     */
    addDeletePartHistory(ref, reactElement, attachedParts, connectedParts) {
        this.addtoHistory("delete", [ref, reactElement], [ref, reactElement], attachedParts);
    }

    /**
     * Utilizes a link list to preserve history of the canvas. Every action is contained in two nodes (undo node located right behind the redo node)
     *
     * @param {string} actionType - The type of the action
     * @param {*[]} undoParameters - Parameters for undo
     * @param {*[]} redoParameters - Parameters for redo
     * @param {*} connectedParts - Parts to consider when reattaching/reconnecting
     */
    addtoHistory(actionType, undoParameters, redoParameters, connectedParts) {
        let newTail = new LinkedListNode();
        this.current.undoOptions.actionType = actionType;
        this.current.undoOptions.parameters = undoParameters;
        this.current.undoOptions.connectedParts = new Map(connectedParts);
        this.current.next = newTail;

        newTail.prev = this.current;
        newTail.redoOptions.actionType = actionType;
        newTail.redoOptions.parameters = redoParameters;
        newTail.redoOptions.connectedParts = new Map(connectedParts);

        this.tail = newTail;
        this.current = this.tail;
    }

    handleContextMenu = (event) => {
        event.preventDefault();
        this.setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    handleContextMenuClose = (event) => {
        console.log("handleContextMenuClose() called.")
        let selectedContextMenuItem = event.currentTarget.innerText
        console.log("selected part:", this.selectedPart)
        console.log("selected menu item:", selectedContextMenuItem)
        if (this.selectedPart) {
            let pos = this.state.listOfParts.findIndex((part) => {
                return part.key === this.selectedPart.ref._reactInternals.key
            })
            console.log("selected part index:", pos)
            switch (selectedContextMenuItem) {
                case "Send To Back":
                    // TODO send Selected Part to beginning of array, update this.state.listOfParts and App.listOfRefs._currentValue
                    break
                case "Send Backward":
                    // TODO move Selected Part to one index back (if not already at beginning), update this.state.listOfParts and App.listOfRefs._currentValue
                    break
                case "Bring Forward":
                    // TODO move Selected Part to one index forward (if not already at end), update this.state.listOfParts and App.listOfRefs._currentValue
                    break
                case "Bring To Front":
                    // TODO move Selected Part to end of array, update this.state.listOfParts and App.listOfRefs._currentValue
                    break
                default:
                    console.log("No Context Menu option selected.")

            }
        }

        this.setState({
            mouseX: null,
            mouseY: null,
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <ThemeProvider theme={this.state.theme}>
                <div className={classes.root}>
                    <CssBaseline/>

                    { /* Header Appbar
                            this.props.width
                                Ternary operator checks width and switches between rendering either the regular settings
                                menu or the collapsed settings menu, but not both.
                    */}
                    <AppBar
                        position="fixed"
                        color='secondary'
                    >
                        <Toolbar variant="dense">
                            <Typography variant='h4' className={classes.title}>
                                Breadboard Lab
                            </Typography>
                            {this.props.width < 'xs' ?
                                <AppbarSettingsMenu
                                    handleShare={this.handleShare}
                                    handleThemeChange={this.handleThemeChange}
                                />
                                : <AppbarSettingsCollapseMenu
                                    handleShare={this.handleShare}
                                    handleThemeChange={this.handleThemeChange}
                                />
                            }

                        </Toolbar>
                    </AppBar>

                    { /* Tools Menu Appbar
                            this.props.width
                                Ternary operator checks width and switches between rendering either the regular tools
                                menu or the collapsed tool menu, but not both.

                            @classes appBar, appBarShift
                                Handles appbar width change & animation on drawer open/close.
                    */}
                    <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: this.state.openDrawer,
                        })}
                    >
                        <Toolbar variant="dense">

                            { /* Drawer Controller Button
                                    Hides on Drawer opened
                            */}
                            <Tooltip title="Open Drawer">
                                <IconButton
                                    disabled={this.state.isSimulating || this.state.selectedTool === "wire_tool"}
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={this.handleDrawer}
                                    edge="start"
                                    className={this.state.openDrawer && classes.menuHide}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            </Tooltip>

                            { /* Tools */}
                            {this.props.width < 'xs' ?
                                <AppbarToolsMenu
                                    isSimulating={this.state.isSimulating}
                                    selectedTool={this.state.selectedTool}
                                    handleTool={this.handleTool}
                                    handleRotate={this.handleRotate}
                                    handleDelete={this.handleDelete}
                                    handleUndo={this.handleUndo}
                                    handleRedo={this.handleRedo}
                                    handleSimulation={this.handleSimulation}
                                />
                                : <AppbarToolsCollapseMenu
                                    isSimulating={this.state.isSimulating}
                                    handleTool={this.handleTool}
                                    handleRotate={this.handleRotate}
                                    handleDelete={this.handleDelete}
                                    handleUndo={this.handleUndo}
                                    handleRedo={this.handleRedo}
                                    handleSimulation={this.handleSimulation}
                                />}
                        </Toolbar>
                    </AppBar>

                    { /* Components/Properties Sidebar */}
                    <Drawer
                        open={this.state.openDrawer}
                        handleDrawerClose={this.handleDrawer}
                        addPart={this.addPart}
                        movePart={this.movePart}
                        moveLead={this.moveLead}
                        addLeadHistory={this.addLeadHistory}
                        addMoveHistory={this.addMoveHistory}
                        addAddPartHistory={this.addAddPartHistory}
                        addDeletePartHistory={this.addDeletePartHistory}
                        checkConnected={this.checkConnected}
                        getDimensions={this.getDimensions}
                        handlePartSelect={this.handlePartSelect}
                        handlePartToggle={this.handlePartToggle}
                        handlePartDown={this.handlePartDown}
                        updatePropertiesPanel={this.updatePropertiesPanel}
                        hideProperties={this.state.hideProperties}
                        partData={this.state.partData}
                    />

                    { /* Canvas */}
                    <div className={classes.canvas}>
                        {/*onContextMenu={this.handleContextMenu}
                         style={{cursor: 'context-menu'}}*/}
                        <Canvas ref={this.canvasNode} listOfParts={this.state.listOfParts}/>
                        {/*<Menu
                            keepMounted
                            open={this.state.mouseY !== null}
                            onClose={this.handleContextMenuClose}
                            anchorReference="anchorPosition"
                            anchorPosition={
                                this.state.mouseY !== null && this.state.mouseX !== null
                                    ? {top: this.state.mouseY, left: this.state.mouseX}
                                    : undefined
                            }
                        >
                            <MenuItem onClick={this.handleContextMenuClose}>Send To Back</MenuItem>
                            <MenuItem onClick={this.handleContextMenuClose}>Send Backward</MenuItem>
                            <MenuItem onClick={this.handleContextMenuClose}>Bring Forward</MenuItem>
                            <MenuItem onClick={this.handleContextMenuClose}>Bring To Front</MenuItem>
                        </Menu>*/}
                    </div>

                </div>
            </ThemeProvider>
        );
    }

    /** getResistance
     *      Returns the resistance of a resistor component.
     *
     * @param resistor
     *
     * @returns {number}    The resistance of the resistor.
     */
    getResistance(resistor) {
        let componentUnitPrefix = resistor.state.unit
        let componentResistance = resistor.state.resistance

        switch (componentUnitPrefix) {
            case 'kΩ':
                componentResistance = (componentResistance * 1000)
                break
            case 'MΩ':
                componentResistance = (componentResistance * 1000000)
                break
            default:
                componentResistance = (componentResistance * 1)
        }

        return componentResistance
    }

    /** setCurrent
     *
     * @param component
     * @param voltage
     * @param resistance
     */
    setCurrent(component, voltage, resistance) {
        if (voltage === 0) {
            component.setState({current: 0}, () => {
                if (component.state.type === "LED") {
                    component.setIntensity()
                }
            })
        } else if (component.state.type === "LED") {
            let current = (voltage - component.state.forwardVoltage) / resistance
            component.setState({current: current}, () => {
                component.setIntensity()
            })
        } else {
            let current = voltage / resistance
            component.setState({current: current})
        }
    }
}

class LinkedListNode {
    constructor(actionType, undoParameters, redoParameters, connectedParts) {
        this.undoOptions = {actionType: actionType, parameters: undoParameters, connectedParts: connectedParts}
        this.redoOptions = {actionType: actionType, parameters: redoParameters, connectedParts: connectedParts}
        this.next = undefined;
        this.prev = undefined;
    }
}

export default withWidth()(withStyles(styles, {withTheme: true})(App));
