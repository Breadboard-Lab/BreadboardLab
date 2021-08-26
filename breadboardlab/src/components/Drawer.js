import React, {Component} from "react";
import {Drawer as MUIDrawer, Divider, Grid, TextField, withStyles, withWidth} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import CategorySelect from "./CategorySelect";
import SearchIcon from "@material-ui/icons/Search";
import PropertiesPanel from "./PropertiesPanel";
import SideBarPart from "./SideBarPart";
import partsList from "../utils/partsList";

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

class Drawer extends Component {
    constructor(props) {
        super(props);
        this.previousPartState = undefined;
        this.selectedPart = undefined;

        this.state = {
            selectedCategory: "basics",
            searchFilter: "",
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
                            /*
                                if searchFilter is empty, resort to Category rendering
                                    get selectedCategory state for inline switch case
                                if searchFilter is not empty, check through All category for matching parts
                             */
                            this.state.searchFilter !== "" ? (
                                partsList.all.filter(part => part.name.toLowerCase().includes(this.state.searchFilter.toLowerCase())).map((filteredPart, index) => (
                                    <SideBarPart key={index} ondrag={this.props.addPart} part={filteredPart.component}
                                                 movePart={this.props.movePart} moveLead={this.props.moveLead}
                                                 name={filteredPart.name} description={filteredPart.description}
                                                 handlePartSelect={this.props.handlePartSelect}
                                                 updatePropertiesPanel={this.props.updatePropertiesPanel}
                                                 checkConnected={this.props.checkConnected}
                                                 getDimensions={this.props.getDimensions}
                                                 addLeadHistory={this.props.addLeadHistory}
                                                 addMoveHistory={this.props.addMoveHistory}
                                                 addAddPartHistory={this.props.addAddPartHistory}
                                                 addDeleteHistory={this.props.addDeleteHistory}/>
                                ))
                            ) : ({
                                'all':
                                    partsList.all.map((part, index) => (
                                        <SideBarPart key={index} ondrag={this.props.addPart} part={part.component}
                                                     movePart={this.props.movePart} moveLead={this.props.moveLead}
                                                     name={part.name} description={part.description}
                                                     handlePartSelect={this.props.handlePartSelect}
                                                     updatePropertiesPanel={this.props.updatePropertiesPanel}
                                                     checkConnected={this.props.checkConnected}
                                                     getDimensions={this.props.getDimensions}
                                                     addLeadHistory={this.props.addLeadHistory}
                                                     addMoveHistory={this.props.addMoveHistory}
                                                     addAddPartHistory={this.props.addAddPartHistory}
                                                     addDeleteHistory={this.props.addDeleteHistory}/>
                                    )),
                                'basics':
                                    partsList.basics.map((part, index) => (
                                        <SideBarPart key={index} ondrag={this.props.addPart} part={part.component}
                                                     movePart={this.props.movePart} moveLead={this.props.moveLead}
                                                     name={part.name} description={part.description}
                                                     handlePartSelect={this.props.handlePartSelect}
                                                     updatePropertiesPanel={this.props.updatePropertiesPanel}
                                                     checkConnected={this.props.checkConnected}
                                                     getDimensions={this.props.getDimensions}
                                                     addLeadHistory={this.props.addLeadHistory}
                                                     addMoveHistory={this.props.addMoveHistory}
                                                     addAddPartHistory={this.props.addAddPartHistory}
                                                     addDeleteHistory={this.props.addDeleteHistory}
                                                     handlePartToggle={this.props.handlePartToggle}/>
                                    )),
                                'gates':
                                    partsList.gates.map((part, index) => (
                                        <SideBarPart key={index} ondrag={this.props.addPart} part={part.component}
                                                     movePart={this.props.movePart} moveLead={this.props.moveLead}
                                                     name={part.name} description={part.description}
                                                     handlePartSelect={this.props.handlePartSelect}
                                                     updatePropertiesPanel={this.props.updatePropertiesPanel}
                                                     checkConnected={this.props.checkConnected}
                                                     getDimensions={this.props.getDimensions}
                                                     addLeadHistory={this.props.addLeadHistory}
                                                     addMoveHistory={this.props.addMoveHistory}
                                                     addAddPartHistory={this.props.addAddPartHistory}
                                                     addDeleteHistory={this.props.addDeleteHistory}/>
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
                            [classes.propertiesPanelHide]: this.props.hideProperties,
                        })}
                    >
                        <PropertiesPanel
                            partData={this.props.partData}
                        />
                    </Grid>

                </Grid>
            </MUIDrawer>
        );
    }
}

export default withWidth()(withStyles(styles)(Drawer));
