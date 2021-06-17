import React, {Component} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CssBaseline,
    Divider,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    Grid,
    withStyles,
    SvgIcon,
} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles'
import clsx from "clsx";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from './components/Drawer';
import themeDark from './themes/themeDark';
import themeLight from './themes/themeLight';
import Canvas from './components/Canvas';
import AppbarToolsCollapseMenu from "./components/AppbarToolsCollapseMenu";
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import AppbarSettingsCollapseMenu from "./components/AppbarSettingsCollapseMenu";
import SplitButton from "./components/SplitButton";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import LinearScaleIcon from "@material-ui/icons/LinearScale";
import {ReactComponent as SelectIcon} from "./assets/select_icon.svg";
import ExportMenu from './components/exportMenu';

const drawerWidth = 240;

const StyledToggleButtonGroup = withStyles({
    grouped: {
        border: 'none',
        borderRadius: '0px',
    },
})(ToggleButtonGroup);

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
    appBarSpacer: {
        minHeight: 48
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
    collapse: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        },
    }
});

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            listOfParts: [],
            themeState: true,
            selectedTool: 'select_tool',
            theme: {...themeDark}

        }
    }

    handleThemeChange = () => {
        this.setState(state => ({themeState: !state.themeState}));
        this.setState(state => ({theme: state.themeState ? {...themeDark} : {...themeLight}}))
    };
    handleDrawer = () => {
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
        // TODO handle svg deletion
        console.log('Delete clicked')
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

    render() {
        const {classes} = this.props;


        return (
            <ThemeProvider theme={this.state.theme}>
                <div className={classes.root}>
                    <CssBaseline/>

                    { /* Header Appbar */}
                    <AppBar
                        position="fixed"
                        color='secondary'
                    >
                        <Toolbar variant="dense">
                            <Typography variant='h4' className={classes.title}>
                                Breadboard Lab
                            </Typography>
                            <AppbarSettingsCollapseMenu/>
                            <Grid className={classes.collapse}>
                                <Tooltip title="Share">
                                    <Button
                                        aria-label='Share'
                                        onClick={this.handleShare}
                                    >
                                        Share
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Export">
                                    <ExportMenu/>
                                </Tooltip>
                                <Tooltip title="Change Theme">
                                    <IconButton onClick={this.handleThemeChange}>
                                        <InvertColorsIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>

                        </Toolbar>
                    </AppBar>

                    { /* Tools Menu Appbar */}
                    <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: this.state.open,
                        })}
                    >
                        <Toolbar variant="dense">
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
                            <AppbarToolsCollapseMenu/>
                            <Grid container className={classes.collapse}>
                                <SplitButton>
                                    <StyledToggleButtonGroup
                                        value={this.state.selectedTool}
                                        exclusive
                                        onChange={this.handleTool}
                                        aria-label="Tool Menu"
                                    >
                                        <ToggleButton
                                            aria-label="select"
                                            value="select_tool"
                                        >
                                            <Tooltip title="Select">
                                                <SvgIcon>
                                                    <SelectIcon/>
                                                </SvgIcon>
                                            </Tooltip>
                                        </ToggleButton>
                                        <ToggleButton
                                            aria-label="draw wire"
                                            value="wire_tool"
                                        >
                                            <Tooltip title="Draw Wire">
                                                <LinearScaleIcon/>
                                            </Tooltip>
                                        </ToggleButton>
                                    </StyledToggleButtonGroup>
                                </SplitButton>

                                <Divider orientation="vertical" variant="middle" light flexItem/>

                                <Tooltip title="Rotate">
                                    <IconButton
                                        aria-label="rotate"
                                        value="rotate_tool"
                                        onClick={this.handleRotate}
                                    >
                                        <RotateRightIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={this.handleDelete}
                                    >
                                        <DeleteForeverIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Undo">
                                    <IconButton
                                        aria-label="undo"
                                        onClick={this.handleUndo}
                                    >
                                        <UndoIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Redo">
                                    <IconButton
                                        aria-label="redo"
                                        onClick={this.handleRedo}
                                    >
                                        <RedoIcon/>
                                    </IconButton>
                                </Tooltip>

                                <Divider orientation="vertical" variant="middle" light flexItem/>

                                <Tooltip title="Start Simulation">
                                    <Button
                                        color="inherit"
                                        aria-label="start simulation"
                                        startIcon={<PlayArrowIcon/>}
                                        onClick={this.handleStart}
                                    >
                                        Start
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    { /* Components/Properties Sidebar */}
                    <Drawer
                        open={this.state.open}
                        handleDrawerClose={this.handleDrawer}
                        addPart={this.addPart}
                    />

                    { /* Canvas */}
                    <div className={classes.canvas}>
                        { /* Content */}
                        <Canvas listOfParts={this.state.listOfParts}/>
                    </div>

                </div>
            </ThemeProvider>
        );
    }
}

export default withStyles(styles, {withTheme: true})(App);
