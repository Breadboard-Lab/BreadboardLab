import React from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CssBaseline,
    Divider,
    IconButton, ListItemIcon,
    makeStyles, withStyles, MenuItem, Select,
    Toolbar, Tooltip, Typography,
} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles'
import clsx from "clsx";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from './components/Drawer';
import {blue, green, grey, red, yellow} from "@material-ui/core/colors";
import theme from './components/theme';
import InputBase from '@material-ui/core/InputBase';
import Canvas from './components/Canvas';

const drawerWidth = 281;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height:'100%'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginTop: 48
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
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
    }
}));

const BootstrapInput = withStyles((theme) => ({
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        padding: '10px 0px 7px 16px'
    },
}))(InputBase);

function App() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [toolOpen, setToolOpen] = React.useState(false);
    const [wireColor, setWireColor] = React.useState("green");
    const [listOfParts, setListOfParts] = React.useState([]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const selectWire = (event) => {
        setWireColor(event.target.value)
    }
    const openToolTip = () => {
        setToolOpen(true)
    }
    const closeToolTip = () => {
        setToolOpen(false)
    }
    const addPart = (part) => {
        listOfParts.push(part)
        setListOfParts([...listOfParts]);
    }

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
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={open && classes.menuHide}
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Select">
                            <IconButton
                                color="inherit"
                                aria-label="select">
                                <SelectAllIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Rotate">
                            <IconButton
                                color="inherit"
                                aria-label="rotate">
                                <RotateRightIcon/>
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" variant="middle" light flexItem/>
                        <Tooltip title="Delete">
                            <IconButton
                                color="inherit"
                                aria-label="delete">
                                <DeleteForeverIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Undo">
                            <IconButton
                                color="inherit"
                                aria-label="undo">
                                <UndoIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Redo">
                            <IconButton
                                color="inherit"
                                aria-label="redo">
                                <RedoIcon/>
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" variant="middle" light flexItem/>
                        <Tooltip title="Draw Wire">
                            <IconButton
                                color="inherit"
                                aria-label="draw wire">
                                <LinearScaleIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip onPointerEnter={openToolTip} onPointerLeave={closeToolTip} open={toolOpen}
                                 title="Select Wire Colour">
                            <Select
                                input={<BootstrapInput/>}
                                onMouseDown={closeToolTip}
                                value={wireColor}
                                onChange={selectWire}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "center"
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "center"
                                    },
                                    getContentAnchorEl: null
                                }}
                            >
                                <MenuItem value={"black"}>
                                    <ListItemIcon>
                                        <LinearScaleIcon style={{color: grey[800]}}/>
                                    </ListItemIcon>
                                </MenuItem>
                                <MenuItem value={"red"}>
                                    <ListItemIcon>
                                        <LinearScaleIcon style={{color: red[500]}}/>
                                    </ListItemIcon>
                                </MenuItem>
                                <MenuItem value={"green"}>
                                    <ListItemIcon>
                                        <LinearScaleIcon style={{color: green[500]}}/>
                                    </ListItemIcon>
                                </MenuItem>
                                <MenuItem value={"blue"}>
                                    <ListItemIcon>
                                        <LinearScaleIcon style={{color: blue[500]}}/>
                                    </ListItemIcon>
                                </MenuItem>
                                <MenuItem value={"yellow"}>
                                    <ListItemIcon>
                                        <LinearScaleIcon style={{color: yellow[500]}}/>
                                    </ListItemIcon>
                                </MenuItem>
                            </Select>
                        </Tooltip>
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
                    </Toolbar>
                </AppBar>

                { /* Components/Properties Sidebar */}
                <Drawer
                    open={open}
                    handleDrawerClose={handleDrawerClose}
                    addPart={addPart}
                />


                { /* Canvas */}
                <div className={classes.canvas}>
                    { /* Appbar spacing */}
                    <Toolbar variant="dense"/>
                    <Toolbar variant="dense"/>

                    { /* Content */}
                    <Canvas listOfParts={listOfParts} />
                </div>

            </div>
        </ThemeProvider>
    );
}

export default App;
