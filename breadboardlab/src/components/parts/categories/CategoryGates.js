import React from "react";
import {Typography} from "@material-ui/core";
import SideBarPart from "../../SideBarPart";
import BreadBoard from "../BreadBoard";

const CategoryGates = (props) => {
    return (
        <>
            { /* TODO add gates */ }

            {/* Example: Implementation: */}
            {/*<SideBarPart ondrag={props.addPart} part={<BreadBoard/>}*/}
            {/*             name={"Breadboard"}*/}
            {/*             onDoubleTap={props.onDoubleTap}/>*/}
            <Typography>AND Gate or whatever</Typography>
        </>
    );
};

export default CategoryGates;