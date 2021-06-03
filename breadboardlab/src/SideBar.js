import React from 'react';
import './SideBar.css';
import Parts from './Parts.js';

function Part(props) {
    return(
        <div className="part-container">
            <svg>
                <g className="part">
                    {props.part}
                </g>
                <text textAnchor="middle" x="50%" y="90%">{props.name}</text>
            </svg>
        </div>
        );
}

class SideBar extends React.Component {
    state = { name: "" }

    callbackFunction = (childData) => {
        this.setState({
            name: childData
        });
    }

    renderPart(part) {
        
    }

    render() {
        return(
            <div className="sidebar">
                <Part part={<Parts.Circle parentCallback = {this.callbackFunction} />} name={this.state.name} />
            </div>
        );
    }
}

export default SideBar;