import React from "react";

export default class Canvas extends React.Component {
    mouseIsDown = false;
    scale = 0.3;

    constructor(props) {
        super(props)
        this.state = {
            viewBox : {
                x: 0,
                y: 0,
                width: window.innerWidth * this.scale,
                height: window.innerHeight * this.scale
            }
        }
        this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleOnWheel = this.handleOnWheel.bind(this);
        this.handleResize = this.handleResize.bind(this)
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleOnMouseUp(e) {
        window.removeEventListener("mouseup", this.handleOnMouseUp);
        this.mouseIsDown = false;
    }

    handleMouseDown(e) {
        this.mouseIsDown = true;
        window.addEventListener("mouseup", this.handleOnMouseUp);
    }

    handleMouseMove(e) {
        if (this.mouseIsDown) {
            let viewBox = {...this.state.viewBox};
            viewBox.x -= e.movementX * this.scale;
            viewBox.y -= e.movementY * this.scale;
            this.setViewBox(viewBox);
        }
    }

    handleOnWheel(e) {
       let scale = (e.deltaY < 0) ? 0.8 : 1.2;
       let newScale = Number((this.scale * scale).toPrecision(3));

       if ((newScale < 1.2) && (newScale > 0.1)) { 
            this.scale = newScale;
            let viewBox = {...this.state.viewBox};
            let svg = document.getElementById("AppSVG");
            let pos = svg.createSVGPoint();
            pos.x = e.clientX;
            pos.y = e.clientY;
            let cursorpt = pos.matrixTransform(svg.getScreenCTM().inverse());

            viewBox.x = (viewBox.x - cursorpt.x) * scale + cursorpt.x;
            viewBox.y = (viewBox.y - cursorpt.y) * scale + cursorpt.y;
            viewBox.width = window.innerWidth * this.scale;
            viewBox.height = window.innerHeight * this.scale;
            this.setViewBox(viewBox);
        }
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
        this.setState({viewBox})
    }

    render() {
        return(
            <svg 
                onWheel={e => this.handleOnWheel(e)}
                viewBox={`${this.state.viewBox.x} ${this.state.viewBox.y} ${this.state.viewBox.width} ${this.state.viewBox.height}`}
                scale={this.scale}
                xmlns="http://www.w3.org/2000/svg" id="AppSVG" style={{position: "absolute", top: 0, right: 0}} width="100%" height="100%">
                {/*<path d="M 0 0 L 1 0 Q 2 0 2 -1 L 2 -2 Q 2 -3 3 -3 L 5 -3 Q 6 -3 6 -2 L 6 0"/> */}
                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>

                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <rect width="100" height="100" fill="url(#smallGrid)"/>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect
                    onMouseUp={e => this.handleOnMouseUp(e)}
                    onMouseDown={e => this.handleMouseDown(e)} 
                    onMouseMove={e => this.handleMouseMove(e)} 
                    width={this.state.viewBox.width / this.scale * 2} height={this.state.viewBox.height / this.scale * 2} fill="url(#grid)"
                    transform={`translate(${this.state.viewBox.x - (this.state.viewBox.x % 100) - 100} ${(this.state.viewBox.y - (this.state.viewBox.y % 100) - 100)})`}
                />
                {this.props.listOfParts}
            </svg>
        )
    }
}
