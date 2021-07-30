import React from "react";
import interact from "interactjs";

export default class Switch extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.leftConnector = React.createRef();
        this.middleConnector = React.createRef();
        this.rightConnector = React.createRef();

        this.state = {
            type: "Switch",
            name: "Switch",
            isSelected: false,
            isToggled: false,
            translation: {x: 0, y: 0},
            rotation: 0
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 0.65, y: 0.65};
        this.offSet = {x: -0.5, y: -15.441};
        this.attachTo = new Map();
        this.refArray = [
            {id: "left", ref: this.leftConnector},
            {id: "middle", ref: this.middleConnector},
            {id: "right", ref: this.rightConnector}
        ];

    }

    componentDidMount() {
        interact(this.node.current).styleCursor(false).draggable({
            listeners: {
                move: event => {
                    if (event.currentTarget === this.leftConnector.current && typeof this.props.movePart === "function") {
                        this.props.movePart(event, this);
                    } else {
                        const {interaction} = event;
                        interaction.stop();
                        interaction.start({name: "drag"}, event.interactable, this.leftConnector.current)
                    }
                }
            },
        })
    }

    onDoubleClick() {
        this.props.onDoubleTap(this.getProps());

        //For testing purposes:
        this.setState({isToggled: !this.state.isToggled})
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
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

    highlight(event, attachRef) {
        let elementID = this.checkConnected(attachRef);

        if (elementID.length === 3) {
            this.highlightID = {ids: elementID, ref: attachRef};

            for (let connectorID of this.highlightID.ids)
                attachRef.node.current.querySelector("#" + connectorID).setAttribute("filter", "url(#f3)")
        }
    }

    connect(relatedTarget, currentTarget, attachRef) {  
        let point = document.getElementById("AppSVG").createSVGPoint();
        let matrix = currentTarget.getCTM();
        let t = this.state.rotation * Math.PI / 180;
        
        point.x = currentTarget.getBBox().x;  
        point.y = currentTarget.getBBox().y;  
        let breadboardXY = point.matrixTransform(matrix);

        point.x = currentTarget.getBBox().x + currentTarget.getBBox().width;  
        point.y = currentTarget.getBBox().y + currentTarget.getBBox().height;  
        let breadboardRB = point.matrixTransform(matrix);

        point.x = breadboardXY.x + (breadboardRB.x - breadboardXY.x) / 2;
        point.y = breadboardXY.y + (breadboardRB.y - breadboardXY.y) / 2;
        const svgBreadboard = point.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );

        
        matrix = this.leftConnector.current.getCTM();
        point.x = this.leftConnector.current.getBBox().x;  
        point.y = this.leftConnector.current.getBBox().y;  
        let connectorXY = point.matrixTransform(matrix);
        
        point.x = this.leftConnector.current.getBBox().x + this.leftConnector.current.getBBox().width;
        point.y = this.leftConnector.current.getBBox().y + this.leftConnector.current.getBBox().height;
        let connectorRB = point.matrixTransform(matrix);
        
        let connectorWidth = Math.abs((connectorRB.x - connectorXY.x) * Math.cos(t) + (connectorRB.y - connectorXY.y) * Math.sin(t));

        let pointConnector = document.getElementById("AppSVG").createSVGPoint();
        pointConnector.x = connectorRB.x - (connectorWidth / 2) * Math.cos(t);
        pointConnector.y = connectorRB.y - (connectorWidth / 2) * Math.sin(t);
        const svgConnector = pointConnector.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );

        if (this.highlightID && this.highlightID.ids.length === 3) {
            for (let i = 0; i < this.refArray.length; i++) {
                this.attachTo.set(this.refArray[i].id, {id: this.highlightID.ids[i], ref: attachRef});
                
                if (typeof attachRef.connectPart === "function") 
                    attachRef.connectPart(this.highlightID.ids[i], this.refArray[i].id, this);
            }
            
            this.setState({translation: {
                x: this.state.translation.x + svgBreadboard.x - svgConnector.x + 0.4 * Math.cos(t),
                y: this.state.translation.y + svgBreadboard.y - svgConnector.y + 0.4 * Math.sin(t)}
            });
        }
    }

    disconnect() {
        if (this.highlightID)
            for (let id of this.highlightID.ids)
                this.highlightID.ref.node.current.querySelector("#" + id).setAttribute("filter", "");

        for (let refData of this.refArray) {
            if (this.attachTo.get(refData.id) && typeof this.attachTo.get(refData.id).ref.disconnectPart === "function") {
                this.attachTo.get(refData.id).ref.disconnectPart(this.attachTo.get(refData.id).id, this);
            }
            this.attachTo.set(refData.id, undefined);
        }
        this.highlightID = undefined;
    }

    rotate(attahRef) {
        this.setState({rotation: this.state.rotation + 15}, () => {
            if (attahRef) {
                this.connect(this.leftConnector.current, attahRef.node.current.querySelector("#" + this.attachTo.get("left").id), attahRef);
            } else {
                this.disconnect();
            }
        })
    }

    checkConnected(attachRef) {
        let elementID = [];
        let connectors = Array.prototype.slice.call(attachRef.connectors);

        if (connectors) {
            for (let refData of this.refArray) {
                let element = undefined;

                for (let connector of connectors) {
                    let rect1 = refData.ref.current.getBoundingClientRect();
                    let rect2 = connector.getBoundingClientRect();
                    let overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);

                    if (overlap) {
                        let xConnection = refData.ref.current.getBoundingClientRect().x + refData.ref.current.getBoundingClientRect().width / 2;
                        let yConnection = refData.ref.current.getBoundingClientRect().y + refData.ref.current.getBoundingClientRect().height;
    
                        let xConnector = connector.getBoundingClientRect().x + connector.getBoundingClientRect().width / 2;
                        let yConnector = connector.getBoundingClientRect().y + connector.getBoundingClientRect().height / 2;

                        let t = attachRef.state.rotation * (Math.PI / 180);
                        let w, h;

                        if (attachRef.state.rotation % 360 !== 45) {
                            w = (1 / (Math.cos(t) * Math.cos(t) - Math.sin(t) * Math.sin(t))) * ( connector.getBoundingClientRect().width * Math.cos(t) - connector.getBoundingClientRect().height * Math.sin(t))
                            h = (1 / (Math.cos(t) * Math.cos(t) - Math.sin(t) * Math.sin(t))) * (-connector.getBoundingClientRect().width * Math.sin(t) + connector.getBoundingClientRect().height * Math.cos(t))
                        } else {
                            w = (connector.getBoundingClientRect().width * Math.cos(t) + connector.getBoundingClientRect().height * Math.sin(t)) / 2;
                            h = (connector.getBoundingClientRect().width * Math.sin(t) + connector.getBoundingClientRect().height * Math.cos(t)) / 2;
                        }            
                        let radiusX = Math.abs(w) / 2;
                        let radiusY = Math.abs(h) / 2;
                        let ellispeArea = (xConnection - xConnector) * (xConnection - xConnector) / (radiusX * radiusX) + (yConnection - yConnector) * (yConnection - yConnector) / (radiusY * radiusY);
    
                        if (ellispeArea <= 1) 
                            element = connector;
                        break;
                    }
                }
                
                if (element) {
                    if (attachRef.connectedParts && (attachRef.connectedParts.get(element.id) === undefined || attachRef.connectedParts.get(element.id).ref === this))
                        elementID.push(element.id);
                }
            }
        }
        return elementID;
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
            <g ref={this.node} onDoubleClick={this.onDoubleClick}  transform={`translate(${this.state.translation.x} ${this.state.translation.y})`}>
                <g transform={this.props.icon ? `` : `scale(${this.scale.x} ${this.scale.y}) rotate(${this.state.rotation} ${rotatePointX} ${rotatePointY}) translate(${this.offSet.x} ${this.offSet.y})`}>
                    <path ref={this.leftConnector} className="connector" id="pin1" fill="#606161" d="M10.023,47.095c0,0.81-0.657,1.465-1.465,1.465l0,0c-0.809,0-1.465-0.655-1.465-1.465
            L5.628,36.441c0-0.811,2.122-1.466,2.93-1.466l0,0c0.809,0,2.93,0.655,2.93,1.466L10.023,47.095z"/>
                    <path ref={this.middleConnector} id="pin2" fill="#606161" d="M33.465,47.095c0,0.81-0.656,1.465-1.465,1.465l0,0c-0.809,0-1.465-0.655-1.465-1.465
            L29.07,36.441c0-0.811,2.122-1.466,2.93-1.466l0,0c0.809,0,2.931,0.655,2.931,1.466L33.465,47.095z"/>
                    <path ref={this.rightConnector} id="pin3" fill="#606161" d="M56.907,47.095c0,0.81-0.655,1.465-1.466,1.465l0,0c-0.81,0-1.465-0.655-1.465-1.465
            l-1.465-10.653c0-0.811,2.12-1.466,2.93-1.466l0,0c0.811,0,2.931,0.655,2.931,1.466L56.907,47.095z"/>
                    <path id="body" fill="#3A3A3A" d="M63.5,35.631c0,3.399-2.251,6.182-5.001,6.182H5.5c-2.75,0-5-2.782-5-6.182V21.622
            c0-3.399,2.25-6.181,5-6.181h52.999c2.75,0,5.001,2.781,5.001,6.181V35.631z"/>
                    <rect id="innerbevel" x="8.558" y="19.197" fill="#141414" width="46.883" height="18.861"/>
                    <rect id="togglebevelbody" x={this.state.isToggled ? "32" : "11.49"} y="21.666" fill="#606161" width="20.376" height="13.919"/>
                    <rect id="togglebevel1" x={this.state.isToggled ? "32" : "11.49"} y="21.666" fill="#707071" width="2.93" height="13.922"/>
                    <rect id="togglebevel2" x={this.state.isToggled ? "37.859" : "17.349"} y="21.665" fill="#707071" width="2.931" height="13.92"/>
                    <rect id="togglebevel3" x={this.state.isToggled ? "43.72" : "23.209"} y="21.666" fill="#707071" width="2.93" height="13.922"/>
                    <rect id="togglebevel4" x={this.state.isToggled ? "49.58" : "29.07"} y="21.665" fill="#707071" width="2.93" height="13.92"/>
                    <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"}  strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="
            M58.499,15.441H5.5c-2.75,0-5,2.781-5,6.181v14.009c0,3.399,2.25,6.182,5,6.182h0.867l0.727,5.282c0,0.81,0.656,1.465,1.465,1.465
            s1.465-0.655,1.465-1.465l0.727-5.282h19.059l0.726,5.282c0,0.81,0.657,1.465,1.465,1.465s1.465-0.655,1.465-1.465l0.727-5.282
            H53.25l0.727,5.282c0,0.81,0.655,1.465,1.465,1.465c0.811,0,1.466-0.655,1.466-1.465l0.727-5.282h0.865
            c2.75,0,5.001-2.782,5.001-6.182V21.622C63.5,18.222,61.249,15.441,58.499,15.441z"/>
                </g>
            </g>
        )
    }
}