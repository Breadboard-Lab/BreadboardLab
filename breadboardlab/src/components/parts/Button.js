import React from "react";
import interact from "interactjs";

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.refConnector = React.createRef();
        
        this.state = {
            type: "Momentary Button",
            name: "Momentary Button",
        }
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);

        this.scale = {x: 50, y: 50};
        this.offSet = {x: 0.3, y: 0.35};
        this.attachTo = new Map();
    }

    componentDidMount() {
        interact(this.node.current.parentNode).styleCursor(false).draggable({
			listeners: {
                start: event => {
                    this.snap = false;
                },
				move: event => {
                    if (event.currentTarget === this.refConnector.current && typeof this.props.movePart === "function" && !this.snap) {
                        this.props.movePart(event);
                    } else {
                        const {interaction} = event;
                        interaction.stop();
                        interaction.start({name: "drag"}, event.interactable, this.refConnector.current)
                    }
                }
			},
		})
    }

    onDoubleClick() {
        console.log("test")
        this.props.onDoubleTap(this.getProps());
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        }
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

    snapConnector(event, id, attachRef, callback) {
        event.currentTarget.setAttribute("filter", "url(#f3)");

		const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
		const relatedTargetTranslate = regexTranslate.exec(event.relatedTarget.closest(".part").getAttribute("transform"));
		const breadboardTranslate = regexTranslate.exec(event.currentTarget.closest(".part").getAttribute("transform"));

        if (breadboardTranslate && relatedTargetTranslate) {
			const xPos = (Number(event.currentTarget.getAttribute("cx")) + attachRef.offSet.x) * attachRef.scale.x + Number(breadboardTranslate[1]) - 7.3;
			const yPos = (Number(event.currentTarget.getAttribute("cy")) + attachRef.offSet.y) * attachRef.scale.y + Number(breadboardTranslate[5]) - 2.2;

            this.node.current.closest(".part").setAttribute("transform", `translate(${xPos} ${yPos})`);
		}
        this.snap = true;
    }

    moveConnectortoCursor(element, clientX, clientY) {
        const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
		const translate = regexTranslate.exec(element.closest(".part").getAttribute("transform"));

		if (translate) {
			let svg = document.getElementById("AppSVG");
			let pt = svg.createSVGPoint();
			pt.x = clientX - element.closest(".part").getBoundingClientRect().width / 2;;
			pt.y = clientY - element.closest(".part").getBoundingClientRect().height / 2;;
		
			let cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
            element.closest(".part").setAttribute("transform", `translate(${cursorpt.x} ${cursorpt.y})`);
		}
    }

    disconnect() {
        this.snap = false;
    }
    
    render() {
        return(
            <g ref={this.node} onDoubleClick={this.onDoubleClick} transform="translate(30, 33) scale(90,90)">
                <rect x="-0.3" y="-0.3" width="0.6" height="0.6" rx=".1" fill="#202020" />
                <rect x="-0.27" y="-0.27" width="0.54" height="0.54" rx=".1" fill="#707070" />
                <rect ref={this.refConnector} className="connector" x="-0.2" y="-0.35" width="0.06" height="0.05" fill="#707070" />
                <rect x="0.14" y="-0.35" width="0.06" height="0.05" fill="#707070" />
                <rect x="-0.2" y="0.3" width="0.06" height="0.05" fill="#707070" />
                <rect x="0.14" y="0.3" width="0.06" height="0.05" fill="#707070" />
                <circle cx="0" cy="0" r="0.15" fill="#000000" />
                <circle cx="0" cy="0" r="0.1" fill="#202020" />
                <circle cx="-0.18" cy="-0.18" r="0.03" fill="#202020" />
                <circle cx="0.18" cy="-0.18" r="0.03" fill="#202020" />
                <circle cx="-0.18" cy="0.18" r="0.03" fill="#202020" />
                <circle cx="0.18" cy="0.18" r="0.03" fill="#202020" />
            </g>
        )
    }
}