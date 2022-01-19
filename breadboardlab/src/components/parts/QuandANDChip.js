import React from "react";
import interact from "interactjs";
import App from "../../App";

export default class QuadANDChip extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.pin14 = React.createRef();
        this.pin13 = React.createRef();
        this.pin12 = React.createRef();
        this.pin11 = React.createRef();
        this.pin10 = React.createRef();
        this.pin9 = React.createRef();
        this.pin8 = React.createRef();
        this.pin7 = React.createRef();
        this.pin6 = React.createRef();
        this.pin5 = React.createRef();
        this.pin4 = React.createRef();
        this.pin3 = React.createRef();
        this.pin2 = React.createRef();
        this.pin1 = React.createRef();

        this.state = {
            type: "74HC08",
            name: "Quad AND Chip",
            isSelected: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.onMouseUp = this.onMouseUp.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 1.75, y: 1.75};
        this.offSet = {x: -0.5, y: -17.418};
        this.attachTo = new Map();
        this.refArray = [
            {id: "pin14", ref: this.pin14},
            {id: "pin13", ref: this.pin13},
            {id: "pin12", ref: this.pin12},
            {id: "pin11", ref: this.pin11},
            {id: "pin10", ref: this.pin10},
            {id: "pin9", ref: this.pin9},
            {id: "pin8", ref: this.pin8},
            {id: "pin7", ref: this.pin7},
            {id: "pin6", ref: this.pin6},
            {id: "pin5", ref: this.pin5},
            {id: "pin4", ref: this.pin4},
            {id: "pin3", ref: this.pin3},
            {id: "pin2", ref: this.pin2},
            {id: "pin1", ref: this.pin1},
        ];
    }

    componentDidMount() {
        interact(this.node.current).styleCursor(false).draggable({
            listeners: {
                start: ()=> {
                    this.dragged = true;
                    this.attachedParts = new Map(this.attachTo);
                },
                move: (event) => {
                    if ((event.currentTarget === this.pin11.current && typeof this.props.movePart === "function") || App.selectedTool._currentValue === "wire_tool") {
                        this.props.movePart(event.dx, event.dy, this);
                    } else if (App.selectedTool._currentValue === "select_tool") {
                        const {interaction} = event;
                        interaction.stop();
                        interaction.start({name: "drag"}, event.interactable, this.pin11.current)
                    }
                }
            },
        })
    }

    onMouseUp() {
        if (!this.dragged) {
            this.props.handlePartSelect(this.getProps());
        }
        this.dragged = false;
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, () => this.props.updatePropertiesPanel(this.getProps()));
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, () => this.props.updatePropertiesPanel(this.getProps()));
        }
    }

    getProps() {
        return (
            {
                ref: this,
                callback: this.updateProp,
                props: [
                    {propName: "Type", propType: "string", value: this.state.type},
                    {propName: "Name", propType: "textfield", value: this.state.name},
                ]
            }

        )
    }

    highlight(attachRef) {
        let elementID = this.props.checkConnected(this, attachRef);

        if (!elementID.includes(undefined)) {
            this.highlightID = {ids: elementID, ref: attachRef};

            for (let connectorID of this.highlightID.ids)
                attachRef.node.current.querySelector("#" + connectorID).setAttribute("filter", "url(#f3)")
        }
    }

    connect(attachRef) {
        if (this.highlightID && this.highlightID.ids.length === 14) {
            let point = document.getElementById("AppSVG").createSVGPoint();
            let t = attachRef.state.rotation * Math.PI / 180;
            let breadboardDim = this.props.getDimensions(attachRef.node.current.querySelector("#" + this.highlightID.ids[3]), t);

            point.x = breadboardDim.x + breadboardDim.width / 2 * Math.cos(t) + breadboardDim.height / 2 * Math.sin(-t);
            point.y = breadboardDim.y + breadboardDim.width / 2 * Math.sin(t) + breadboardDim.height / 2 * Math.cos(t);
            const svgBreadboard = point.matrixTransform(document.getElementById("AppSVG").getScreenCTM().inverse());

            t = this.state.rotation * Math.PI / 180;
            let connectorDim = this.props.getDimensions(this.pin11.current, t);

            point.x = connectorDim.right - connectorDim.width / 2 * Math.cos(t);
            point.y = connectorDim.top + 8 - connectorDim.width / 2 * Math.sin(t);
            const svgConnector = point.matrixTransform(document.getElementById("AppSVG").getScreenCTM().inverse());

            for (let i = 0; i < this.refArray.length; i++) {
                this.attachTo.set(this.refArray[i].id, {id: this.highlightID.ids[i], ref: attachRef});

                if (typeof attachRef.connectPart === "function")
                    attachRef.connectPart(this.highlightID.ids[i], this.refArray[i].id, this);
            }
            this.setState({
                translation: {
                    x: this.state.translation.x + svgBreadboard.x - svgConnector.x,
                    y: this.state.translation.y + svgBreadboard.y - svgConnector.y
                }
            });
        }
    }

    disconnect() {
        if (this.highlightID)
            for (let id of this.highlightID.ids)
                if (id)
                    this.highlightID.ref.node.current.querySelector("#" + id).setAttribute("filter", "");

        for (let refData of this.refArray) {
            if (this.attachTo.get(refData.id) && typeof this.attachTo.get(refData.id).ref.disconnectPart === "function") {
                this.attachTo.get(refData.id).ref.disconnectPart(this.attachTo.get(refData.id).id, this);
            }
            this.attachTo.set(refData.id, undefined);
        }
        this.highlightID = undefined;
    }

    render() {
        return (
            <g ref={this.node} onMouseUp={this.onMouseUp} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `` : `scale(${this.scale.x} ${this.scale.y}) rotate(${0} ${0} ${0}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <g id="pins">
                        <path ref={this.pin14} id="pin_x5F_14" fill="#606262" d="M3,23l1-4.582c0-0.552,0.448-1,1-1s1,0.448,1,1L7,23H3z"/>
                        <path ref={this.pin13} id="pin_x5F_13" fill="#606262" d="M12,23l1-4.582c0-0.552,0.448-1,1-1s1,0.448,1,1L16,23H12z"/>
                        <path ref={this.pin12} id="pin_x5F_12" fill="#606262" d="M21,23l1-4.582c0-0.552,0.448-1,1-1s1,0.448,1,1L25,23H21z"/>
                        <path ref={this.pin11} id="pin_x5F_11" className="connector" fill="#606262" d="M30,23l1-4.582c0-0.552,0.448-1,1-1s1,0.448,1,1L34,23H30z"/>
                        <path ref={this.pin10} id="pin_x5F_10" fill="#606262" d="M39,23l1-4.582c0-0.552,0.447-1,1-1s1,0.448,1,1L43,23H39z"/>
                        <path ref={this.pin9} id="pin_x5F_9" fill="#606262" d="M48,23l1-4.582c0-0.552,0.447-1,1-1s1,0.448,1,1L52,23H48z"/>
                        <path ref={this.pin8} id="pin_x5F_8" fill="#606262" d="M57,23l1-4.582c0-0.552,0.447-1,1-1s1,0.448,1,1L61,23H57z"/>
                        <path ref={this.pin7} id="pin_x5F_7" fill="#606262" d="M61,41l-1,4.582c0,0.553-0.447,1-1,1s-1-0.447-1-1L57,41H61z"/>
                        <path ref={this.pin6} id="pin_x5F_6" fill="#606262" d="M52,41l-1,4.582c0,0.553-0.447,1-1,1s-1-0.447-1-1L48,41H52z"/>
                        <path ref={this.pin5} id="pin_x5F_5" fill="#606262" d="M43,41l-1,4.582c0,0.553-0.447,1-1,1s-1-0.447-1-1L39,41H43z"/>
                        <path ref={this.pin4} id="pin_x5F_4" fill="#606262" d="M34,41l-1,4.582c0,0.553-0.448,1-1,1s-1-0.448-1-1L30,41H34z"/>
                        <path ref={this.pin3} id="pin_x5F_3" fill="#606262" d="M25,41l-1,4.582c0,0.552-0.447,1-1,1s-1-0.448-1-1L21,41H25z"/>
                        <path ref={this.pin2} id="pin_x5F_2" fill="#606262" d="M16,41l-1,4.582c0,0.552-0.447,1-1,1s-1-0.448-1-1L12,41H16z"/>
                        <path ref={this.pin1} id="pin_x5F_1" fill="#606262" d="M7,41l-1,4.582c0,0.552-0.447,1-1,1s-1-0.448-1-1L3,41H7z"/>
                    </g>
                    <g id="body">
                        <path fill="#303030" d="M63.5,40.999c0,0.553-0.449,1.001-1.002,1.001H1.5c-0.554,0-1-0.448-1-1.001V23c0-0.552,0.446-1,1-1h60.998
            c0.553,0,1.002,0.448,1.002,1V40.999z"/>
                        <path fill="#262626" d="M0.5,28.5C2.433,28.5,4,30.067,4,32s-1.567,3.5-3.5,3.5"/>
                        <circle fill="#262626" cx="5" cy="38" r="1.75"/>
                    </g>
                    <text transform="matrix(1 0 0 1 15.667 34.9219)" fill="#EFEFEF" fontFamily="Roboto" fontSize="10"
                        fontStretch="condensed" fontWeight="bold">74HC08
                    </text>
                    <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeLinecap="round"
                        strokeLinejoin="round" strokeMiterlimit="10" d="
            M62.498,22h-1.717L60,18.418c0-0.552-0.447-1-1-1s-1,0.448-1,1L57.219,22h-5.438L51,18.418c0-0.552-0.447-1-1-1s-1,0.448-1,1
            L48.219,22h-5.438L42,18.418c0-0.552-0.447-1-1-1s-1,0.448-1,1L39.219,22h-5.438L33,18.418c0-0.552-0.448-1-1-1s-1,0.448-1,1
            L30.218,22h-5.437L24,18.418c0-0.552-0.448-1-1-1s-1,0.448-1,1L21.218,22h-5.437L15,18.418c0-0.552-0.448-1-1-1s-1,0.448-1,1
            L12.218,22H6.782L6,18.418c0-0.552-0.448-1-1-1s-1,0.448-1,1L3.218,22H1.5c-0.554,0-1,0.448-1,1v5.5v7v5.499
            C0.5,41.552,0.946,42,1.5,42h1.718L4,45.582c0,0.552,0.447,1,1,1s1-0.448,1-1L6.782,42h5.437L13,45.582c0,0.552,0.447,1,1,1
            s1-0.448,1-1L15.782,42h5.437L22,45.582c0,0.552,0.447,1,1,1s1-0.448,1-1L24.782,42h5.437L31,45.582c0,0.552,0.448,1,1,1
            s1-0.447,1-1L33.781,42h5.438L40,45.582c0,0.553,0.447,1,1,1s1-0.447,1-1L42.781,42h5.438L49,45.582c0,0.553,0.447,1,1,1
            s1-0.447,1-1L51.781,42h5.438L58,45.582c0,0.553,0.447,1,1,1s1-0.447,1-1L60.781,42h1.717c0.553,0,1.002-0.448,1.002-1.001V23
            C63.5,22.448,63.051,22,62.498,22z"/>
                </g>
            </g>
        )
    }
}