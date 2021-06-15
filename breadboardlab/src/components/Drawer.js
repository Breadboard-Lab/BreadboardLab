import React from "react";
import {
    Drawer as MUIDrawer,
    Divider,
    Grid,
    TextField, List, Button
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import CategorySelect from "./CategorySelect";
import SearchIcon from "@material-ui/icons/Search";
import SideBarPart from "./SideBarPart";
import {ReactComponent as Resistor} from "../assets/parts/resistor.svg";
import BreadBoard from "./parts/BreadBoard.js";
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
    },
    propertiesPanelHide: {
        display: 'none'
    },
    grid: {
        flexGrow: 1,
    },
}));

const Drawer = props => {
    const classes = useStyles();

    const [hideProperties, setHideProperties] = React.useState(true)

    /* TODO setHideProperties to false on part select */
    const handleProperties = () => {
        setHideProperties(!hideProperties)
    }

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

            <Grid
                container
                direction="column"
                justify="space-between"
                className={classes.grid}
            >
                { /* Components List */}
                <Grid item>
                    <List dense>
                        <SideBarPart ondrag={props.addPart} part={<BreadBoard/>} name={"Breadboard"}/>
                        <SideBarPart ondrag={props.addPart} part={<Resistor/>} name={"Resistor"}/>
                        <SideBarPart ondrag={props.addPart} part={<LED/>} name={"LED"}/>
                        <SideBarPart ondrag={props.addPart} part={<MomentaryButton/>} name={"MomentaryButton"}/>
                        <SideBarPart ondrag={props.addPart} part={<Transistor/>} name={"Transistor"}/>
                    </List>
                </Grid>

                {/*<Button*/}
                {/*    onClick={handleProperties}*/}
                {/*>*/}
                {/*    Click Me!*/}
                {/*</Button>*/}

                { /* Properties Panel */}
                <Grid
                    item
                    className={clsx(classes.propertiesPanel, {
                        [classes.propertiesPanelHide]: hideProperties,
                    })}
                >
                    <PropertiesPanel
                        partType={'Lorem Ipsum Resistor'}
                        colourEnabled={true}
                        resistanceEnabled={true}
                        capacitanceEnabled={true}
                    />
                </Grid>
            </Grid
            >

        </MUIDrawer>
    );
};

export default Drawer;