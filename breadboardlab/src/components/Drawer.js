import React from "react";
import {Drawer as MUIDrawer, Divider, Grid, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import Parts from "./Parts";
import Breadboard from "./Breadboard";
import CategorySelect from "./CategorySelect";
import SearchIcon from "@material-ui/icons/Search";
import SideBarPart from "./SideBarPart";

const drawerWidth = 281;

const useStyles = makeStyles((theme) => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    drawerPaper: {
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
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: 0,
    },
    category: {
        display: 'flex',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        padding: '5px',
    },
    searchBar: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
}));

const Drawer = props => {
    const classes = useStyles();
    
    return (
        <MUIDrawer
            variant="persistent"
            anchor="left"
            open={props.open}
            classes={
                {
                    paper: clsx(classes.drawerPaper, !props.open && classes.drawerPaperClose),
                }
            }
        >
            { /* Drawer Header */ }
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

            { /* Searchbar Content */ }
            <div className={classes.searchBar}>
                <Grid
                    container
                    alignItems="flex-end"
                >
                    <Grid item xs>
                        <SearchIcon />
                    </Grid>
                    <Grid item xs={10}>
                        <TextField id="search" label="Search" />
                    </Grid>
                </Grid>
            </div>
            { /* Components List */ }
            <div className={classes.category}>
                <SideBarPart ondrag={props.addPart} part={<Parts.Circle/>} name={"Circle"} />
                <SideBarPart ondrag={props.addPart} part={<Parts.Triangle/>} name={"Triangle"} />
                <SideBarPart ondrag={props.addPart} part={<Parts.Path/>} name={"Path"} />
                <SideBarPart ondrag={props.addPart} part={<Breadboard/>} name={"Breadboard"} />
            </div>
        </MUIDrawer>
    );
};

export default Drawer;