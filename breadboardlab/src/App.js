import React from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CssBaseline,
    Divider,
    IconButton,
    makeStyles,
    Toolbar, Tooltip, Typography, Grid, useMediaQuery, withStyles,
} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles'
import clsx from "clsx";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SelectAllIcon from '@material-ui/icons/SelectAll';
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

const drawerWidth = 240;

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        margin: theme.spacing(0.5),
        border: 'none',
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
    menuButton: {
        marginRight: theme.spacing(2),
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
        console.log(selectedTool)
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
                                        <SelectAllIcon/>
                                    </Tooltip>
                                </ToggleButton>
                                <ToggleButton
                                    aria-label="rotate"
                                    value="rotate_tool"
                                >
                                    <Tooltip title="Rotate">
                                        <RotateRightIcon/>
                                    </Tooltip>
                                </ToggleButton>
                                <Divider orientation="vertical" variant="middle" light flexItem/>
                                <ToggleButton
                                    aria-label="delete"
                                    value="delete_tool"
                                >
                                    <Tooltip title="Delete">

                                        <DeleteForeverIcon/>
                                    </Tooltip>
                                </ToggleButton>
                                <ToggleButton
                                    aria-label="undo"
                                    value="undo_tool"
                                >
                                    <Tooltip title="Undo">
                                        <UndoIcon/>
                                    </Tooltip>
                                </ToggleButton>
                                <ToggleButton
                                    aria-label="redo"
                                    value="redo_tool"
                                >
                                    <Tooltip title="Redo">
                                        <RedoIcon/>
                                    </Tooltip>
                                </ToggleButton>
                                <Divider orientation="vertical" variant="middle" light flexItem/>
                                <SplitButton/>
                                <Divider orientation="vertical" variant="middle" light flexItem/>
                                <Tooltip title="Start Simulation">
                                    <Button
                                        color="inherit"
                                        aria-label="start simulation"
                                        startIcon={<PlayArrowIcon/>}
                                    >
                                        Start
                                    </Button>
                                </Tooltip>
                            </StyledToggleButtonGroup>
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
