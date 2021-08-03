import React from "react";
import interact from "interactjs";
import Interactable from "../Interactable";

export default class Resistor extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.connectorContainer = React.createRef();
        this.left = React.createRef();
        this.right = React.createRef();

        this.state = {
            type: "Resistor",
            name: "Resistor",
            resistance: "220",
            unit: "Ω",
            band1Colour: "#ff0000",
            band2Colour: "#ff0000",
            band3Colour: "#964b00",
            band4Colour: "#cfb53b",
            isSelected: false,
            leftPoint: {x: -0.5, y: -0.453},
            rightPoint: {x: -0.182, y: -0.453},
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 100, y: 75};
        this.offSet = {x: 0.5, y: 0.53};
        this.rotation = 0;
        this.attachTo = new Map();
        this.refArray = [
            {id: "left", ref: this.left},
            {id: "right", ref: this.right},
        ];
    }
    
    draggableOptionsLeft = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                let angle = this.state.rotation * Math.PI / 180;

                this.setState({
                    leftPoint: {
                        x: this.state.leftPoint.x + event.delta.x * scale / this.scale.x * Math.cos(angle) + event.delta.y * scale / this.scale.y * Math.sin(angle),
                        y: this.state.leftPoint.y + event.delta.y * scale / this.scale.y * Math.cos(angle) + event.delta.x * scale / this.scale.x * Math.sin(-angle)
                    }
                });
            }
        }
    }

    draggableOptionsRight = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                let angle = this.state.rotation * Math.PI / 180;

                this.setState({
                    rightPoint: {
                        x: this.state.rightPoint.x + event.delta.x * scale / this.scale.x * Math.cos(angle) + event.delta.y * scale / this.scale.y * Math.sin(angle),
                        y: this.state.rightPoint.y + event.delta.y * scale / this.scale.y * Math.cos(angle) + event.delta.x * scale / this.scale.x * Math.sin(-angle)
                    }
                });
            }
        }
    }

    componentDidMount() {
        interact(this.node.current).styleCursor(false).draggable({
            listeners: {
                move: event => {
                    if (event.currentTarget === this.connectorContainer.current && typeof this.props.movePart === "function") {
                        this.props.movePart(event, this);
                    } else {
                        const {interaction} = event;
                        interaction.stop()
                        interaction.start({name: "drag"}, event.interactable, this.connectorContainer.current);
                    }
                }
            },
        })
    }

    onDoubleClick() {
        this.props.onDoubleTap(this.getProps());
    }

    setBandColour(band, value) {
        /*
            black  == 0 | x1    Ω
            brown  == 1 | x10   Ω
            red    == 2 | x100  Ω
            orange == 3 | x1   kΩ
            yellow == 4 | x10  kΩ
            green  == 5 | x100 kΩ
            blue   == 6 | x1   MΩ
            purple == 7 | x10  MΩ
            grey   == 8 | x100 MΩ
            white  == 9 | x1   GΩ
         */
        switch (value) {
            case '0':
                this.setState({[band]: '#000'})
                break
            case '1':
                this.setState({[band]: '#964b00'})
                break
            case '2':
                this.setState({[band]: '#ff0000'})
                break
            case '3':
                this.setState({[band]: '#ffa500'})
                break
            case '4':
                this.setState({[band]: '#ffff00'})
                break
            case '5':
                this.setState({[band]: '#9acd32'})
                break
            case '6':
                this.setState({[band]: '#6495ed'})
                break
            case '7':
                this.setState({[band]: '#9400d3'})
                break
            case '8':
                this.setState({[band]: '#a0a0a0'})
                break
            case '9':
                this.setState({[band]: '#fff'})
                break
            case 'gold':
                this.setState({[band]: '#cfb53b'})
                break
            default:
                this.setState({[band]: '#fff'})
        }
    }

    updateBands() {
        let unit = this.state.unit
        let resistance = this.state.resistance

        switch (unit) {
            case 'kΩ':
                resistance = (resistance * 1000).toString()
                break
            case 'MΩ':
                resistance = (resistance * 1000000).toString()
                break
            default:
                resistance = (resistance * 1).toString()
        }

        if (resistance.length === 1) {
            // If resistance is 1 digits length
            if (resistance === '0') {
                /* If resistor is 0 Ohms, switch to 1 band resistor by setting rest of bands to colour of resistor
                and band 2 to black */
                this.setState({band1Colour: '#A08968'})
                this.setBandColour('band2Colour', '0')
                this.setState({band3Colour: '#A08968'})
                this.setState({band4Colour: '#A08968'})
            } else {
                // If resistor is not 0, change band 1 colour, default band 2 to black and band 3 to gold multiplier
                this.setBandColour('band1Colour', resistance[0])
                this.setBandColour('band2Colour', '0')
                this.setBandColour('band3Colour', 'gold')
                this.setBandColour('band4Colour', 'gold')
            }
        } else if (resistance.length === 2) {
            // If resistance is 2 digits length, default band 3 to black
            this.setBandColour('band1Colour', resistance[0])
            this.setBandColour('band2Colour', resistance[1])
            this.setBandColour('band3Colour', '0')
            this.setBandColour('band4Colour', 'gold')

        } else if (resistance.length > 2) {
            // If resistance is n digits length greater than 2
            this.setBandColour('band1Colour', resistance[0])
            this.setBandColour('band2Colour', resistance[1])
            this.setBandColour('band3Colour', resistance.slice(2).length.toString())
            this.setBandColour('band4Colour', 'gold')
        } else {
            // If resistance is undefined, default to 0 Ohm resistor
            this.setState({band1Colour: '#A08968'})
            this.setBandColour('band2Colour', '0')
            this.setState({band3Colour: '#A08968'})
            this.setState({band4Colour: '#A08968'})
        }


    }

    updateProp(propName, value) {
        console.log(propName, value)
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "resistance") {
            if (isNaN(value)) {
                this.setState({unit: value}, () => {
                    this.updateBands()
                    this.onDoubleClick()
                })
            } else {
                this.setState({resistance: value}, () => {
                    this.updateBands()
                    this.onDoubleClick()
                });
            }
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
                    {
                        propName: "Resistance",
                        propType: "autocomplete",
                        value: this.state.resistance,
                        defaultOptions: [
                            {label: "220 Ohms", value: "220", unit: "Ω"},
                            {label: "470 Ohms", value: "470", unit: "Ω"},
                            {label: "1k Ohms", value: "1", unit: "kΩ"},
                            {label: "10k Ohms", value: "10", unit: "kΩ"},
                        ],
                        units: ["Ω", "kΩ", "MΩ"],
                        selectedUnit: this.state.unit,
                        type: 'number',
                    },
                ]
            }

        )
    }

    highlight(event, attachRef) {
        let elementID = this.checkConnected(attachRef);
        this.highlightID = {ids: elementID, ref: attachRef};

        for (let connectorID of this.highlightID.ids)
            if (connectorID)
                attachRef.node.current.querySelector("#" + connectorID).setAttribute("filter", "url(#f3)")
    }

    connect(relatedTarget, currentTarget, attachRef) {
        if (this.highlightID) {
            for (let i = 0; i < this.refArray.length; i++) {
                if (this.highlightID.ids[i]) {
                    const xPos = (Number(attachRef.node.current.querySelector("#" + this.highlightID.ids[i]).getAttribute("cx")) + attachRef.offSet.x) * attachRef.scale.x / this.scale.x - this.offSet.x + (attachRef.state.translation.x - this.state.translation.x) / this.scale.x;
                    const yPos = (Number(attachRef.node.current.querySelector("#" + this.highlightID.ids[i]).getAttribute("cy")) + attachRef.offSet.y) * attachRef.scale.y / this.scale.y - this.offSet.y + (attachRef.state.translation.y - this.state.translation.y) / this.scale.y;

                    this.attachTo.set(this.refArray[i].id, {id: this.highlightID.ids[i], ref: attachRef});

                    if (typeof attachRef.connectPart === "function") {
                        attachRef.connectPart(this.highlightID.ids[i], this.refArray[i].id, this);
                    }
                    this.moveConnector(this.refArray[i].ref.current.node, xPos, yPos);
                }
            }
        }
        
    }

    disconnect(event) {
        if (event && (event.relatedTarget === this.right.current.node || event.relatedTarget === this.left.current.node)) {
            if (event.relatedTarget === this.right.current.node) {
                if (this.attachTo.get("right") && typeof this.attachTo.get("right").ref.disconnectPart === "function") {
                    this.attachTo.get("right").ref.disconnectPart(this.attachTo.get("right").id, this);
                }
                this.attachTo.set("right", undefined);
                event.currentTarget.setAttribute("filter", "");
            } else if (event.relatedTarget === this.left.current.node) {
                if (this.attachTo.get("left") && typeof this.attachTo.get("left").ref.disconnectPart === "function") {
                    this.attachTo.get("left").ref.disconnectPart(this.attachTo.get("left").id, this);
                }
                this.attachTo.set("left", undefined);
                event.currentTarget.setAttribute("filter", "");
            }
        } else {
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
    }

    moveConnector(connector, xPos, yPos) {
        if (connector === this.left.current.node) {
            this.setState({leftPoint: {x: xPos, y: yPos}});
        } else {
            this.setState({rightPoint: {x: xPos, y: yPos}});
        }
    }

    checkConnected(attachRef) {
        let elementID = [];
        let connectors = Array.prototype.slice.call(attachRef.connectors);

        if (connectors) {
            for (let refData of this.refArray) {
                let found = false;

                for (let connector of connectors) {
                    let rect1 = refData.ref.current.node.getBoundingClientRect();
                    let rect2 = connector.getBoundingClientRect();
                    let overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);

                    if (overlap && attachRef.connectedParts && (attachRef.connectedParts.get(connector.id) === undefined || attachRef.connectedParts.get(connector.id).ref === this)) {
                        found = true;
                        elementID.push(connector.id);
                        break;
                    }
                }
                
                if (!found)
                    elementID.push(undefined);
            }
        }
        return elementID;
    }

    onMouseEnter(event) {
        event.target.setAttribute("style", "cursor: move");
    }

    onMouseLeave(event) {
        event.target.setAttribute("style", "");
    }

    render() {
        let rotatePointX;
        let rotatePointY;

        if (this.node.current) {
            let partBBox = this.node.current.firstChild.getBBox();
            rotatePointX = partBBox.width / 2;
            rotatePointY = partBBox.height / 2;
            
        } else {
            rotatePointX = 0;
            rotatePointY = 0;
        }
        
        return (
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `translate(100,105) scale(200,150)` : `scale(${this.scale.x} ${this.scale.y}) rotate(${this.state.rotation} ${rotatePointX} ${rotatePointY}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <path stroke="#707071" strokeWidth="0.036" strokeLinecap="round"
                            d={`M ${(this.state.leftPoint.x + this.state.rightPoint.x + 0.5 + 0.182) / 2 - 0.5} ${(this.state.leftPoint.y + this.state.rightPoint.y + 0.453 + 0.453) / 2 - 0.453} L ${this.state.leftPoint.x} ${this.state.leftPoint.y}`}/>
                    <path stroke="#707071" strokeWidth="0.036" strokeLinecap="round"
                            d={`M ${(this.state.leftPoint.x + this.state.rightPoint.x + 0.5 + 0.182) / 2 - 0.182} ${(this.state.leftPoint.y + this.state.rightPoint.y + 0.453 + 0.453) / 2 - 0.453} L ${this.state.rightPoint.x} ${this.state.rightPoint.y}`}/>

                    <g transform={`translate(${(this.state.leftPoint.x + this.state.rightPoint.x + 0.5 + 0.182) / 2} ${(this.state.leftPoint.y + this.state.rightPoint.y + 0.453 + 0.453) / 2})`}>
                        <path fill="#A08968" d="M -0.5 -0.435 c 0.025 0 0.036 0.053 0.053 0.053 h 0.028 c 0.009 -0.005 0.017 -0.007 0.021 -0.007 h 0.071 h 0.043
                        c 0.009 0.005 0.017 0.007 0.021 0.007 h 0.028 c 0.018 0 0.028 -0.053 0.053 -0.053 v -0.036 c -0.025 0 -0.036 -0.053 -0.053 -0.053 h -0.027 c -0.005 0 -0.012 0.002 -0.021 0.007 h -0.122
                        c 0 0 -0.005 -0.002 -0.014 -0.007 h -0.029 c -0.018 0 -0.028 0.053 -0.052 0.053z"/>
                        <path fill={this.state.band1Colour}
                            d="M-0.447-0.382c0.009,0.005,0.019,0.005,0.028,0v-0.143c-0.009-0.005-0.019-0.005-0.028,0"/>
                        <path fill={this.state.band2Colour} d="M-0.378-0.389h0.025v-0.129h-0.025"/>
                        <path fill={this.state.band3Colour} d="M-0.325-0.389H-0.3v-0.129h-0.025"/>
                        <path fill={this.state.band4Colour}
                            d="M-0.261-0.382c0.009,0.005,0.019,0.005,0.028,0v-0.143c-0.009-0.005-0.019-0.005-0.028,0"/>
                        <path fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="0.015"
                            strokeMiterlimit="50" strokeLinecap="round" strokeLinejoin="round" d="M -0.5 -0.435 c 0.025 0 0.036 0.053 0.053 0.053 h 0.028 c 0.009 -0.005 0.017 -0.007 0.021 -0.007 h 0.071 h 0.043
                        c 0.009 0.005 0.017 0.007 0.021 0.007 h 0.028 c 0.018 0 0.028 -0.053 0.053 -0.053 v -0.036 c -0.025 0 -0.036 -0.053 -0.053 -0.053 h -0.027 c -0.005 0 -0.012 0.002 -0.021 0.007 h -0.122
                        c 0 0 -0.005 -0.002 -0.014 -0.007 h -0.029 c -0.018 0 -0.028 0.053 -0.052 0.053z"/>
                        
                        <g ref={this.connectorContainer} className="connector">
                            <Interactable 
                                ref={this.left} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsLeft}>
                                <ellipse
                                    onMouseEnter={this.onMouseEnter}
                                    onMouseLeave={this.onMouseLeave}
                                    className="connector" strokeOpacity="0" fillOpacity="0"
                                    cx={this.state.leftPoint.x - (this.state.leftPoint.x + this.state.rightPoint.x + 0.5 + 0.182) / 2} cy={this.state.leftPoint.y - (this.state.leftPoint.y + this.state.rightPoint.y + 0.453 + 0.453) / 2}
                                    rx="0.015" ry="0.02"/>
                            </Interactable>

                            <Interactable 
                                ref={this.right} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsRight}>
                                <ellipse
                                    onMouseEnter={this.onMouseEnter}
                                    onMouseLeave={this.onMouseLeave}
                                    className="connector" strokeOpacity="0" fillOpacity="0"
                                    cx={this.state.rightPoint.x - (this.state.leftPoint.x + this.state.rightPoint.x + 0.5 + 0.182) / 2} cy={this.state.rightPoint.y - (this.state.leftPoint.y + this.state.rightPoint.y + 0.453 + 0.453) / 2}
                                    rx="0.015" ry="0.02"/>
                            </Interactable>
                        </g>
                    
                    </g>
                </g>                
            </g>
        )
    }
}