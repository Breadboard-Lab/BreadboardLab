import React from "react";
import SideBarPart from "../../SideBarPart";
import BreadBoard from "../BreadBoard";
import Resistor from "../Resistor";
import LED from "../LED";
import MomentaryButton from "../Button";
import Transistor from "../Transistor";

const CategoryBasics = (props) => {
    return (
        <>
            <SideBarPart ondrag={props.addPart} part={<BreadBoard/>}
                         name={"Breadboard"}
                         onDoubleTap={props.onDoubleTap}/>
            <SideBarPart ondrag={props.addPart} part={<Resistor/>} name={"Resistor"}
                         onDoubleTap={props.onDoubleTap}/>
            <SideBarPart ondrag={props.addPart} part={<LED/>} name={"LED"}
                         onDoubleTap={props.onDoubleTap}/>
            <SideBarPart ondrag={props.addPart} part={<MomentaryButton/>}
                         name={"MomentaryButton"}
                         onDoubleTap={props.onDoubleTap}/>
            <SideBarPart ondrag={props.addPart} part={<Transistor/>}
                         name={"Transistor"}
                         onDoubleTap={props.onDoubleTap}/>
        </>
    );
};

export default CategoryBasics;