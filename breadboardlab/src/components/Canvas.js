import React from "react";

export default class Canvas extends React.Component {
    previousTouch = null;
    mouseIsDown = false;
    prevDiff = 0;
    scale = 1;

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
        this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleOnWheel = this.handleOnWheel.bind(this);
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener("wheel", (e) => e.preventDefault(), { passive:false });
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.svg = document.getElementById("AppSVG");
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleOnMouseUp() {
        window.removeEventListener("mouseup", this.handleOnMouseUp);
        this.mouseIsDown = false;
    }

    handleMouseDown() {
        this.mouseIsDown = true;
        this.previousTouch = null;
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

    handleTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];

            if (this.previousTouch) {
                e.movementX = touch.pageX - this.previousTouch.pageX;
                e.movementY = touch.pageY - this.previousTouch.pageY;
                this.handleMouseMove(e);
            };
            this.previousTouch = touch;
        } else if (e.touches.length === 2) {
            let curDiff = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
            if (this.prevDiff > 0) {
                if (curDiff > this.prevDiff) {
                    e.deltaY = 2;
                    this.handleOnWheel(e);
                }
                if (curDiff < this.prevDiff) {
                    e.deltaY = -2;
                    this.handleOnWheel(e);
                }
            }
            this.prevDiff = curDiff;
        }
    }

    handleOnWheel(e) {
        let scale;
        if (e.deltaY <= -2) {
            scale = 0.8;
        } else if (e.deltaY >= 2) {
            scale = 1.2;
        }
        let newScale = Math.round(Number((this.scale * scale).toPrecision(2)) * 100) / 100;
        
        if (newScale <= 1.2 && newScale >= 0.06) { 
            this.scale = newScale;
            let viewBox = {...this.state.viewBox};
            let pos = this.svg.createSVGPoint();
            pos.x = e.clientX;
            pos.y = e.clientY;
            let cursorpt = pos.matrixTransform(this.svg.getScreenCTM().inverse());
    
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
        this.setState({viewBox});
    }

    render() {
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
                </defs>
                <rect
                    onMouseUp={e => this.handleOnMouseUp(e)}
                    onMouseDown={e => this.handleMouseDown(e)} 
                    onTouchStart={e => this.handleMouseDown(e)}
                    onMouseMove={e => this.handleMouseMove(e)}
                    onTouchMove={e => this.handleTouchMove(e)}
                    width={this.state.viewBox.width / this.scale * 2 + 200} height={this.state.viewBox.height / this.scale * 2 + 200} fill="url(#grid)"
                    transform={`translate(${this.state.viewBox.x - (this.state.viewBox.x % 100) - 100} ${(this.state.viewBox.y - (this.state.viewBox.y % 100) - 100)})`}
                />
                {this.props.listOfParts}
            </svg>
        )
    }
}
