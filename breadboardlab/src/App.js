import React from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CssBaseline,
    Divider,
    IconButton,
    makeStyles,
    Toolbar, Tooltip, Typography, Grid, useMediaQuery, withStyles, SvgIcon,
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
import {ReactComponent as SelectIcon} from "./assets/select_icon.svg"

const drawerWidth = 240;

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        border: 'none',
        borderRadius: '0px',
    },
}))(ToggleButtonGroup);

const useStyles = makeStyles((theme) => ({
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
}));

function App() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [listOfParts, setListOfParts] = React.useState([]);
    const [themeState, setThemeState] = React.useState(true);
    const theme = themeState ? {...themeDark} : {...themeLight};
    const [selectedTool, setSelectedTool] = React.useState('select_tool');

    const isNotSmall = useMediaQuery(theme.breakpoints.up('sm'))

    const handleThemeChange = () => {
        setThemeState(!themeState)
    };
    const handleDrawer = () => {
        setOpen(!open);
    };
    const addPart = (part) => {
        listOfParts.push(part)
        setListOfParts([...listOfParts]);
    };

    const handleTool = (event, newTool) => {
        setSelectedTool(newTool);
        console.log(selectedTool + " clicked")
    };

    const handleRotate = () => {
        // TODO handle svg rotation
        console.log('Rotate clicked')
    };

    const handleDelete = () => {
        // TODO handle svg deletion
        console.log('Delete clicked')
    };

    const handleUndo = () => {
        // TODO handle undo
        console.log('Undo clicked')
    };

    const handleRedo = () => {
        // TODO handle redo
        console.log('Redo clicked')
    };

    const handleStart = () => {
        // TODO handle Start
        console.log('Start clicked')
    };

    return (
        <ThemeProvider theme={theme}>
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
                                >
                                    Share
                                </Button>
                            </Tooltip>
                            <Tooltip title="Export">
                                <Button
                                    aria-label='Export'
                                >
                                    Export
                                </Button>
                            </Tooltip>
                            <Tooltip title="Change Theme">
                                <IconButton onClick={handleThemeChange}>
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
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar variant="dense">
                        <Tooltip title="Open Drawer">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawer}
                                edge="start"
                                className={open && classes.menuHide}
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Tooltip>
                        <AppbarToolsCollapseMenu/>
                        <Grid container className={classes.collapse}>
                            <SplitButton>
                                <StyledToggleButtonGroup
                                    value={selectedTool}
                                    exclusive
                                    onChange={handleTool}
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
                                    onClick={handleRotate}
                                >
                                    <RotateRightIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    aria-label="delete"
                                    onClick={handleDelete}
                                >
                                    <DeleteForeverIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Undo">
                                <IconButton
                                    aria-label="undo"
                                    onClick={handleUndo}
                                >
                                    <UndoIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Redo">
                                <IconButton
                                    aria-label="redo"
                                    onClick={handleRedo}
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
                                    onClick={handleStart}
                                >
                                    Start
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Toolbar>
                </AppBar>

                { /* Components/Properties Sidebar */}
                <Drawer
                    open={open}
                    anchor={isNotSmall ? "left" : "bottom"}
                    handleDrawerClose={handleDrawer}
                    addPart={addPart}
                />


                { /* Canvas */}
                <div className={classes.canvas}>
                    { /* Appbar spacing */}
                    <Toolbar variant="dense"/>
                    <Toolbar variant="dense"/>

                    { /* Content */}
                    <Canvas listOfParts={listOfParts}/>
                </div>

            </div>
        </ThemeProvider>
    );
}

export default App;
