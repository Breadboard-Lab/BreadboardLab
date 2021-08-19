import React, {Component} from 'react';
import './App.css';
import {
    AppBar,
    CssBaseline,
    IconButton,
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
            isSimulating: false
        }
        this.movePart = this.movePart.bind(this);
        this.moveLead = this.moveLead.bind(this);
        this.addLeadHistory = this.addLeadHistory.bind(this);
        this.addMoveHistory = this.addMoveHistory.bind(this);
        this.updatePropertiesPanel = this.updatePropertiesPanel.bind(this);
        this.canvasNode = React.createRef();

        this.tail = new LinkedListNode();
        this.current = this.tail;
    }

    unselectPart() {
        this.setState({
            hideProperties: true,
            partData: {},
        });
        this.selectedPart.ref.setState({isSelected: false});
        this.selectedPart = undefined;
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress, false);
    }

    handleThemeChange = () => {
        // Switches between dark theme and light theme.
        this.setState(state => ({themeState: !state.themeState}));
        this.setState(state => ({theme: state.themeState ? {...themeDark} : {...themeLight}}))
    };

    handleDrawer = () => {
        // Switches between drawer opened or closed.
        this.setState(state => ({openDrawer: !state.openDrawer}));
    };

    addPart = (part) => {
        this.state.listOfParts.push(part)
        this.setState(state => ({listOfParts: [...state.listOfParts]}));
    };

    handleTool = (event, newTool) => {
        this.setState({selectedTool: newTool});

        if (newTool === "wire_tool")
            this.setState({openDrawer: false});
        else if (newTool === "select_tool")
            this.setState({openDrawer: true});

        App.selectedTool._currentValue = newTool
    };

    handleRotate = () => {
        // Increments selectedPart's rotate state by 15 degrees.
        if (this.selectedPart && typeof this.selectedPart.ref.rotate === "function")
            this.selectedPart.ref.rotate()
    };

    handleDelete = () => {
        /*
            If a part is selected, disconnect & unmount anything important from
            the part then filter remove part from listOfParts and listOfRefs.
         */
        if (this.selectedPart) {
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
            this.unselectPart()
        }
    };

    handleKeyPress = (event) => {
        if (event.key === 'Delete') {
            this.handleDelete()
        }
    }

    handleUndo = () => {
        if (this.current.prev) {
            this.current = this.current.prev;

            if (this.current.undoOptions) {
                switch (this.current.undoOptions.actionType) {
                    case "lead":
                        this.moveLead(this.current.undoOptions.parameters[0], this.current.undoOptions.parameters[1], this.current.undoOptions.parameters[2], this.current.undoOptions.parameters[3]);
                        break;
                    case "move":
                        this.movePart(this.current.undoOptions.parameters[0], this.current.undoOptions.parameters[1], this.current.undoOptions.parameters[2]);
                        break;
                    default:
                        break;
                }
            }
        }
    };

    handleRedo = () => {
        if (this.current.next) {
            this.current = this.current.next;

            if (this.current.redoOptions) {
                switch (this.current.redoOptions.actionType) {
                    case "lead":
                        this.moveLead(this.current.redoOptions.parameters[0], this.current.redoOptions.parameters[1], this.current.redoOptions.parameters[2], this.current.redoOptions.parameters[3]);
                        break;
                    case "move":
                        this.movePart(this.current.redoOptions.parameters[0], this.current.redoOptions.parameters[1], this.current.redoOptions.parameters[2]);
                        break;
                    default:
                        break;
                }
            }
        }
    };

    handleSimulation = () => {
        console.log('handleSimulation clicked. isSimulating:', this.state.isSimulating)
        // console.log(App.listOfRefs._currentValue)

        App.listOfRefs._currentValue.forEach((element) => {
            if (element.state.type === "Breadboard") {
                let temp = element.getCircuits()
                let circuitsGraph = temp[0]
                let firstNode = temp[1]

                console.log(firstNode, circuitsGraph)

                if (!this.state.isSimulating) {
                    console.log("Starting simulation...")
                    /**
                     If element.findCircuits() is not empty:
                     - Unselects any selected parts.
                     - Disable most buttons.
                     - Replace Start button with Stop button.
                     - Hide drawer.
                     - Disable drawer open button.
                     - Simulate.
                     */



                    let totalVoltage = circuitsGraph.getNode(firstNode).data.state.voltage
                    let totalResistance = 0
                    circuitsGraph.forEachNode((node) => {
                        console.log(node.id, node.data);
                        if (node.data.state.type === "Resistor") {
                            totalResistance += this.getResistance(node.data)
                        }
                    });
                    // console.log(totalCurrent, totalVoltage, totalResistance)
                    circuitsGraph.forEachNode((node) => {
                        // console.log(node.id, node.data);
                        this.setCurrent(node.data, totalVoltage, totalResistance)
                    });

                    if (this.selectedPart) {
                        this.unselectPart()
                    }
                    this.setState({
                        isSimulating: !this.state.isSimulating,
                        openDrawer: false
                    })
                } else {
                    console.log("Stopping simulation...")
                    /**
                     If done simulating:
                     - Re-enable most buttons.
                     - Replace Stop button with Start button.
                     - Unhide drawer.
                     - Disable drawer open button.
                     - Reset all components to Off state.
                     */

                    circuitsGraph.forEachNode((node) => {
                        this.setCurrent(node.data, 0, 0)
                    });

                    this.setState({
                        isSimulating: !this.state.isSimulating,
                        openDrawer: true
                    })


                }
            }
        })


    };

    handleShare = () => {
        // TODO handle Share
        console.log('Share clicked')
    };

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

    updatePropertiesPanel(childData) {
        this.setState({
            hideProperties: false,
            partData: childData
        });
    }

    movePart(dx, dy, ref) {
        const scale = this.canvasNode.current.scale;

        if (ref && App.selectedTool._currentValue === "select_tool") {
            if (ref.state.translation.x && ref.state.translation.y) {
                let xPos = ref.state.translation.x + dx * scale;
                let yPos = ref.state.translation.y + dy * scale;

                ref.setState({translation: {x: xPos, y: yPos}});
                return {dx: dx * scale, dy: dy * scale}
            } else {
                ref.setState({translation: {x: 0, y: 0}});
                return {dx: 0, dy: 0}
            }
        } else {
            let viewBox = {...this.canvasNode.current.state.viewBox};
            viewBox.x -= dx * scale;
            viewBox.y -= dy * scale;
            this.canvasNode.current.setViewBox(viewBox);
        }
        return {dx: 0, dy: 0}
    }

    moveLead(dx, dy, ref, propertyName) {
        const scale = this.canvasNode.current.scale;
        let angle = ref.state.rotation * Math.PI / 180;

        ref.setState({
            [propertyName]: {
                x: ref.state[propertyName].x + dx * scale / ref.scale.x * Math.cos(angle) + dy * scale / ref.scale.y * Math.sin(angle),
                y: ref.state[propertyName].y + dy * scale / ref.scale.y * Math.cos(angle) + dx * scale / ref.scale.x * Math.sin(-angle)
            }
        });
    }

    addLeadHistory(dx, dy, ref, propertyName) {
        this.addtoHistory("lead", [dx, dy, ref, propertyName], [-dx, -dy, ref, propertyName]);
    }

    addMoveHistory(dx, dy, ref) {
        this.addtoHistory("move", [dx, dy, ref], [-dx, -dy, ref]);
    }

    addtoHistory(actionType, undoParameters, redoParameters) {
        let newTail = new LinkedListNode();

        this.current.undoOptions.actionType = actionType;
        this.current.undoOptions.parameters = undoParameters;
        this.current.next = newTail;

        newTail.prev = this.current;
        newTail.redoOptions.actionType = actionType;
        newTail.redoOptions.parameters = redoParameters;

        this.tail = newTail;
        this.current = this.tail;
    }

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
                        handlePartSelect={this.handlePartSelect}
                        updatePropertiesPanel={this.updatePropertiesPanel}
                        hideProperties={this.state.hideProperties}
                        partData={this.state.partData}
                    />

                    { /* Canvas */}
                    <div className={classes.canvas}>
                        <Canvas ref={this.canvasNode} listOfParts={this.state.listOfParts}/>
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
    constructor(actionType, undoParameters, redoParameters) {
        this.undoOptions = {actionType: actionType, parameters: undoParameters}
        this.redoOptions = {actionType: actionType, parameters: redoParameters}
        this.next = undefined;
        this.prev = undefined;
    }
}

export default withWidth()(withStyles(styles, {withTheme: true})(App));
