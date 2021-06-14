import React from "react";
import {
    Drawer as MUIDrawer,
    Divider,
    Grid,
    TextField, List
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import CategorySelect from "./CategorySelect";
import SearchIcon from "@material-ui/icons/Search";
import SideBarPart from "./SideBarPart";
import {ReactComponent as Resistor} from "../assets/parts/resistor.svg";
import {ReactComponent as Breadboard} from "../assets/parts/breadboard.svg";
import {ReactComponent as LED} from "../assets/parts/led.svg";
import {ReactComponent as Transistor} from "../assets/parts/transistor.svg";
import {ReactComponent as MomentaryButton} from "../assets/parts/momentary_button.svg";
import PropertiesPanel from "./PropertiesPanel";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    drawerPaper: {
        [theme.breakpoints.up('sm')]: {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginTop: 48,
            height: 'calc(100% - 48px)'
        },
        height: 200

    },
    drawerPaperClose: {
        [theme.breakpoints.up('sm')]: {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: 0,
        }
    },
    searchBar: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    propertiesPanel: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
        position: "fixed",
        bottom: 0,
    }
}));

const Drawer = props => {
    const classes = useStyles();

    return (
        <MUIDrawer
            variant="persistent"
            anchor={props.anchor}
            open={props.open}
            classes={
                {
                    paper: clsx(classes.drawerPaper, !props.open && classes.drawerPaperClose),
                }
            }
        >
            { /* Drawer Header */}
            <div className={classes.toolbarIcon}>
                <CategorySelect/>
                <IconButton
                    onClick={props.handleDrawerClose}
                    aria-label="close drawer"
                >
                    <ChevronLeftIcon/>
                </IconButton>
            </div>
            <Divider/>

            { /* Searchbar Content */}
            <div className={classes.searchBar}>
                <Grid
                    container
                    alignItems="flex-end"
                >
                    <Grid item xs>
                        <SearchIcon/>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField id="search" label="Search"/>
                    </Grid>
                </Grid>
            </div>

            { /* Components List */}
            <div>
                <List dense>
                    <SideBarPart ondrag={props.addPart} part={<Breadboard/>} name={"Breadboard"}/>
                    <SideBarPart ondrag={props.addPart} part={<Resistor/>} name={"Resistor"}/>
                    <SideBarPart ondrag={props.addPart} part={<LED/>} name={"LED"}/>
                    <SideBarPart ondrag={props.addPart} part={<MomentaryButton/>} name={"MomentaryButton"}/>
                    <SideBarPart ondrag={props.addPart} part={<Transistor/>} name={"Transistor"}/>
                </List>
            </div>

            { /* Properties Panel */}
            <div className={classes.propertiesPanel}>
                <PropertiesPanel
                    partType={'Lorem Ipsum Resistor'}
                    colourEnabled={true}
                    resistanceEnabled={true}
                    capacitanceEnabled={true}
                />
            </div>

        </MUIDrawer>
    );
};

export default Drawer;