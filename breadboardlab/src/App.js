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
    }

    unselectPart() {
        this.setState({
            hideProperties: true,
            partData: {},
        });
        this.selectedPart.ref.setState({isSelected: false});
        this.previousPartState = undefined;
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
        console.log(this.state.selectedTool + " clicked")
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
        // TODO handle undo
        console.log('Undo clicked')
    };

    handleRedo = () => {
        // TODO handle redo
        console.log('Redo clicked')
    };

    handleSimulation = () => {
        console.log('handleSimulation clicked. isSimulating:', this.state.isSimulating)
        // if not simulating, start simulating, else stop simulating.
        if (!this.state.isSimulating) {
            console.log("Starting simulation...")
            App.listOfRefs._currentValue.forEach((element) => {
                //console.log(element.connectedParts)
                if (element.state.type === "Breadboard") {
                    // console.log(element.findCircuits())
                    let circuits = element.findCircuits()
                    /* if element.findCircuits() is not empty
                        - unselects any selected parts
                        - disable most buttons
                        - replace Start button with Stop button
                        - hide drawer
                        - disable drawer open button
                        */

                    for (let i = 0; i < circuits.length; i++){
                        let resistance = this.getResistance(circuits[i])
                        let current = circuits[i][0].state.voltage + resistance
                        this.setCurrent(circuits[i], current)
                    }

                    if (this.selectedPart) {
                        this.unselectPart()
                    }
                    this.setState({
                        isSimulating: !this.state.isSimulating,
                        openDrawer: !this.state.openDrawer
                    })
                }
            })
        } else {
            console.log("Stopping simulation...")
            /*
                if done simulating
                   - re-enable most buttons
                   - replace Stop button with Start button
                   - unhide drawer
                   - disable drawer open button
             */
            this.setState({
                isSimulating: !this.state.isSimulating,
                openDrawer: !this.state.openDrawer
            })
        }


    };

    handleShare = () => {
        // TODO handle Share
        console.log('Share clicked')
    };

    handlePartSelect = (childData) => {
        if (this.selectedPart && this.selectedPart.ref === childData.ref && this.previousPartState === childData.ref.state) {
            // TODO catch case for when property panel form event is called but no changes are made
            //  (thus unselecting the part as previous state and current state are same)
            this.unselectPart()
        } else {
            this.setState({
                hideProperties: false,
                partData: childData
            });

            if (this.selectedPart) {
                this.selectedPart.ref.setState({isSelected: false});
                this.previousPartState = childData.ref.state;
                this.selectedPart = childData;
            }
            childData.ref.setState({isSelected: true}, () => {
                this.previousPartState = childData.ref.state;
                this.selectedPart = childData;
            });
        }
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
                                    disabled={this.state.isSimulating}
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
                        handlePartSelect={this.handlePartSelect}
                        hideProperties={this.state.hideProperties}
                        partData={this.state.partData}
                    />

                    { /* Canvas */}
                    <div className={classes.canvas}>
                        <Canvas listOfParts={this.state.listOfParts}/>
                    </div>

                </div>
            </ThemeProvider>
        );
    }

    /** getResistance
     *
     * @param circuit       A list of components that form a closed circuit.
     * @returns {number}    The total resistance as found by any resistors in the closed circuit.
     */
    getResistance(circuit) {
        console.log(circuit)
        let resistance = 0
        for (var i = 0; i < circuit.length; i++){
            console.log(circuit[i])
            if ((circuit[i]).state.type === "Resistor"){
                resistance += (circuit[i]).state.resistance
            }
        }
        return resistance;
    }

    /** setCurrent
     *
     * @param circuit   A list of components that form a closed circuit.
     * @param current   The calculated current based on the resistance from getResistance
     */
    setCurrent(circuit, current) {
        for (var i = 0; i < circuit.length; i++){
            circuit[i].setState({current: current})
            if (circuit[i].state.type === "LED") {
                circuit[i].setIntensity()
            }
        }
    }
}

export default withWidth()(withStyles(styles, {withTheme: true})(App));
