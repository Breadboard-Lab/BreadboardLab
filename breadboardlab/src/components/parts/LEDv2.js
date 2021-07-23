import React from "react";
import interact from "interactjs";

export default class LEDv2 extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();

        this.state = {
            type: "LED",
            name: "LED",
            colour: "Red",
            bodyColourRim: "hsl(0, 75%, 50%)",
            bodyColourTop: "hsl(0, 75%, 64%)",
            bodyColourBottom: "hsl(0, 75%, 59%)",
            isSelected: false,
        }
        //this.scale = {x: 1, y: 1};
        //this.offSet = {x: 0, y: 0};
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.updateProp = this.updateProp.bind(this);
    }

    componentDidMount() {
        interact(this.node.current.parentNode).styleCursor(false).draggable({
            listeners: {
                move: this.props.movePart
            },
        })
    }

    onDoubleClick() {
        this.props.onDoubleTap(this.getProps());
    }

    updateProp(propName, value) {
        if (propName.toLowerCase() === "type") {
            this.setState({type: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "name") {
            this.setState({name: value}, this.onDoubleClick);
        } else if (propName.toLowerCase() === "colour") {
            this.setState({colour: value}, this.onDoubleClick);

            // Changes LED colour based on Properties Panel Colour Selection
            switch (value) {
                case "Red":
                    this.setState({
                        bodyColourRim: "hsl(0, 75%, 50%)",
                        bodyColourTop: "hsl(0, 75%, 64%)",
                        bodyColourBottom: "hsl(0, 75%, 59%)",
                    })
                    break
                case "Blue":
                    this.setState({
                        bodyColourRim: "hsl(210, 75%, 50%)",
                        bodyColourTop: "hsl(210, 75%, 64%)",
                        bodyColourBottom: "hsl(210, 75%, 59%)",
                    })
                    break
                case "Green":
                    this.setState({
                        bodyColourRim: "hsl(115,50%,50%)",
                        bodyColourTop: "hsl(115, 50%, 64%)",
                        bodyColourBottom: "hsl(115, 50%, 59%)",
                    })
                    break
                case "Yellow":
                    this.setState({
                        bodyColourRim: "hsl(55, 50%, 50%)",
                        bodyColourTop: "hsl(55, 50%, 64%)",
                        bodyColourBottom: "hsl(55, 50%, 59%)",
                    })
                    break
                default:
                    this.setState({
                        bodyColourRim: "hsl(0, 78%, 50%)",
                        bodyColourTop: "hsl(0, 78%, 64%)",
                        bodyColourBottom: "hsl(0, 78%, 59%)",
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

    render() {
        return (
            <g ref={this.node} onDoubleClick={this.onDoubleClick}>
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
                <path id="select" fill="none" stroke={this.state.isSelected ? "#2453ff" : "none"} strokeLinecap="round"
                      strokeLinejoin="round" strokeMiterlimit="10" d="
			M48,35.091c0-3.75-1.003-6.422-2.712-8.327V14.712c0-7.849-6.557-14.212-14.645-14.212C22.557,0.5,16,6.863,16,14.712v14.666
			v3.843v9.003c1.455,1.7,3.521,3.068,6,4.019v15.289c0,1.087,0.896,1.969,2,1.969s2-0.882,2-1.969V47.339
			c1.495,0.269,3.077,0.411,4.721,0.411c0.429,0,0.854-0.021,1.279-0.044v5.95c0,0.658,0.334,1.272,0.891,1.638L38,58.647v2.884
			c0,1.087,0.896,1.969,2,1.969s2-0.882,2-1.969v-3.938c0-0.658-0.334-1.272-0.891-1.638L36,52.603v-5.448
			C42.697,45.631,48,41.246,48,35.091z"/>
            </g>
        )
    }
}