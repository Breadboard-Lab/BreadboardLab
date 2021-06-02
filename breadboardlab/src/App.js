import React from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CssBaseline,
    Divider,
    IconButton, ListItemIcon,
    makeStyles, MenuItem, Select,
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
import {blue, green, red} from "@material-ui/core/colors";
import theme from './components/theme';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarSpacer: theme.mixins.toolbar,
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
}));

function App() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline/>

                { /* TODO separate first toolbar from second so drawer doesnt push both to the side. */}
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    { /* Header Toolbar */ }
                    <Toolbar variant="dense">
                        <Typography variant='h4'>
                            CircuitSim
                        </Typography>
                    </Toolbar>

                    { /* Tools Menu Toolbar */ }
                    <Toolbar variant="dense">
                        <Tooltip title="Open Drawer">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, open && classes.menuHide)}
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
                        <Tooltip title="Select Wire Colour">
                            { /* TODO form control, default value, aria-labels, fix tooltip (stays too long/. */ }
                            <Select>
                                <MenuItem>
                                    <ListItemIcon>
                                        <LinearScaleIcon style={{color: green[500]}}/>
                                    </ListItemIcon>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <LinearScaleIcon style={{color: red[500]}}/>
                                    </ListItemIcon>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <LinearScaleIcon style={{color: blue[500]}}/>
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
                />

                { /* Canvas */}
                <div className={classes.canvas}>
                    <div className={classes.appBarSpacer}>
                        { /* Content */}
                        { /* TODO create visual grid. */ }
                    </div>
                </div>

            </div>
        </ThemeProvider>
    );
}

export default App;
