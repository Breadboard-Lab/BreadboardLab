import React from "react";
import {Drawer as MUIDrawer, Divider} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import Parts from "./Parts"
import CategorySelect from "./CategorySelect";

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
            { /* Shows < icon whilst drawer is open. Closers drawer on click. */}
            <div className={classes.toolbarIcon}>
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
            </div>
            <Divider/>
            { /* Drawer Content */ }
            { /* TODO category select menu */ }
            { /* TODO search bar */ }
            { /* TODO components list */ }
            <div className={classes.category}>
                <Part part={<Parts.Circle/>} name={"Circle"} />
                <Part part={<Parts.Triangle/>} name={"Triangle"} />
                <Part part={<Parts.Path/>} name={"Path"} />
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