import React from "react";
import {Drawer as MUIDrawer, Divider, Grid, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import Parts from "./Parts";
import Breadboard from "./Breadboard";
import CategorySelect from "./CategorySelect";
import SearchIcon from "@material-ui/icons/Search"

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
        marginTop: 48
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
    partContainer: {
        width: '125px',
        height: '125px',
        backgroundColor: 'white',
        borderRadius: '5px',
        margin: '5px',
        cursor: 'pointer',
    },
    part: {
        width: '100%',
        height: '100%',
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
                <Part part={<Parts.Circle/>} name={"Circle"} />
                <Part part={<Parts.Triangle/>} name={"Triangle"} />
                <Part part={<Parts.Path/>} name={"Path"} />
                <Part part={<Breadboard/>} name={'Breadboard'} />
            </div>
        </MUIDrawer>
    );
};

const Part = (props) => {
    const classes = useStyles();
    
    return(
        <div className={clsx(classes.partContainer, "part-container")}>
            <svg style={{width: "100%", height: "100%"}}>
                <g className={clsx(classes.part, "part")}>
                    {props.part}
                </g>
                <text textAnchor="middle" x="50%" y="90%">{props.name}</text>
            </svg>
        </div>
    );
}

export default Drawer;