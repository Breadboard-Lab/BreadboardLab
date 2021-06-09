import React from "react";


export default class Canvas extends React.Component {
    mouseCurrentPosition = {x: 0, y: 0};
    mouseIsDown = false;

    constructor(props) {
        super(props)
        this.state = {
            viewBox : {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight
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
            viewBox.x -= e.movementX;
            viewBox.y -= e.movementY;
            this.setState({viewBox})
        }
    }

    handleOnWheel(e) {
  
    }

    setViewBox() {
    }

    handleResize() {
        if (this.state !== {}) {
            let viewBox = {...this.state.viewBox};
            viewBox.width = window.innerWidth;
            viewBox.height = window.innerHeight;
            this.setState({viewBox})

        }
    }

    render() {
        return(
            <svg
                viewBox={`${this.state.viewBox.x} ${this.state.viewBox.y} ${this.state.viewBox.width} ${this.state.viewBox.height}`}
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
                    onWheel={e => this.handleOnWheel(e)}
                    onMouseUp={e => this.handleOnMouseUp(e)}
                    onMouseDown={e => this.handleMouseDown(e)} 
                    onMouseMove={e => this.handleMouseMove(e)} 
                    width="100%" height="100%" fill="url(#grid)"/>
                {this.props.listOfParts}
            </svg>
        )
    }
}
