import React, {Component} from "react";
import {Drawer as MUIDrawer, Divider, Grid, TextField, withStyles, withWidth} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import CategorySelect from "./CategorySelect";
import SearchIcon from "@material-ui/icons/Search";
import PropertiesPanel from "./PropertiesPanel";
import BreadBoard from "./parts/BreadBoard";
import Resistor from "./parts/Resistor";
import LED from "./parts/LED";
import MomentaryButton from "./parts/Button";
import Transistor from "./parts/Transistor";
import SideBarPart from "./SideBarPart";

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
        [theme.breakpoints.down('xs')]: {
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

const listParts = {
    basics: [
        {name: 'Breadboard', component: <BreadBoard/>},
        {name: 'MomentaryButton', component: <MomentaryButton/>},
        {name: 'LED', component: <LED/>},
        {name: 'Resistor', component: <Resistor/>},
        {name: 'Transistor', component: <Transistor/>},
    ],
    gates: []
}

class Drawer extends Component {
    constructor(props) {
        super(props);
        this.previousPartState = undefined;
        this.selectedPart = undefined;

        this.state = {
            hideProperties: true,
            partData: {},
            selectedCategory: "basics",
            searchFilter: "",
        }
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

    handleCategorySelect = event => {
        this.setState({selectedCategory: event.target.value})
    }

    handleSearchChange = event => {
        this.setState({searchFilter: event.target.value})
    }

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
                    <CategorySelect handleCategorySelect={this.handleCategorySelect}
                                    category={this.state.selectedCategory}/>
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
                            <TextField
                                id="search"
                                label="Search"
                                type="search"
                                onChange={this.handleSearchChange}
                            />
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
                        {
                            this.state.searchFilter !== "" ? (
                                listParts.basics.filter(part => part.name.toLowerCase().includes(this.state.searchFilter)).map(filteredPart => (
                                    <SideBarPart ondrag={this.props.addPart} part={filteredPart.component}
                                                 name={filteredPart.name} onDoubleTap={this.onDoubleTap}/>
                                ))
                            ) : ({
                                'all':<></>,
                                'basics':
                                    listParts.basics.map(part => (
                                        <SideBarPart ondrag={this.props.addPart} part={part.component}
                                                     name={part.name} onDoubleTap={this.onDoubleTap}/>
                                    )),
                                'gates':
                                    listParts.gates.map(part => (
                                        <SideBarPart ondrag={this.props.addPart} part={part.component}
                                                     name={part.name} onDoubleTap={this.onDoubleTap}/>
                                    )),
                            }[this.state.selectedCategory])
                        }
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
                            partData={this.state.partData}
                        />
                    </Grid>

                </Grid>
            </MUIDrawer>
        );
    }
}

export default withWidth()(withStyles(styles)(Drawer));
