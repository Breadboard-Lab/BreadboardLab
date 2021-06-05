import React from "react";

export default class Canvas extends React.Component {
    render() {
        return(
            <svg xmlns="http://www.w3.org/2000/svg" id="AppSVG" style={{position: "absolute", top: 0, right: 0}} width="100%" height="100%">
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
                <rect width="100%" height="100%" fill="url(#grid)"/>
                {this.props.listOfParts}
            </svg>
        )
    }
}
