import React, {Component} from "react";
import {
    Drawer as MUIDrawer,
    Divider,
    Grid,
    TextField, List, useMediaQuery, useTheme, withStyles
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import CategorySelect from "./CategorySelect";
import SearchIcon from "@material-ui/icons/Search";
import SideBarPart from "./SideBarPart";
import Resistor from "./parts/Resistor";
import BreadBoard from "./parts/BreadBoard";
import LED from "./parts/LED";
import Transistor from "./parts/Transistor";
import MomentaryButton from "./parts/Button";
import PropertiesPanel from "./PropertiesPanel";

const drawerWidth = 240;

const styles = theme => ({
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
});

class Drawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hideProperties: true,
            data: {
                type: null,
                name: null,
                colour: null,
                resistance: null,
                capacitance: null,
                colourEnabled: false,
                resistanceEnabled: false,
                capacitanceEnabled: false,
            },
        }

    }

    handleProperties = () => {
        this.setState(state => ({
            hideProperties: !state.hideProperties
        }))
    }

    onDoubleTap = (childData) => {
        this.handleProperties();
        this.setState({data: childData})
        //console.log(this.state.data)
    }

    handleTextField = (event, value) => {
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                name: event.target.value
            }
        }))
        console.log(this.state.data)
    }

    render() {
        const {classes} = this.props;

        //const theme = useTheme();
        //const isNotSmall = useMediaQuery(theme.breakpoints.up('sm'))

        return (
            <MUIDrawer
                variant="persistent"
                anchor={true ? "left" : "bottom"}
                open={this.props.open}
                classes={
                    {
                        paper: clsx(classes.drawerPaper, !this.props.open && classes.drawerPaperClose),
                    }
                }
            >
                { /* Drawer Header */}
                <div className={classes.toolbarIcon}>
                    <CategorySelect/>
                    <IconButton
                        onClick={this.props.handleDrawerClose}
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
                            <SideBarPart ondrag={this.props.addPart} part={<BreadBoard/>} name={"Breadboard"}
                                         onDoubleTap={this.onDoubleTap}/>
                            <SideBarPart ondrag={this.props.addPart} part={<Resistor/>} name={"Resistor"}
                                         onDoubleTap={this.onDoubleTap}/>
                            <SideBarPart ondrag={this.props.addPart} part={<LED/>} name={"LED"}
                                         onDoubleTap={this.onDoubleTap}/>
                            <SideBarPart ondrag={this.props.addPart} part={<MomentaryButton/>} name={"MomentaryButton"}
                                         onDoubleTap={this.onDoubleTap}/>
                            <SideBarPart ondrag={this.props.addPart} part={<Transistor/>} name={"Transistor"}
                                         onDoubleTap={this.onDoubleTap}/>
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
                            [classes.propertiesPanelHide]: this.state.hideProperties,
                        })}
                    >
                        <PropertiesPanel
                            handleTextField={this.handleTextField}
                            partType={this.state.data.type}
                            partName={this.state.data.name}
                            colourEnabled={this.state.data.colourEnabled}
                            resistanceEnabled={this.state.data.resistanceEnabled}
                            capacitanceEnabled={this.state.data.capacitanceEnabled}
                        />
                    </Grid>
                </Grid>

            </MUIDrawer>
        );
    }
}

export default withStyles(styles)(Drawer);
