import React, {Component} from "react";
import {Drawer as MUIDrawer, Divider, Grid, TextField, withStyles, withWidth} from "@material-ui/core";
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
        super(props);
        this.previousPartState = undefined;
        this.selectedPart = undefined;

        this.state = {
            hideProperties: true,
            partData: {},
        }
    }

    handleProperties = () => {
        this.setState(state => ({
            hideProperties: !state.hideProperties
        }))
    }

    onDoubleTap = (childData) => {
        if (this.selectedPart && this.selectedPart.ref === childData.ref && this.previousPartState === childData.ref.state) {
            this.setState({
                hideProperties: true,
                partData: {},
            });
            this.previousPartState = undefined;
            this.selectedPart = undefined;
        } else {
            this.setState({
                hideProperties: false,
                partData: childData
            });
            this.previousPartState = childData.ref.state;
            this.selectedPart = childData;
        }
    }

    handleTextField = (event) => {
        this.setState(prevState => ({
            partData: {
                ...prevState.partData,
                name: event.target.value
            }
        }))
        console.log(this.state.partData)
    }

    handleColourChange = (event) => {
        this.setState(prevState => ({
            partData: {
                ...prevState.partData,
                colour: event.target.value
            }
        }))
    };

    handleResistanceChange = (event) => {
        this.setState(prevState => ({
            partData: {
                ...prevState.partData,
                resistance: event.target.value
            }
        }))
    };

    handleCapacitanceChange = (event) => {
        this.setState(prevState => ({
            partData: {
                ...prevState.partData,
                capacitance: event.target.value
            }
        }))
    };

    render() {
        const {classes} = this.props;

        return (
            <MUIDrawer
                variant="persistent"
                anchor={this.props.width < 'xs' ? "left" : "bottom"}
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
                    <Grid
                        container
                        direction={this.props.width < 'xs' ? "column" : "row"}
                        item
                        wrap="nowrap"
                    >
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
                    </Grid>

                    { /*
                        Properties Panel
                            onDoubleTap calls handleProperties
                                Toggles visibility of panel.
                    */}
                    <Grid
                        item
                        className={clsx(classes.propertiesPanel, {
                            [classes.propertiesPanelHide]: this.state.hideProperties,
                        })}
                    >
                        <PropertiesPanel
                            handleTextField={this.handleTextField}
                            handleColourChange={this.handleColourChange}
                            handleResistanceChange={this.handleResistanceChange}
                            handleCapacitanceChange={this.handleCapacitanceChange}
                            partData={this.state.partData}
                        />
                    </Grid>

                </Grid>
            </MUIDrawer>
        );
    }
}

export default withWidth()(withStyles(styles)(Drawer));
