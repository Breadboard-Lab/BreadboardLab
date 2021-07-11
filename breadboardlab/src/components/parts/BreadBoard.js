import React from "react";
import interact from "interactjs";
import Wire from "./Wire";
import SideBarPart from "../SideBarPart"

export default class BreadBoard extends React.Component {
    constructor(props) {
		super(props);
		this.node = React.createRef();
		
		this.state = {
			type: "Breadboard",
			name: "Breadboard",
			isSelected: false,
		}
		this.onDoubleClick = this.onDoubleClick.bind(this);
        this.connectPart = this.connectPart.bind(this);
        this.disconnectPart = this.disconnectPart.bind(this);
		this.updateProp = this.updateProp.bind(this);

		this.scale = {x: 6, y: 6};
		this.offSet = {x: 0.45604399, y: 0};
		this.mousedown = false;
		this.connectedParts = new Map();
    }

	onDoubleClick() {
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

    componentDidMount() {
		this.connectors = this.node.current.querySelectorAll("ellipse");

		interact(this.node.current.parentNode).styleCursor(false).draggable({
			listeners: {
				move: event => {
					if (typeof this.props.movePart === "function") {
						let {dx, dy} = this.props.movePart(event);
	
						this.connectedParts.forEach((item, key) => {
							if (item && typeof item.ref.movePart === "function") {
								item.ref.movePart(item.id, dx, dy);
							}
						});
					}
				}
			},
		})
		
		for (let i = 0; i < this.connectors.length; i++) {
			this.connectors[i].addEventListener("mousedown", (e) => {
				this.mousedown = true;
			});

			this.connectors[i].addEventListener("mouseover", (e) => {
				if (e.srcElement.getAttribute("filter") !== "url(#f3)") {
					e.srcElement.setAttribute("filter", "url(#f1)");
					e.srcElement.setAttribute("style", "cursor: pointer");
				}
			});

			this.connectors[i].addEventListener("mouseleave", (e) => {
				if (e.srcElement.getAttribute("filter") !== "url(#f3)")
					e.srcElement.setAttribute("filter", "");

				e.srcElement.setAttribute("style", "");
				this.mousedown = false;
			});

			interact(this.connectors[i]).styleCursor(false).draggable({
				manualStart: true,
				listeners: {
					move: event => {
						let ref = SideBarPart.listOfRefs.find(ref => ref.node.current.closest(".part") === event.currentTarget.closest(".part"));
						let scale = document.getElementById("AppSVG").getAttribute("scale");

						if (typeof ref.moveConnector === "function")
							ref.moveConnector(event.currentTarget, Number(event.currentTarget.getAttribute("cx")) + event.delta.x * scale, Number(event.currentTarget.getAttribute("cy")) + event.delta.y * scale);
					},
					end: () => {
						this.mousedown = false;
					}
				}
			})
			.on("move", (event) => {
				const {interaction} = event;
        
       			if (interaction.pointerIsDown && !interaction.interacting() && this.mousedown) {
					const regexTranslate = /translate\((([-?\d]+)?(\.[\d]+)?)(px)?,?[\s]?(([-?\d]+)?(\.[\d]+)?)(px)?\)/i;
					const translate = regexTranslate.exec(this.node.current.parentNode.getAttribute("transform"));
					let startPoint = {x: (Number(event.currentTarget.getAttribute("cx")) + this.offSet.x) * this.scale.x, y: (Number(event.currentTarget.getAttribute("cy")) + this.offSet.y) * this.scale.y};
					
					if (translate && this.connectedParts.get(event.currentTarget.id) === undefined) {
						let wire = React.createElement(
							Wire,
							{
								ref: node => this.wire = node,
								startPoint: startPoint,
								endPoint: startPoint,
								transform: `translate(${Number(translate[1])}, ${Number(translate[5])})`
							}
						);							  
						this.props.addPart(wire);
						interaction.start({name: "drag"}, event.interactable, this.wire.endPoint.current.node);
						SideBarPart.listOfRefs.push(this.wire);

						this.connectPart(event.currentTarget.id, "start", this.wire);

						this.wire.attachTo.set("start", {id: event.currentTarget.id, ref: this});
					}
				}
			})
			.dropzone({
				accept: ".connector",
				overlap: 0.01,
				ondropmove: event => {
					let ref = SideBarPart.listOfRefs.find(ref => ref.node.current.closest(".part") === event.relatedTarget.closest(".part"));

					if (ref && typeof ref.highlight === "function")
						ref.highlight(event, this);
				},
				ondrop: event => {
					let ref = SideBarPart.listOfRefs.find(ref => ref.node.current.closest(".part") === event.relatedTarget.closest(".part"));

					if (ref && typeof ref.connect === "function")
						ref.connect(event, event.currentTarget.id, this, this.connectPart);
				},
				ondragleave: event => {
					let ref = SideBarPart.listOfRefs.find(ref => ref.node.current.closest(".part") === event.relatedTarget.closest(".part"));

					if (typeof ref.disconnect === "function") 
						ref.disconnect(event, event.currentTarget.id, this.disconnectPart);
					
				}
			});
		} 
    }

	connectPart(id, partID, ref) {
		this.connectedParts.set(id, {id: partID, ref: ref});

		if (this.node.current.querySelector("#" + id))
			this.node.current.querySelector("#" + id).setAttribute("filter", "url(#f3)");
	}

	disconnectPart(id, ref) {
		if (this.connectedParts.get(id) && this.connectedParts.get(id).ref === ref) {
			this.connectedParts.set(id, undefined);
			this.node.current.querySelector("#" + id).setAttribute("filter", "");
		}
	}

    render() {
		return (
			<g ref={this.node} onDoubleClick={this.onDoubleClick} transform={`translate(6, 30) scale(0.3, 0.3)`}>
				<g id="layer1">
					<rect
						strokeWidth="0"
						fill="#f8f5e6"
						id="rect18"
						width="178.2547"
						height="55.881859"
						x="-0.45604399"
						y="9.6281099e-08" />
					<rect
						strokeWidth="0"
						fill="#e6deb9"
						id="rect1092"
						width="177.8"
						height="1.818355"
						x="0"
						y="26.860588" />
				</g>
				<g id="layer2">
					<path
						fill="#aa0000"
						stroke="#aa0000"
						strokeWidth="0.529167"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						d="m 85.895089,2.1711241 c -75.050744,0 -75.050744,0 -75.050744,0"
						id="path872" />
					<path
						fill="#aa0000"
						stroke="#aa0000"
						strokeWidth="0.529167"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						d="m 85.895089,45.795838 c -75.050744,0 -75.050744,0 -75.050744,0"
						id="path872-6" />
					<path
						fill="#0055d4"
						stroke="#0055d4"
						strokeWidth="0.529167"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						d="m 85.895089,53.480372 c -75.050741,0 -75.050741,0 -75.050741,0"
						id="path872-6-6" />
					<path
						fill="#0055d4"
						stroke="#0055d4"
						strokeWidth="0.529167"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						d="m 85.895089,9.410897 c -75.050741,0 -75.050741,0 -75.050741,0"
						id="path872-6-6-3" />
					<path
						fill="#aa0000"
						stroke="#aa0000"
						strokeWidth="0.529167"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						d="m 166.99345,45.79589 c -75.050742,0 -75.050742,0 -75.050742,0"
						id="path872-6-7" />
					<path
						fill="#0055d4"
						stroke="#0055d4"
						strokeWidth="0.529167"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						d="m 166.99345,53.480324 c -75.050739,0 -75.050739,0 -75.050739,0"
						id="path872-6-6-8" />
					<path
						fill="#aa0000"
						stroke="#aa0000"
						strokeWidth="0.529167"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						d="m 166.99344,2.1711861 c -75.050735,0 -75.050735,0 -75.050735,0"
						id="path872-68" />
					<path
						fill="#0055d4"
						stroke="#0055d4"
						strokeWidth="0.529167"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="4"
						d="m 166.99344,9.4108592 c -75.050732,0 -75.050732,0 -75.050732,0"
						id="path872-6-6-3-8" />
				</g>
				<g id="layer4">
					<text
						fontSize="2.82222"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						stroke="#aa0000"
						strokeWidth="0.264583"
						x="6.3622808"
						y="2.5511949"
						id="left-top-plus"><tspan
						id="tspan3844"
						x="6.3622808"
						y="2.9511949"
						fontSize="2.82222"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						stroke="#aa0000"
						strokeWidth="0.264583">+</tspan></text>
					<text fontSize="2.82222"
					line-height="1.25"
					fontFamily="Calibri"
					fill="#000000"
					stroke="#aa0000"
					strokeWidth="0.264583"
				
					x="169.54196"
					y="2.4409714"
					id="right-top-plus"><tspan
						id="tspan3844-5"
						x="169.54196"
						y="2.9511949"
						fontSize="2.82222"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						stroke="#aa0000"
						strokeWidth="0.264583">+</tspan></text>
					<text line-height="1.25"
					fontSize="2.82222"
					fontFamily="Calibri"
					fill="#000000"
					fillOpacity="1"
					stroke="#0055d4"
					strokeWidth="0.264583"
					x="169.94745"
					y="10.26536"
					id="right-top-minus"><tspan
						id="tspan3884"
						x="169.94745"
						y="10.26536"
						fontSize="2.82222"
						fontFamily="Calibri"
						fill="#000000"
						fillOpacity="1"
						stroke="#0055d4"
						strokeWidth="0.264583">I</tspan></text>
					<text line-height="1.25"
					fontSize="2.82222"
					fontFamily="Calibri"
					fill="#000000"
					fillOpacity="1"
					stroke="#0055d4"
					strokeWidth="0.264583"
					x="6.8548598"
					y="10.382178"
					id="left-top-minus"><tspan
						id="tspan3884-6"
						x="6.8548598"
						y="10.382178"
						fontSize="2.82222"
						fontFamily="Calibri"
						fill="#000000"
						fillOpacity="1"
						stroke="#0055d4"
						strokeWidth="0.264583">I</tspan></text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						stroke="#aa0000"
						strokeWidth="0.264583"
						strokeOpacity="1"
						x="6.4078465"
						y="47.127789"
						id="left-bottom-plus"><tspan
						id="tspan3844-1"
						x="6.4078465"
						y="46.527789"
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						stroke="#aa0000"
						strokeWidth="0.264583"
						strokeOpacity="1">+</tspan></text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						stroke="#aa0000"
						strokeWidth="0.264583"
						x="169.58871"
						y="47.392769"
						id="right-bottom-plus"><tspan
						id="tspan3844-5-8"
						x="169.58871"
						y="46.527789"
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						stroke="#aa0000"
						strokeWidth="0.264583"
						strokeOpacity="1">+</tspan></text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						stroke="#0055d4"
						strokeWidth="0.264583"
						x="169.99422"
						y="55.217159"
						id="right-bottom-minus"><tspan
						id="tspan3884-62"
						x="169.99422"
						y="54.317159"
						fontSize="2.82222"
						fontFamily="Calibri"
						stroke="#0055d4"
						strokeWidth="0.264583"
						strokeOpacity="1">I</tspan></text>
					<text line-height="1.25"
					fontSize="2.82222"
					fontFamily="Calibri"
					fill="#000000"
					fillOpacity="1"
					stroke="#0055d4"
					strokeWidth="0.264583"
					x="6.9004292"
					y="55.333977"
					id="left-bottom-minus"><tspan
						id="tspan3884-6-6"
						x="6.9004292"
						y="54.317159"
						fontSize="2.82222"
						fontFamily="Calibri"
						fill="#000000"
						fillOpacity="1"
						stroke="#0055d4"
						strokeWidth="0.264583"
						strokeOpacity="1">I</tspan></text>
				</g>
				<g id="powerTop">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-3"
						cx="12.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-4"
						cx="14.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-5"
						cx="17.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-6"
						cx="20.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-7"
						cx="22.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-9"
						cx="27.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-10"
						cx="30.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-11"
						cx="33.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-12"
						cx="35.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-13"
						cx="38.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-15"
						cx="43.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-16"
						cx="46.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-17"
						cx="48.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-18"
						cx="51.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-19"
						cx="53.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-21"
						cx="59.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-22"
						cx="61.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-23"
						cx="64.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-24"
						cx="66.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-25"
						cx="69.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-27"
						cx="74.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-28"
						cx="77.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-29"
						cx="79.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-30"
						cx="82.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-31"
						cx="85.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-34"
						cx="92.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-35"
						cx="95.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-36"
						cx="98.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-37"
						cx="100.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-38"
						cx="103.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-40"
						cx="108.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-41"
						cx="111.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-42"
						cx="113.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-43"
						cx="116.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-44"
						cx="118.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-46"
						cx="124.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-47"
						cx="126.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-48"
						cx="129.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-49"
						cx="131.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-50"
						cx="134.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-52"
						cx="139.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-53"
						cx="142.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-54"
						cx="144.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-55"
						cx="147.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-56"
						cx="150.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-58"
						cx="155.3"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-59"
						cx="157.9"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-60"
						cx="160.5"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-61"
						cx="163.1"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Top-62"
						cx="165.7"
						cy="4.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="groundTop">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-3"
						cx="12.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-4"
						cx="14.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-5"
						cx="17.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-6"
						cx="20.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-7"
						cx="22.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-9"
						cx="27.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-10"
						cx="30.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-11"
						cx="33.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-12"
						cx="35.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-13"
						cx="38.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-15"
						cx="43.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-16"
						cx="46.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-17"
						cx="48.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-18"
						cx="51.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-19"
						cx="53.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-21"
						cx="59.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-22"
						cx="61.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-23"
						cx="64.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-24"
						cx="66.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-25"
						cx="69.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-27"
						cx="74.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-28"
						cx="77.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-29"
						cx="79.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-30"
						cx="82.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-31"
						cx="85.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-34"
						cx="92.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-35"
						cx="95.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-36"
						cx="98.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-37"
						cx="100.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-38"
						cx="103.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-40"
						cx="108.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-41"
						cx="111.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-42"
						cx="113.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-43"
						cx="116.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-44"
						cx="118.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-46"
						cx="124.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-47"
						cx="126.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-48"
						cx="129.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-49"
						cx="131.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-50"
						cx="134.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-52"
						cx="139.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-53"
						cx="142.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-54"
						cx="144.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-55"
						cx="147.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-56"
						cx="150.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-58"
						cx="155.3"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-59"
						cx="157.9"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-60"
						cx="160.5"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-61"
						cx="163.1"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Top-62"
						cx="165.7"
						cy="7.0"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column01top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A1"
						cx="7.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B1"
						cx="7.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C1"
						cx="7.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D1"
						cx="7.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E1"
						cx="7.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column02top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A2"
						cx="9.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B2"
						cx="9.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C2"
						cx="9.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D2"
						cx="9.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E2"
						cx="9.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column03top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A3"
						cx="12.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B3"
						cx="12.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C3"
						cx="12.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D3"
						cx="12.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E3"
						cx="12.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column04top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A4"
						cx="14.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B4"
						cx="14.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C4"
						cx="14.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D4"
						cx="14.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E4"
						cx="14.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column05top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A5"
						cx="17.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B5"
						cx="17.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C5"
						cx="17.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D5"
						cx="17.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E5"
						cx="17.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column06top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A6"
						cx="20.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B6"
						cx="20.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C6"
						cx="20.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D6"
						cx="20.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E6"
						cx="20.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column07top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A7"
						cx="22.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B7"
						cx="22.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C7"
						cx="22.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D7"
						cx="22.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E7"
						cx="22.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column08top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A8"
						cx="25.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B8"
						cx="25.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C8"
						cx="25.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D8"
						cx="25.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E8"
						cx="25.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column09top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A9"
						cx="27.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B9"
						cx="27.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C9"
						cx="27.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D9"
						cx="27.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E9"
						cx="27.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column10top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A10"
						cx="30.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B10"
						cx="30.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C10"
						cx="30.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D10"
						cx="30.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E10"
						cx="30.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column11top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A11"
						cx="33.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B11"
						cx="33.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C11"
						cx="33.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D11"
						cx="33.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E11"
						cx="33.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column12top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A12"
						cx="35.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B12"
						cx="35.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C12"
						cx="35.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D12"
						cx="35.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E12"
						cx="35.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column13top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A13"
						cx="38.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B13"
						cx="38.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C13"
						cx="38.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D13"
						cx="38.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E13"
						cx="38.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column14top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A14"
						cx="40.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B14"
						cx="40.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C14"
						cx="40.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D14"
						cx="40.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E14"
						cx="40.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column15top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A15"
						cx="43.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B15"
						cx="43.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C15"
						cx="43.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D15"
						cx="43.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E15"
						cx="43.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column16top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A16"
						cx="46.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B16"
						cx="46.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C16"
						cx="46.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D16"
						cx="46.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E16"
						cx="46.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column17top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A17"
						cx="48.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B17"
						cx="48.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C17"
						cx="48.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D17"
						cx="48.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E17"
						cx="48.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column18top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A18"
						cx="51.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B18"
						cx="51.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C18"
						cx="51.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D18"
						cx="51.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E18"
						cx="51.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column19top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A19"
						cx="53.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B19"
						cx="53.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C19"
						cx="53.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D19"
						cx="53.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E19"
						cx="53.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column20top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A20"
						cx="56.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B20"
						cx="56.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C20"
						cx="56.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D20"
						cx="56.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E20"
						cx="56.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column21top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A21"
						cx="59.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B21"
						cx="59.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C21"
						cx="59.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D21"
						cx="59.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E21"
						cx="59.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column22top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A22"
						cx="61.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B22"
						cx="61.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C22"
						cx="61.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D22"
						cx="61.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E22"
						cx="61.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column23top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A23"
						cx="64.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B23"
						cx="64.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C23"
						cx="64.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D23"
						cx="64.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E23"
						cx="64.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column24top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A24"
						cx="66.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B24"
						cx="66.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C24"
						cx="66.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D24"
						cx="66.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E24"
						cx="66.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column25top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A25"
						cx="69.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B25"
						cx="69.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C25"
						cx="69.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D25"
						cx="69.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E25"
						cx="69.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column26top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A26"
						cx="72.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B26"
						cx="72.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C26"
						cx="72.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D26"
						cx="72.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E26"
						cx="72.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column27top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A27"
						cx="74.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B27"
						cx="74.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C27"
						cx="74.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D27"
						cx="74.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E27"
						cx="74.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column28top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A28"
						cx="77.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B28"
						cx="77.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C28"
						cx="77.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D28"
						cx="77.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E28"
						cx="77.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column29top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A29"
						cx="79.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B29"
						cx="79.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C29"
						cx="79.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D29"
						cx="79.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E29"
						cx="79.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column30top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A30"
						cx="82.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B30"
						cx="82.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C30"
						cx="82.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D30"
						cx="82.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E30"
						cx="82.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column31top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A31"
						cx="85.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B31"
						cx="85.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C31"
						cx="85.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D31"
						cx="85.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E31"
						cx="85.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column32top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A32"
						cx="87.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B32"
						cx="87.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C32"
						cx="87.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D32"
						cx="87.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E32"
						cx="87.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column33top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A33"
						cx="90.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B33"
						cx="90.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C33"
						cx="90.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D33"
						cx="90.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E33"
						cx="90.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column34top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A34"
						cx="92.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B34"
						cx="92.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C34"
						cx="92.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D34"
						cx="92.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E34"
						cx="92.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column35top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A35"
						cx="95.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B35"
						cx="95.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C35"
						cx="95.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D35"
						cx="95.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E35"
						cx="95.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column36top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A36"
						cx="98.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B36"
						cx="98.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C36"
						cx="98.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D36"
						cx="98.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E36"
						cx="98.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column37top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A37"
						cx="100.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B37"
						cx="100.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C37"
						cx="100.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D37"
						cx="100.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E37"
						cx="100.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column38top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A38"
						cx="103.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B38"
						cx="103.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C38"
						cx="103.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D38"
						cx="103.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E38"
						cx="103.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column39top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A39"
						cx="105.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B39"
						cx="105.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C39"
						cx="105.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D39"
						cx="105.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E39"
						cx="105.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column40top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A40"
						cx="108.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B40"
						cx="108.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C40"
						cx="108.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D40"
						cx="108.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E40"
						cx="108.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column41top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A41"
						cx="111.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B41"
						cx="111.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C41"
						cx="111.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D41"
						cx="111.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E41"
						cx="111.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column42top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A42"
						cx="113.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B42"
						cx="113.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C42"
						cx="113.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D42"
						cx="113.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E42"
						cx="113.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column43top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A43"
						cx="116.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B43"
						cx="116.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C43"
						cx="116.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D43"
						cx="116.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E43"
						cx="116.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column44top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A44"
						cx="118.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B44"
						cx="118.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C44"
						cx="118.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D44"
						cx="118.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E44"
						cx="118.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column45top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A45"
						cx="121.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B45"
						cx="121.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C45"
						cx="121.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D45"
						cx="121.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E45"
						cx="121.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column46top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A46"
						cx="124.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B46"
						cx="124.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C46"
						cx="124.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D46"
						cx="124.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E46"
						cx="124.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column47top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A47"
						cx="126.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B47"
						cx="126.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C47"
						cx="126.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D47"
						cx="126.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E47"
						cx="126.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column48top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A48"
						cx="129.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B48"
						cx="129.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C48"
						cx="129.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D48"
						cx="129.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E48"
						cx="129.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column49top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A49"
						cx="131.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B49"
						cx="131.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C49"
						cx="131.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D49"
						cx="131.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E49"
						cx="131.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column51top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A50"
						cx="134.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B50"
						cx="134.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C50"
						cx="134.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D50"
						cx="134.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E50"
						cx="134.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column51top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A51"
						cx="137.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B51"
						cx="137.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C51"
						cx="137.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D51"
						cx="137.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E51"
						cx="137.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column52top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A52"
						cx="139.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B52"
						cx="139.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C52"
						cx="139.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D52"
						cx="139.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E52"
						cx="139.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column53top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A53"
						cx="142.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B53"
						cx="142.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C53"
						cx="142.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D53"
						cx="142.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E53"
						cx="142.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column54top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A54"
						cx="144.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B54"
						cx="144.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C54"
						cx="144.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D54"
						cx="144.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E54"
						cx="144.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column55top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A55"
						cx="147.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B55"
						cx="147.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C55"
						cx="147.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D55"
						cx="147.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E55"
						cx="147.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column56top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A56"
						cx="150.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B56"
						cx="150.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C56"
						cx="150.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D56"
						cx="150.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E56"
						cx="150.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column57top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A57"
						cx="152.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B57"
						cx="152.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C57"
						cx="152.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D57"
						cx="152.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E57"
						cx="152.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column58top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A58"
						cx="155.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B58"
						cx="155.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C58"
						cx="155.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D58"
						cx="155.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E58"
						cx="155.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column59top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A59"
						cx="157.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B59"
						cx="157.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C59"
						cx="157.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D59"
						cx="157.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E59"
						cx="157.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column60top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A60"
						cx="160.5"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B60"
						cx="160.5"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C60"
						cx="160.5"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D60"
						cx="160.5"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E60"
						cx="160.5"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column61top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A61"
						cx="163.1"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B61"
						cx="163.1"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C61"
						cx="163.1"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D61"
						cx="163.1"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E61"
						cx="163.1"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column62top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A62"
						cx="165.7"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B62"
						cx="165.7"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C62"
						cx="165.7"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D62"
						cx="165.7"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E62"
						cx="165.7"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column63top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A63"
						cx="168.3"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B63"
						cx="168.3"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C63"
						cx="168.3"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D63"
						cx="168.3"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E63"
						cx="168.3"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column64top">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="A64"
						cx="170.9"
						cy="14.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="B64"
						cx="170.9"
						cy="17.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="C64"
						cx="170.9"
						cy="20.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="D64"
						cx="170.9"
						cy="22.6"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="E64"
						cx="170.9"
						cy="25.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column01bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F1"
						cx="7.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G1"
						cx="7.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H1"
						cx="7.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I1"
						cx="7.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J1"
						cx="7.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column02bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F2"
						cx="9.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G2"
						cx="9.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H2"
						cx="9.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I2"
						cx="9.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J2"
						cx="9.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column03bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F3"
						cx="12.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G3"
						cx="12.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H3"
						cx="12.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I3"
						cx="12.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J3"
						cx="12.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column04bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F4"
						cx="14.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G4"
						cx="14.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H4"
						cx="14.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I4"
						cx="14.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J4"
						cx="14.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column05bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F5"
						cx="17.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G5"
						cx="17.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H5"
						cx="17.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I5"
						cx="17.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J5"
						cx="17.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column06bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F6"
						cx="20.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G6"
						cx="20.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H6"
						cx="20.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I6"
						cx="20.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J6"
						cx="20.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column07bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F7"
						cx="22.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G7"
						cx="22.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H7"
						cx="22.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I7"
						cx="22.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J7"
						cx="22.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column08bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F8"
						cx="25.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G8"
						cx="25.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H8"
						cx="25.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I8"
						cx="25.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J8"
						cx="25.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column09bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F9"
						cx="27.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G9"
						cx="27.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H9"
						cx="27.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I9"
						cx="27.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J9"
						cx="27.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column10bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F10"
						cx="30.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G10"
						cx="30.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H10"
						cx="30.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I10"
						cx="30.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J10"
						cx="30.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column11bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F11"
						cx="33.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G11"
						cx="33.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H11"
						cx="33.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I11"
						cx="33.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J11"
						cx="33.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column12bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F12"
						cx="35.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G12"
						cx="35.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H12"
						cx="35.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I12"
						cx="35.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J12"
						cx="35.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column13bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F13"
						cx="38.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G13"
						cx="38.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H13"
						cx="38.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I13"
						cx="38.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J13"
						cx="38.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column13bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F14"
						cx="40.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G14"
						cx="40.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H14"
						cx="40.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I14"
						cx="40.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J14"
						cx="40.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column15bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F15"
						cx="43.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G15"
						cx="43.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H15"
						cx="43.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I15"
						cx="43.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J15"
						cx="43.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column16bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F16"
						cx="46.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G16"
						cx="46.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H16"
						cx="46.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I16"
						cx="46.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J16"
						cx="46.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column17bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F17"
						cx="48.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G17"
						cx="48.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H17"
						cx="48.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I17"
						cx="48.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J17"
						cx="48.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column18bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F18"
						cx="51.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G18"
						cx="51.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H18"
						cx="51.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I18"
						cx="51.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J18"
						cx="51.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column19bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F19"
						cx="53.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G19"
						cx="53.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H19"
						cx="53.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I19"
						cx="53.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J19"
						cx="53.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column20bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F20"
						cx="56.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G20"
						cx="56.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H20"
						cx="56.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I20"
						cx="56.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J20"
						cx="56.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column21bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F21"
						cx="59.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G21"
						cx="59.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H21"
						cx="59.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I21"
						cx="59.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J21"
						cx="59.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column22bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F22"
						cx="61.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G22"
						cx="61.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H22"
						cx="61.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I22"
						cx="61.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J22"
						cx="61.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column23bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F23"
						cx="64.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G23"
						cx="64.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H23"
						cx="64.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I23"
						cx="64.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J23"
						cx="64.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column24bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F24"
						cx="66.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G24"
						cx="66.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H24"
						cx="66.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I24"
						cx="66.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J24"
						cx="66.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column25bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F25"
						cx="69.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G25"
						cx="69.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H25"
						cx="69.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I25"
						cx="69.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J25"
						cx="69.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column26bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F26"
						cx="72.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G26"
						cx="72.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H26"
						cx="72.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I26"
						cx="72.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J26"
						cx="72.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column27bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F27"
						cx="74.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G27"
						cx="74.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H27"
						cx="74.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I27"
						cx="74.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J27"
						cx="74.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column28bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F28"
						cx="77.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G28"
						cx="77.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H28"
						cx="77.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I28"
						cx="77.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J28"
						cx="77.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column29bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F29"
						cx="79.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G29"
						cx="79.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H29"
						cx="79.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I29"
						cx="79.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J29"
						cx="79.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column30bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F30"
						cx="82.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G30"
						cx="82.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H30"
						cx="82.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I30"
						cx="82.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J30"
						cx="82.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column31bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F31"
						cx="85.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G31"
						cx="85.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H31"
						cx="85.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I31"
						cx="85.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J31"
						cx="85.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column32bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F32"
						cx="87.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G32"
						cx="87.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H32"
						cx="87.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I32"
						cx="87.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J32"
						cx="87.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column33bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F33"
						cx="90.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G33"
						cx="90.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H33"
						cx="90.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I33"
						cx="90.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J33"
						cx="90.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column34bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F34"
						cx="92.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G34"
						cx="92.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H34"
						cx="92.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I34"
						cx="92.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J34"
						cx="92.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column35bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F35"
						cx="95.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G35"
						cx="95.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H35"
						cx="95.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I35"
						cx="95.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J35"
						cx="95.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column36bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F36"
						cx="98.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G36"
						cx="98.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H36"
						cx="98.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I36"
						cx="98.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J36"
						cx="98.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column37bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F37"
						cx="100.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G37"
						cx="100.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H37"
						cx="100.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I37"
						cx="100.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J37"
						cx="100.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column38bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F38"
						cx="103.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G38"
						cx="103.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H38"
						cx="103.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I38"
						cx="103.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J38"
						cx="103.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column39bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F39"
						cx="105.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G39"
						cx="105.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H39"
						cx="105.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I39"
						cx="105.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J39"
						cx="105.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column40bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F40"
						cx="108.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G40"
						cx="108.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H40"
						cx="108.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I40"
						cx="108.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J40"
						cx="108.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column41bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F41"
						cx="111.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G41"
						cx="111.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H41"
						cx="111.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I41"
						cx="111.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J41"
						cx="111.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column42bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F42"
						cx="113.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G42"
						cx="113.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H42"
						cx="113.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I42"
						cx="113.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J42"
						cx="113.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column43bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F43"
						cx="116.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G43"
						cx="116.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H43"
						cx="116.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I43"
						cx="116.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J43"
						cx="116.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column44bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F44"
						cx="118.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G44"
						cx="118.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H44"
						cx="118.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I44"
						cx="118.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J44"
						cx="118.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column45bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F45"
						cx="121.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G45"
						cx="121.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H45"
						cx="121.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I45"
						cx="121.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J45"
						cx="121.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column46bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F46"
						cx="124.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G46"
						cx="124.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H46"
						cx="124.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I46"
						cx="124.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J46"
						cx="124.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column47bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F47"
						cx="126.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G47"
						cx="126.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H47"
						cx="126.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I47"
						cx="126.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J47"
						cx="126.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column48bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F48"
						cx="129.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G48"
						cx="129.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H48"
						cx="129.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I48"
						cx="129.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J48"
						cx="129.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column49bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F49"
						cx="131.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G49"
						cx="131.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H49"
						cx="131.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I49"
						cx="131.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J49"
						cx="131.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column50bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F50"
						cx="134.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G50"
						cx="134.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H50"
						cx="134.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I50"
						cx="134.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J50"
						cx="134.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column51bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F51"
						cx="137.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G51"
						cx="137.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H51"
						cx="137.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I51"
						cx="137.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J51"
						cx="137.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column52bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F52"
						cx="139.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G52"
						cx="139.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H52"
						cx="139.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I52"
						cx="139.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J52"
						cx="139.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column53bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F53"
						cx="142.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G53"
						cx="142.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H53"
						cx="142.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I53"
						cx="142.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J53"
						cx="142.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column54bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F54"
						cx="144.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G54"
						cx="144.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H54"
						cx="144.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I54"
						cx="144.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J54"
						cx="144.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column55bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F55"
						cx="147.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G55"
						cx="147.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H55"
						cx="147.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I55"
						cx="147.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J55"
						cx="147.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column56bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F56"
						cx="150.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G56"
						cx="150.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H56"
						cx="150.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I56"
						cx="150.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J56"
						cx="150.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column57bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F57"
						cx="152.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G57"
						cx="152.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H57"
						cx="152.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I57"
						cx="152.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J57"
						cx="152.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column58bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F58"
						cx="155.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G58"
						cx="155.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H58"
						cx="155.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I58"
						cx="155.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J58"
						cx="155.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column59bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F59"
						cx="157.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G59"
						cx="157.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H59"
						cx="157.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I59"
						cx="157.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J59"
						cx="157.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column60bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F60"
						cx="160.5"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G60"
						cx="160.5"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H60"
						cx="160.5"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I60"
						cx="160.5"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J60"
						cx="160.5"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column61bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F61"
						cx="163.1"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G61"
						cx="163.1"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H61"
						cx="163.1"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I61"
						cx="163.1"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J61"
						cx="163.1"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column62bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F62"
						cx="165.7"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G62"
						cx="165.7"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H62"
						cx="165.7"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I62"
						cx="165.7"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J62"
						cx="165.7"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column63bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F63"
						cx="168.3"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G63"
						cx="168.3"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H63"
						cx="168.3"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I63"
						cx="168.3"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J63"
						cx="168.3"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="column64bottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="F64"
						cx="170.9"
						cy="30.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="G64"
						cx="170.9"
						cy="33.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="H64"
						cx="170.9"
						cy="35.4"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="I64"
						cx="170.9"
						cy="38.0"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="J64"
						cx="170.9"
						cy="40.4"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="powerBottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-3"
						cx="12.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-4"
						cx="14.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-5"
						cx="17.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-6"
						cx="20.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-7"
						cx="22.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-9"
						cx="27.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-10"
						cx="30.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-11"
						cx="33.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-12"
						cx="35.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-13"
						cx="38.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-15"
						cx="43.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-16"
						cx="46.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-17"
						cx="48.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-18"
						cx="51.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-19"
						cx="53.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-21"
						cx="59.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-22"
						cx="61.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-23"
						cx="64.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-24"
						cx="66.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-25"
						cx="69.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-27"
						cx="74.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-28"
						cx="77.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-29"
						cx="79.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-30"
						cx="82.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-31"
						cx="85.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-34"
						cx="92.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-35"
						cx="95.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-36"
						cx="98.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-37"
						cx="100.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-38"
						cx="103.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-40"
						cx="108.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-41"
						cx="111.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-42"
						cx="113.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-43"
						cx="116.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-44"
						cx="118.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-46"
						cx="124.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-47"
						cx="126.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-48"
						cx="129.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-49"
						cx="131.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-50"
						cx="134.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-52"
						cx="139.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-53"
						cx="142.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-54"
						cx="144.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-55"
						cx="147.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-56"
						cx="150.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-58"
						cx="155.3"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-59"
						cx="157.9"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-60"
						cx="160.5"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-61"
						cx="163.1"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Power-Bottom-62"
						cx="165.7"
						cy="48.2"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="groundbottom">
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-3"
						cx="12.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-4"
						cx="14.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-5"
						cx="17.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-6"
						cx="20.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-7"
						cx="22.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-9"
						cx="27.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-10"
						cx="30.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-11"
						cx="33.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-12"
						cx="35.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-13"
						cx="38.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-15"
						cx="43.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-16"
						cx="46.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-17"
						cx="48.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-18"
						cx="51.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-19"
						cx="53.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-21"
						cx="59.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-22"
						cx="61.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-23"
						cx="64.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-24"
						cx="66.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-25"
						cx="69.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-27"
						cx="74.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-28"
						cx="77.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-29"
						cx="79.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-30"
						cx="82.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-31"
						cx="85.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-34"
						cx="92.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-35"
						cx="95.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-36"
						cx="98.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-37"
						cx="100.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-38"
						cx="103.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-40"
						cx="108.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-41"
						cx="111.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-42"
						cx="113.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-43"
						cx="116.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-44"
						cx="118.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-46"
						cx="124.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-47"
						cx="126.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-48"
						cx="129.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-49"
						cx="131.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-50"
						cx="134.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-52"
						cx="139.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-53"
						cx="142.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-54"
						cx="144.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-55"
						cx="147.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-56"
						cx="150.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-58"
						cx="155.3"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-59"
						cx="157.9"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-60"
						cx="160.5"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-61"
						cx="163.1"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
					<ellipse
						fill="#000000" stroke="#000000" strokeWidth="0.25" strokeOpacity="1"
						id="Ground-Bottom-62"
						cx="165.7"
						cy="50.8"
						rx="0.625"
						ry="0.625" />
				</g>
				<g id="layer5">
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="15.8"
						id="Col-Label-A">A</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="18.4"
						id="Col-Label-B">B</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="21.0"
						id="Col-Label-C">C</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="23.6"
						id="Col-Label-D">D</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="26.2"
						id="Col-Label-E">E</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="31.4"
						id="Col-Label-F">F</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="34.0"
						id="Col-Label-G">G</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="36.4"
						id="Col-Label-H">H</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="39.0"
						id="Col-Label-I">I</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="3.8"
						y="41.4"
						id="Col-Label-J">J</text>
				
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="7.1"
						y="13.0"
						id="Col-Label-1">1</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="12.3"
						y="13.0"
						id="Col-Label-3">3</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="17.5"
						y="13.0"
						id="Col-Label-5">5</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="22.9"
						y="13.0"
						id="Col-Label-7">7</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="27.9"
						y="13.0"
						id="Col-Label-9">9</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="33.1"
						y="13.0"
						id="Col-Label-11">11</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="38.3"
						y="13.0"
						id="Col-Label-13">13</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="43.5"
						y="13.0"
						id="Col-Label-15">15</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="48.9"
						y="13.0"
						id="Col-Label-17">17</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="53.9"
						y="13.0"
						id="Col-Label-19">19</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="59.1"
						y="13.0"
						id="Col-Label-21">21</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="64.3"
						y="13.0"
						id="Col-Label-23">23</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="69.5"
						y="13.0"
						id="Col-Label-25">25</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="74.9"
						y="13.0"
						id="Col-Label-27">27</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="79.9"
						y="13.0"
						id="Col-Label-29">29</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="85.1"
						y="13.0"
						id="Col-Label-31">31</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="90.3"
						y="13.0"
						id="Col-Label-33">33</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="95.5"
						y="13.0"
						id="Col-Label-35">35</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="100.9"
						y="13.0"
						id="Col-Label-37">37</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="105.9"
						y="13.0"
						id="Col-Label-39">39</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="111.1"
						y="13.0"
						id="Col-Label-41">41</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="116.3"
						y="13.0"
						id="Col-Label-43">43</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="121.5"
						y="13.0"
						id="Col-Label-45">45</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="126.9"
						y="13.0"
						id="Col-Label-47">47</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="131.9"
						y="13.0"
						id="Col-Label-49">49</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="137.1"
						y="13.0"
						id="Col-Label-51">51</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="142.3"
						y="13.0"
						id="Col-Label-53">53</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="147.5"
						y="13.0"
						id="Col-Label-55">55</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="152.7"
						y="13.0"
						id="Col-Label-57">57</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="157.9"
						y="13.0"
						id="Col-Label-59">59</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="163.1"
						y="13.0"
						id="Col-Label-61">61</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="168.3"
						y="13.0"
						id="Col-Label-63">63</text>
				
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="9.7"
						y="44.0"
						id="Col-Label-2">2</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="14.9"
						y="44.0"
						id="Col-Label-4">4</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="20.1"
						y="44.0"
						id="Col-Label-6">6</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="25.3"
						y="44.0"
						id="Col-Label-8">8</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="30.5"
						y="44.0"
						id="Col-Label-10">10</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="35.7"
						y="44.0"
						id="Col-Label-12">12</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="40.9"
						y="44.0"
						id="Col-Label-14">14</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="46.1"
						y="44.0"
						id="Col-Label-16">16</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="51.3"
						y="44.0"
						id="Col-Label-18">18</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="56.5"
						y="44.0"
						id="Col-Label-20">20</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="61.7"
						y="44.0"
						id="Col-Label-22">22</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="66.9"
						y="44.0"
						id="Col-Label-24">24</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="72.1"
						y="44.0"
						id="Col-Label-26">26</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="77.3"
						y="44.0"
						id="Col-Label-28">28</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="82.5"
						y="44.0"
						id="Col-Label-30">30</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="87.7"
						y="44.0"
						id="Col-Label-32">32</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="92.9"
						y="44.0"
						id="Col-Label-34">34</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="98.1"
						y="44.0"
						id="Col-Label-36">36</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="103.3"
						y="44.0"
						id="Col-Label-38">38</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="108.5"
						y="44.0"
						id="Col-Label-40">40</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="113.7"
						y="44.0"
						id="Col-Label-42">42</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="118.9"
						y="44.0"
						id="Col-Label-44">44</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="124.1"
						y="44.0"
						id="Col-Label-46">46</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="129.3"
						y="44.0"
						id="Col-Label-48">48</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="134.5"
						y="44.0"
						id="Col-Label-50">50</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="139.7"
						y="44.0"
						id="Col-Label-52">52</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="144.9"
						y="44.0"
						id="Col-Label-54">54</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="150.1"
						y="44.0"
						id="Col-Label-56">56</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="155.3"
						y="44.0"
						id="Col-Label-58">58</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="160.5"
						y="44.0"
						id="Col-Label-60">60</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="165.7"
						y="44.0"
						id="Col-Label-62">62</text>
					<text
						fontSize="2.82223"
						line-height="1.25"
						fontFamily="Calibri"
						fill="#000000"
						strokeWidth="0"
						textAnchor="middle"
						x="170.9"
						y="44.0"
						id="Col-Label-64">64</text>
				</g>
				<rect
					width="178.2547"
					height="55.881859"
					x="-0.45604399"
					y="9.6281099e-08"
					fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeWidth="0.25" strokeMiterlimit="50" strokeLinecap="round" strokeLinejoin="round" />
			</g>
		)
    }
}