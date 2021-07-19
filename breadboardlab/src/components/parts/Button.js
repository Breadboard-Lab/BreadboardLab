import React from "react";
import interact from "interactjs";

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.topLeftConector = React.createRef();
        this.topRightConector = React.createRef();
        this.bottomLeftConector = React.createRef();
        this.bottomRightConector = React.createRef();
        
        this.state = {
            type: "Momentary Button",
            name: "Momentary Button",
            isSelected: false,
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 50, y: 50};
        this.offSet = {x: 0.3, y: 0.35};
        this.cursorOffset = {x: undefined, y: undefined};
        this.attachTo = new Map();
        this.refArray = [
            {id: "topLeft", ref: this.topLeftConector},
            {id: "topRight", ref: this.topRightConector},
            {id: "bottomLeft", ref: this.bottomLeftConector},
            {id: "bottomRight", ref: this.bottomRightConector}
        ];
    }

    componentDidMount() {
        interact(this.node.current.parentNode).styleCursor(false).draggable({
			listeners: {
                start: event => {
                    this.cursorOffset.x = event.client.x - event.currentTarget.closest(".part").getBoundingClientRect().x; 
                    this.cursorOffset.y = event.client.y - event.currentTarget.closest(".part").getBoundingClientRect().top; 
                },
				move: event => {
                    if (event.currentTarget === this.topLeftConector.current && typeof this.props.movePart === "function") {
                        this.props.movePart(event);
                    } else {
                        const {interaction} = event;
                        interaction.stop();
                        interaction.start({name: "drag"}, event.interactable, this.topLeftConector.current)
                    }
                }
			},
		})
    }

    onDoubleClick() {
        this.props.onDoubleTap(this.getProps());
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type")
            this.setState({type: value}, this.onDoubleClick);
        else if (propName.toLowerCase() === "name")
            this.setState({name: value}, this.onDoubleClick);
    }

    getProps() {
        return(
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

        if (elementID.length === 4) {
            this.highlightID = {ids: elementID, ref: attachRef};

            for (let connectorID of this.highlightID.ids)
                attachRef.node.current.querySelector("#" + connectorID).setAttribute("filter", "url(#f3)")
        }
    }

    connect(relatedTarget, currentTarget, attachRef) {
		const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
        const currentTranslate = relatedTarget.closest(".part").getAttribute("transform");
		const relatedTargetTranslate = regexTranslate.exec(currentTranslate);
		const breadboardTranslate = regexTranslate.exec(currentTarget.closest(".part").getAttribute("transform"));

        if (breadboardTranslate && relatedTargetTranslate) {
            let angle = this.rotation || 0;
            
			let pointBreadboard = document.getElementById("AppSVG").createSVGPoint();
            pointBreadboard.x = currentTarget.getBoundingClientRect().x + currentTarget.getBoundingClientRect().width / 2;
            pointBreadboard.y = currentTarget.getBoundingClientRect().y + currentTarget.getBoundingClientRect().height / 2;
            const svgBreadboard = pointBreadboard.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );

            let pointConnector = document.getElementById("AppSVG").createSVGPoint();
            pointConnector.x = this.topLeftConector.current.getBoundingClientRect().x + this.topLeftConector.current.getBoundingClientRect().width / 2;
            pointConnector.y = this.topLeftConector.current.getBoundingClientRect().y + this.topLeftConector.current.getBoundingClientRect().height / 2;
            const svgConnector = pointConnector.matrixTransform( document.getElementById("AppSVG").getScreenCTM().inverse() );


            if (this.highlightID && this.highlightID.ids.length === 4) {
                for (let i = 0; i < this.refArray.length; i++) {
                    this.attachTo.set(this.refArray[i].id, {id: this.highlightID.ids[i], ref: attachRef});
                    
                    if (typeof attachRef.connectPart === "function") 
                        attachRef.connectPart(this.highlightID.ids[i], this.refArray[i].id, this);
                }
                this.node.current.closest(".part").setAttribute("transform", `translate(${Number(relatedTargetTranslate[1]) + svgBreadboard.x - svgConnector.x + 0.8 * Math.cos((angle - 135) * Math.PI / 180)} ${Number(relatedTargetTranslate[5]) + svgBreadboard.y - svgConnector.y + 0.8 * Math.sin((angle - 135) * Math.PI / 180)})`);
            }
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

    movePart(dx, dy) {
        const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
		const translate = regexTranslate.exec(this.node.current.closest(".part").getAttribute("transform"));
        
        if (translate)
            this.node.current.closest(".part").setAttribute("transform", `translate(${Number(translate[1]) + dx} ${Number(translate[5]) + dy})`);
    }

    rotate(attahRef) {
        if (typeof this.props.rotatePart === "function")
			this.props.rotatePart(this);
        
        if (attahRef) {
            this.connect(this.topLeftConector.current, attahRef.node.current.querySelector("#" + this.attachTo.get("topLeft").id), attahRef);
        } else {
            this.disconnect();
        }
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
                    let overlap = !(rect1.right - rect1.width / 2 < rect2.left + 5 || rect1.left + rect1.width / 2 > rect2.right - 5 || rect1.bottom - rect1.height / 2 < rect2.top + 5 || rect1.top + rect1.height / 2 > rect2.bottom - 5);

                    if (overlap) {
                        element = connector;
                        break;
                    }
                }
                
                if (element) {
                    let rect1 = refData.ref.current.getBoundingClientRect();
                    let rect2 = element.getBoundingClientRect();
                    let overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);

                    if (overlap && attachRef.connectedParts && (attachRef.connectedParts.get(element.id) === undefined || attachRef.connectedParts.get(element.id).ref === this))
                        elementID.push(element.id);
                }
            }
        }
        return elementID;
    }
    
    render() {
        return(
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(30, 33) scale(90,90)">
                <rect x="-0.3" y="-0.3" width="0.6" height="0.6" rx=".1" fill="#202020" />
                <rect x="-0.27" y="-0.27" width="0.54" height="0.54" rx=".1" fill="#707070" />
                <rect ref={this.topLeftConector} className="connector" x="-0.2" y="-0.35" width="0.06" height="0.05" fill="#707070" />
                <rect ref={this.topRightConector} x="0.14" y="-0.35" width="0.06" height="0.05" fill="#707070" />
                <rect ref={this.bottomLeftConector} x="-0.2" y="0.3" width="0.06" height="0.05" fill="#707070" />
                <rect ref={this.bottomRightConector} x="0.14" y="0.3" width="0.06" height="0.05" fill="#707070" />
                <circle cx="0" cy="0" r="0.15" fill="#000000" />
                <circle cx="0" cy="0" r="0.1" fill="#202020" />
                <circle cx="-0.18" cy="-0.18" r="0.03" fill="#202020" />
                <circle cx="0.18" cy="-0.18" r="0.03" fill="#202020" />
                <circle cx="-0.18" cy="0.18" r="0.03" fill="#202020" />
                <circle cx="0.18" cy="0.18" r="0.03" fill="#202020" />
                <rect x="-0.3" y="-0.3" width="0.6" height="0.6" rx=".1"
                      fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="0.025" strokeMiterlimit="50" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        )
    }
}