import React from "react";
import Interactable from "./Interactable";

export default class Canvas extends React.Component {
    mouseIsDown = false;
    scale = 1;

    draggableOptions = {
        inertia: true,
        listeners: {
            move: (event) => {
                let viewBox = {...this.state.viewBox};
                viewBox.x -= event.delta.x * this.scale;
                viewBox.y -= event.delta.y * this.scale;
                this.setViewBox(viewBox);
            }
        }
    }

    gesturableOptions = {
        listeners: {
            move: (event) => {
                let newScale = this.scale / event.scale;

                if (newScale <= 1.2 && newScale >= 0.15 && Math.abs(event.da) >= 0.25) { 
                    this.scale = newScale;
                    let xPos = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                    let yPos = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                    this.handleZoom(xPos, yPos, event.scale)
                }
                this.draggableOptions.listeners.move(event)
            }
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            viewBox : {
                x: 0,
                y: 0,
                width: window.innerWidth * this.scale,
                height: window.innerHeight * this.scale
            }
        };
        this.handleResize = this.handleResize.bind(this)
        window.addEventListener("wheel", (e) => e.preventDefault(), { passive:false });
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.svg = document.getElementById("AppSVG");
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleOnWheel(e) {
        let scale;
        if (e.deltaY <= -4) {
            scale = 0.8;
        } else if (e.deltaY >= 4) {
            scale = 1.2;
        }
        let newScale = Math.round(Number((this.scale * scale).toPrecision(2)) * 100) / 100;
        
        if (newScale <= 1.0 && newScale >= 0.15) { 
            this.scale = newScale;
            let pos = this.svg.createSVGPoint();
            pos.x = e.clientX;
            pos.y = e.clientY;
            let cursorpt = pos.matrixTransform(this.svg.getScreenCTM().inverse());
            
            this.handleZoom(cursorpt.x, cursorpt.y, scale);
         }
    }
    
    handleZoom(x, y, scale) {
        let viewBox = {...this.state.viewBox};
        viewBox.x = (viewBox.x - x) * scale + x;
        viewBox.y = (viewBox.y - y) * scale + y;
        viewBox.width = window.innerWidth * this.scale;
        viewBox.height = window.innerHeight * this.scale;
        this.setViewBox(viewBox);
    }

    handleResize() {
        let viewBox = {...this.state.viewBox};
        viewBox.width = window.innerWidth * this.scale;
        viewBox.height = window.innerHeight * this.scale;
        this.setViewBox(viewBox);
    }

    setViewBox(viewBox) {
        viewBox.x = Number(viewBox.x).toPrecision(5);
        viewBox.y = Number(viewBox.y).toPrecision(5);
        viewBox.width = Number(viewBox.width).toPrecision(5);
        viewBox.height = Number(viewBox.height).toPrecision(5);
        this.setState({viewBox});
    }

    render() {
        let listOfParts = this.props.listOfParts.map((c, index) => 
            React.cloneElement(c, {key: index})
        )
        return(
            <svg 
                onWheel={e => this.handleOnWheel(e)}
                viewBox={`${this.state.viewBox.x} ${this.state.viewBox.y} ${this.state.viewBox.width} ${this.state.viewBox.height}`}
                scale={this.scale}
                xmlns="http://www.w3.org/2000/svg" id="AppSVG" 
                style={{position: "absolute", top: 0, right: 0, touchAction: "none"}} width="100%" height="100%"
            >
                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>

                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <rect width="100" height="100" fill="url(#smallGrid)"/>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>

                    <filter id="f1" x="-25" y="-25" width="50" height="50">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur"/>
                        <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="0 0 0 0 0
                                    0 0 0 0 0
                                    1 1 1 1 1
                                    0 0 0 3 0" 
                            result="blue"/>
                        <feMerge>
                            <feMergeNode in="blue" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="f2" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur"/>
                        <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="0 0 0 0 0
                                    0 0 0 0 0
                                    1 1 1 1 1
                                    0 0 0 4 0" 
                            result="blue"/>
                        <feMerge>
                            <feMergeNode in="blue" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="f3" x="-25" y="-25" width="50" height="50">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"/>
                        <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="0 0 0 0 0
                                    1 1 1 1 1
                                    0 0 0 0 0
                                    0 0 0 4 0" 
                            result="green"/>
                        <feMerge>
                            <feMergeNode in="green" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <Interactable 
                    draggable={true} draggableOptions={this.draggableOptions}
                    gesturable={true} gesturableOptions={this.gesturableOptions}
                    styleCursor={false}
                >
                    <rect
                        width={this.state.viewBox.width / this.scale * 2 + 200} height={this.state.viewBox.height / this.scale * 2 + 200} fill="url(#grid)"
                        transform={`translate(${this.state.viewBox.x - (this.state.viewBox.x % 100) - 100} ${(this.state.viewBox.y - (this.state.viewBox.y % 100) - 100)})`}
                    />
                </Interactable>
                {listOfParts}
            </svg>
        )
    }
}
