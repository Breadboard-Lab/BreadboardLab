import React from "react";
import Interactable from "../Interactable";

export default class Wire extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.startPoint = React.createRef();
        this.endPoint = React.createRef();

        this.state = {
            startPoint: this.props.startPoint,
            endPoint: this.props.endPoint
        }
        this.setPoints = this.setPoints.bind(this);
        this.movePart = this.movePart.bind(this);

        this.attachTo = new Map();
    }

    draggableOptionsStartPoint = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                let endPoint = this.endPoint.current.node;

                this.setPoints({x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale},
                               {x: Number(endPoint.getAttribute("cx")), y: Number(endPoint.getAttribute("cy"))});
            }
        }
    }

    draggableOptionsEndPoint = {
        listeners: {
            move: (event) => {
                let scale = document.getElementById("AppSVG").getAttribute("scale");
                let startPoint = this.startPoint.current.node;

                this.setPoints({x: Number(startPoint.getAttribute("cx")), y: Number(startPoint.getAttribute("cy"))},
                               {x: Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale, y: Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale});
            }
        }
    }

    snapConnector(event, id, attachRef, callback) {
		event.currentTarget.setAttribute("filter", "url(#f3)");

		const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
		const relatedTargetTranslate = regexTranslate.exec(event.relatedTarget.closest(".part").getAttribute("transform"));
		const breadboardTranslate = regexTranslate.exec(event.currentTarget.closest(".part").getAttribute("transform"));

		if (breadboardTranslate && relatedTargetTranslate) {
			const xPos = (Number(event.currentTarget.getAttribute("cx")) + attachRef.offSet.x) * attachRef.scale.x - Number(relatedTargetTranslate[1]) + Number(breadboardTranslate[1]);
			const yPos = (Number(event.currentTarget.getAttribute("cy")) + attachRef.offSet.y) * attachRef.scale.y - Number(relatedTargetTranslate[5]) + Number(breadboardTranslate[5]);
			this.moveConnector(event.relatedTarget, xPos, yPos);

            if (this.startPoint.current.node === event.relatedTarget) {
                this.attachTo.set("start", {id: id, ref: attachRef});

                if (callback)
                    callback(event, id, "start", this);
            } else if (this.endPoint.current.node === event.relatedTarget) {
                this.attachTo.set("end", {id: id, ref: attachRef});

                if (callback)
                    callback(event, id, "end", this);
            }
		}
	}

    moveConnectortoCursor(element, clientX, clientY) {
		const regexTranslate = /translate\((([\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([\d]+)?(\.[\d]+)?)(px)?\)/i;
		const translate = regexTranslate.exec(element.parentNode.getAttribute("transform"));

		if (translate) {
			let svg = document.getElementById("AppSVG");
			let pt = svg.createSVGPoint();
			pt.x = clientX;
			pt.y = clientY;
		
			let cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
			const xPos = cursorpt.x - Number(translate[1]);
			const yPos = cursorpt.y - Number(translate[5]);
	
			this.moveConnector(element, xPos, yPos);
		}
	}

	moveConnector(connector, xPos, yPos) {
		if (connector === this.startPoint.current.node) {
            this.setState({startPoint: {x: xPos, y: yPos}});
        } else {
            this.setState({endPoint: {x: xPos, y: yPos}});
        }
	}

    disconnect(event, id, attachRef, callback) {
        let item = this.attachTo.get("start");

        if (item) {
            if (this.startPoint.current.node === event.relatedTarget && item.ref === attachRef) {
                this.attachTo.set("start", undefined);
    
                if (callback)
                    callback(event, id, "start", this);
            } else if (this.endPoint.current.node === event.relatedTarget && item.ref === attachRef) {
                this.attachTo.set("end", undefined);
    
                if (callback)
                    callback(event, id, "end", this);
            }
        }
    }

    setPoints(startPoint, endPoint) {
        this.setState({
            startPoint: startPoint,
            endPoint: endPoint
        })
    }

    movePart(dx, dy) {
        if (this.attachTo.get("start") && this.attachTo.get("end") && this.attachTo.get("start").ref === this.attachTo.get("end").ref) {
            this.setPoints({x: this.state.startPoint.x + dx / 2, y: this.state.startPoint.y + dy / 2}, {x: this.state.endPoint.x + dx / 2, y: this.state.endPoint.y + dy / 2});
        } else {
            this.setPoints({x: this.state.startPoint.x + dx, y: this.state.startPoint.y + dy}, {x: this.state.endPoint.x + dx, y: this.state.endPoint.y + dy});
        }
    }

    onMouseEnter(event) {
        event.target.setAttribute("stroke-opacity", "0.5");
        event.target.setAttribute("fill-opacity", "0.5");
        event.target.setAttribute("style", "cursor: move");
    }

    onMouseLeave(event) {
        event.target.setAttribute("stroke-opacity", "0");
        event.target.setAttribute("fill-opacity", "0");
        event.target.setAttribute("fill-opacity", "0");
        event.target.setAttribute("style", "");
    }

    render() {                        
        return(
            <g ref={this.node} className="part" transform={this.props.transform}>
                <path stroke="darkred" strokeWidth="6" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                <path stroke="red" strokeWidth="3" strokeLinecap="round" d={`M ${this.state.startPoint.x} ${this.state.startPoint.y} L ${this.state.endPoint.x} ${this.state.endPoint.y}`}/>
                
                <Interactable ref={this.startPoint} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsStartPoint}>
                    <ellipse onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
                            className="wire start connector" stroke="grey" strokeWidth="1.5" strokeOpacity="0" fill="black" fillOpacity="0" cx={this.state.startPoint.x} cy={this.state.startPoint.y} rx="3.5" ry="3.5"/>
                </Interactable>
                
                <Interactable ref={this.endPoint} styleCursor={false} draggable={true} draggableOptions={this.draggableOptionsEndPoint}>
                    <ellipse onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} 
                                className="wire end connector" stroke="grey" strokeWidth="1.5" strokeOpacity="0" fill="black" fillOpacity="0" cx={this.state.endPoint.x} cy={this.state.endPoint.y} rx="3.5" ry="3.5"/>
                </Interactable>
            </g>
        );
    }
}