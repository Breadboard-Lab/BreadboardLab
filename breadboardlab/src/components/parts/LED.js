import React from "react";
import interact from "interactjs";
import Interactable from "../Interactable";
import App from "../../App";

export default class LED extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.connectorContainer = React.createRef();
        this.cathode = React.createRef();
        this.anode = React.createRef();

        this.state = {
            type: "LED",
            name: "LED",
            colour: "Red",
            bodyColourRim: "hsl(0, 50%, 25%)",
            bodyColourTop: "hsl(0, 50%, 39%)",
            bodyColourBottom: "hsl(0, 50%, 34%)",
            cathodePoint: {x: 24, y: 62.5},
            anodePoint: {x: 40, y: 62.5},
            isSelected: false,
            translation: {x: 0, y: 0},
            rotation: 0,
            maxCurrent: 0.02,  // new for simulation (LED-specific)
            voltageDrop: 1.8,  // new for simulation
            intensity: 0.0,     // new for simulation
            forwardVoltage: 2.0
        }
        this.onMouseUp = this.onMouseUp.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 1, y: 1};
        this.offSet = {x: -15.3605, y: -0.5};
        this.rotatePoint = {x: 0, y: 0};
        this.attachTo = new Map();

        // this might be better using a map
        this.refArray = [
            {id: "cathode", ref: this.cathode},
            {id: "anode", ref: this.anode},
        ];
    }

    draggableOptionsCathode = {
        listeners: {
            start: () => {
                this.dragged = true;
                this.attachedParts = new Map(this.attachTo);
            },
            move: (event) => {
                this.props.moveLead(event.delta.x, event.delta.y, this, "cathodePoint");
            },
            end: (event) => {
                this.props.addLeadHistory(event.clientX0 - event.client.x, event.clientY0 - event.client.y, this._reactInternals.key, "cathodePoint", this.attachedParts);
            }
        }
    }

    draggableOptionsAnode = {
        listeners: {
            start: () => {
                this.dragged = true;
                this.attachedParts = new Map(this.attachTo);
            },
            move: (event) => {
                this.props.moveLead(event.delta.x, event.delta.y, this, "anodePoint");
            },
            end: (event) => {
                this.props.addLeadHistory(event.clientX0 - event.client.x, event.clientY0 - event.client.y, this._reactInternals.key, "anodePoint", this.attachedParts);
            }
        }
    }

    componentDidMount() {
        interact(this.node.current).styleCursor(false).draggable({
            listeners: {
                start: () => {
                    this.dragged = true;
                    this.attachedParts = new Map(this.attachTo);
                },
                move: event => {
                    if ((event.currentTarget === this.connectorContainer.current && typeof this.props.movePart === "function") || App.selectedTool._currentValue === "wire_tool") {
                        this.props.movePart(event.dx, event.dy, this);
                    } else if (App.selectedTool._currentValue === "select_tool") {
                        const {interaction} = event;
                        interaction.stop()
                        interaction.start({name: "drag"}, event.interactable, this.connectorContainer.current);
                    }
                },
                end: (event) => {
                    this.props.addMoveHistory(event.clientX0 - event.client.x, event.clientY0 - event.client.y, this._reactInternals.key, this.attachedParts);
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
        } else if (propName.toLowerCase() === "colour") {
            this.setState({colour: value}, () => this.props.updatePropertiesPanel(this.getProps()));

            // Changes LED colour based on Properties Panel Colour Selection
            switch (value) {
                case "Red":
                    this.setState({
                        bodyColourRim: "hsl(0, 50%, 25%)",
                        bodyColourTop: "hsl(0, 50%, 39%)",
                        bodyColourBottom: "hsl(0, 50%, 34%)",
                    })
                    break
                case "Blue":
                    this.setState({
                        bodyColourRim: "hsl(210, 50%, 25%)",
                        bodyColourTop: "hsl(210, 50%, 39%)",
                        bodyColourBottom: "hsl(210, 50%, 34%)",
                    })
                    break
                case "Green":
                    this.setState({
                        bodyColourRim: "hsl(115,25%,25%)",
                        bodyColourTop: "hsl(115, 25%, 39%)",
                        bodyColourBottom: "hsl(115, 25%, 34%)",
                    })
                    break
                case "Yellow":
                    this.setState({
                        bodyColourRim: "hsl(55, 25%, 25%)",
                        bodyColourTop: "hsl(55, 25%, 39%)",
                        bodyColourBottom: "hsl(55, 25%, 34%)",
                    })
                    break
                default:
                    this.setState({
                        bodyColourRim: "hsl(0, 50%, 25%)",
                        bodyColourTop: "hsl(0, 50%, 39%)",
                        bodyColourBottom: "hsl(0, 50%, 34%)",
                    })
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
                        propName: "Colour",
                        propType: "select",
                        value: this.state.colour,
                        options: ["Red", "Blue", "Green", "Yellow"]
                    }
                ]
            }

        )
    }

    highlight(attachRef) {
        let elementID = this.props.checkConnected(this, attachRef);
        this.highlightID = {ids: elementID, ref: attachRef};

        for (let connectorID of this.highlightID.ids)
            if (connectorID)
                attachRef.node.current.querySelector("#" + connectorID).setAttribute("filter", "url(#f3)")
    }

    connect(attachRef) {
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
        if (event && (event.relatedTarget === this.anode.current.node || event.relatedTarget === this.cathode.current.node)) {
            if (event.relatedTarget === this.anode.current.node) {
                if (this.attachTo.get("anode") && typeof this.attachTo.get("anode").ref.disconnectPart === "function") {
                    this.attachTo.get("anode").ref.disconnectPart(this.attachTo.get("anode").id, this);
                }
                this.attachTo.set("anode", undefined);
                event.currentTarget.setAttribute("filter", "");
            } else if (event.relatedTarget === this.cathode.current.node) {
                if (this.attachTo.get("cathode") && typeof this.attachTo.get("cathode").ref.disconnectPart === "function") {
                    this.attachTo.get("cathode").ref.disconnectPart(this.attachTo.get("cathode").id, this);
                }
                this.attachTo.set("cathode", undefined);
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

    rotate(attahRef) {
        let partBBox = this.node.current.firstChild.getBBox();
        this.rotatePoint.x = partBBox.width / 2;
        this.rotatePoint.y = partBBox.height / 2;

        this.setState({rotation: this.state.rotation + 15}, () => {
            if (attahRef) {
                this.connect(attahRef);
            } else {
                this.disconnect();
            }
        });
    }

    moveConnector(connector, xPos, yPos) {
        if (connector === this.cathode.current.node) {
            this.setState({cathodePoint: {x: xPos, y: yPos}});
        } else {
            this.setState({anodePoint: {x: xPos, y: yPos}});
        }
    }

    onMouseEnter(event) {
        event.target.setAttribute("style", "cursor: move");
    }

    onMouseLeave(event) {
        event.target.setAttribute("style", "");
    }

    render() {
        return (
            <g ref={this.node} onMouseUp={this.onMouseUp}
               transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `` : `scale(${this.scale.x} ${this.scale.y}) rotate(${this.state.rotation} ${this.rotatePoint.x} ${this.rotatePoint.y}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <path id="cathode" fill="#707071" d="M24,63.5c-1.104,0-2-0.882-2-1.969v-15.75c0-1.087,0.896-1.969,2-1.969s2,0.882,2,1.969
                v15.75C26,62.618,25.104,63.5,24,63.5z"/>
                    <path id="anode" fill="#707071" d="M40,63.5c-1.104,0-2-0.882-2-1.969v-2.884l-5.109-3.354C32.334,54.929,32,54.314,32,53.656
                v-7.875c0-1.087,0.896-1.969,2-1.969s2,0.882,2,1.969v6.821l5.109,3.354C41.666,56.321,42,56.936,42,57.594v3.938
                C42,62.618,41.104,63.5,40,63.5z"/>
                    <path id="rim" fill={this.state.bodyColourRim} d="M30.721,22.431c-6.338,0-11.775,2.932-14.721,6.946v12.846
                c2.946,3.442,8.383,5.526,14.721,5.526C39.685,47.75,48,42.802,48,35.091C48,24.61,40.266,22.431,30.721,22.431z"/>
                    <path id="top" fill={this.state.bodyColourTop} d="M30.644,0.5C22.557,0.5,16,6.863,16,14.712v18.509h14.644h14.645V14.712
                C45.288,6.863,38.731,0.5,30.644,0.5z"/>
                    <path id="bottom" fill={this.state.bodyColourBottom} d="M45.282,33.22c0,5.662-6.554,10.251-14.639,10.251
                c-8.084,0-14.637-4.589-14.637-10.251c0-5.659,6.553-10.248,14.637-10.248C38.729,22.972,45.282,27.561,45.282,33.22z"/>

                    <path stroke="#707071" strokeWidth="4" strokeLinecap="round"
                          d={`M ${24} ${62.5} L ${this.state.cathodePoint.x} ${this.state.cathodePoint.y}`}/>
                    <path stroke="#707071" strokeWidth="4" strokeLinecap="round"
                          d={`M ${40} ${62.5} L ${this.state.anodePoint.x} ${this.state.anodePoint.y}`}/>

                    <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"}
                          strokeLinecap="round" strokeWidth="4" strokeLinejoin="round" strokeMiterlimit="10" d="
                M48,35.091c0-3.75-1.003-6.422-2.712-8.327V14.712c0-7.849-6.557-14.212-14.645-14.212C22.557,0.5,16,6.863,16,14.712v14.666
                v3.843v9.003c1.455,1.7,3.521,3.068,6,4.019v15.289c0,1.087,0.896,1.969,2,1.969s2-0.882,2-1.969V47.339
                c1.495,0.269,3.077,0.411,4.721,0.411c0.429,0,0.854-0.021,1.279-0.044v5.95c0,0.658,0.334,1.272,0.891,1.638L38,58.647v2.884
                c0,1.087,0.896,1.969,2,1.969s2-0.882,2-1.969v-3.938c0-0.658-0.334-1.272-0.891-1.638L36,52.603v-5.448
                C42.697,45.631,48,41.246,48,35.091z"/>

                    <g ref={this.connectorContainer} className="connector">
                        <Interactable
                            ref={this.cathode} styleCursor={false} draggable={true}
                            draggableOptions={this.draggableOptionsCathode}>
                            <ellipse
                                onMouseEnter={this.onMouseEnter}
                                onMouseLeave={this.onMouseLeave}
                                className="connector" strokeOpacity="0" fillOpacity="0"
                                cx={this.state.cathodePoint.x} cy={this.state.cathodePoint.y}
                                rx="2" ry="2"/>
                        </Interactable>

                        <Interactable
                            ref={this.anode} styleCursor={false} draggable={true}
                            draggableOptions={this.draggableOptionsAnode}>
                            <ellipse
                                onMouseEnter={this.onMouseEnter}
                                onMouseLeave={this.onMouseLeave}
                                className="connector" strokeOpacity="0" fillOpacity="0"
                                cx={this.state.anodePoint.x} cy={this.state.anodePoint.y}
                                rx="2" ry="2"/>
                        </Interactable>
                    </g>
                </g>
            </g>
        )
    }

    /**
     * currentToIntensity
     *
     * Determines how bright the LED should be given the current passing through.
     * Any current between 0A and the maximum will be calculated on a linear scale.
     *
     * @returns {number} A value between 0.0 and 1.0, defaults to 0 (off) if not within tolerance.
     */
    currentToIntensity() {
        // console.log("currentCurrent, maxCurrent:", this.state.current, this.state.maxCurrent)
        if (this.state.current > this.state.maxCurrent) {
            return 0;
        } else {
            return this.state.current / this.state.maxCurrent;
        }
    }

    /**
     * setIntensity
     *
     * Maps intensity to hsl value.
     */
    setIntensity() {
        let intensity = Math.ceil(this.currentToIntensity() * 25)
        // console.log(intensity)

        switch (this.state.colour) {
            case "Red":
                this.setState({
                    bodyColourRim: `hsl(0, ${50 + intensity}%, ${25 + intensity}%)`,
                    bodyColourTop: `hsl(0, ${50 + intensity}%, ${39 + intensity}%)`,
                    bodyColourBottom: `hsl(0, ${50 + intensity}%, ${34 + intensity}%)`,
                })
                break
            case "Blue":
                this.setState({
                    bodyColourRim: `hsl(210, ${50 + intensity}%, ${25 + intensity}%)`,
                    bodyColourTop: `hsl(210, ${50 + intensity}%, ${39 + intensity}%)`,
                    bodyColourBottom: `hsl(210, ${50 + intensity}%, ${34 + intensity}%)`,
                })
                break
            case "Green":
                this.setState({
                    bodyColourRim: `hsl(115 ${25 + intensity}%, ${25 + intensity}%)`,
                    bodyColourTop: `hsl(115, ${25 + intensity}%, ${39 + intensity}%)`,
                    bodyColourBottom: `hsl(115, ${25 + intensity}%, ${34 + intensity}%`,
                })
                break
            case "Yellow":
                this.setState({
                    bodyColourRim: `hsl(55, ${25 + intensity}%, ${25 + intensity}%)`,
                    bodyColourTop: `hsl(55, ${25 + intensity}%, ${39 + intensity}%)`,
                    bodyColourBottom: `hsl(55, ${25 + intensity}%, ${34 + intensity}%)`,
                })
                break
            default:
                this.setState({
                    bodyColourRim: `hsl(0, ${50 + intensity}%, ${25 + intensity}%)`,
                    bodyColourTop: `hsl(0, ${50 + intensity}%, ${39 + intensity}%)`,
                    bodyColourBottom: `hsl(0, ${50 + intensity}%, ${34 + intensity}%)`,
                })
        }
    }
}