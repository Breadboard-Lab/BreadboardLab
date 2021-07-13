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
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            listOfParts: [],
            themeState: true,
            selectedTool: 'select_tool',
            theme: {...themeDark},
            hideProperties: true,
            partData: {},
        }
    }

    handleThemeChange = () => {
        // Switches between dark theme and light theme.
        this.setState(state => ({themeState: !state.themeState}));
        this.setState(state => ({theme: state.themeState ? {...themeDark} : {...themeLight}}))
    };

    handleDrawer = () => {
        // Switches between drawer opened or closed.
        this.setState(state => ({open: !state.open}));
    };

    addPart = (part) => {
        this.state.listOfParts.push(part)
        this.setState(state => ({listOfParts: [...state.listOfParts]}));
    };

    handleTool = (event, newTool) => {
        this.setState({selectedTool: newTool});
        console.log(this.state.selectedTool + " clicked")
    };

    handleRotate = () => {
        // TODO handle svg rotation
        console.log('Rotate clicked')
    };

    handleDelete = () => {
        // console.log("handleDelete pressed", this.state.partsList.filter(function(part){
        //     return part.ref !== this.selectedPart.ref
        // }))
        console.log("selectedPart", this.selectedPart.ref)
        this.state.listOfParts.forEach((part, index) => {
            console.log("partInList", index, part)
        })
    };

    handleUndo = () => {
        // TODO handle undo
        console.log('Undo clicked')
    };

    handleRedo = () => {
        // TODO handle redo
        console.log('Redo clicked')
    };

    handleStart = () => {
        // TODO handle Start
        console.log('Start clicked')
    };

    handleShare = () => {
        // TODO handle Share
        console.log('Share clicked')
    };

    handlePartSelect = (childData) => {
        if (this.selectedPart && this.selectedPart.ref === childData.ref && this.previousPartState === childData.ref.state) {
            this.setState({
                hideProperties: true,
                partData: {},
            });
            this.selectedPart.ref.setState({isSelected: false});
            this.previousPartState = undefined;
            this.selectedPart = undefined;
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
                                : <AppbarSettingsCollapseMenu/>
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
                            [classes.appBarShift]: this.state.open,
                        })}
                    >
                        <Toolbar variant="dense">

                            { /* Drawer Controller Button
                                    Hides on Drawer opened
                            */}
                            <Tooltip title="Open Drawer">
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={this.handleDrawer}
                                    edge="start"
                                    className={this.state.open && classes.menuHide}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            </Tooltip>

                            { /* Tools */}
                            {this.props.width < 'xs' ?
                                <AppbarToolsMenu
                                    selectedTool={this.state.selectedTool}
                                    handleTool={this.handleTool}
                                    handleRotate={this.handleRotate}
                                    handleDelete={this.handleDelete}
                                    handleUndo={this.handleUndo}
                                    handleRedo={this.handleRedo}
                                    handleStart={this.handleStart}
                                />
                                : <AppbarToolsCollapseMenu/>}
                        </Toolbar>
                    </AppBar>

                    { /* Components/Properties Sidebar */}
                    <Drawer
                        open={this.state.open}
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
}

export default withWidth()(withStyles(styles, {withTheme: true})(App));
