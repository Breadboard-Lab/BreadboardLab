import React from 'react';

class Circle extends React.Component {
    sendData = () => {
        this.props.parentCallback("Hey Popsie, How’s it going?");
    }

    render() {
        this.sendData();
        return(
            <circle cx="62.5" cy="55" r="30" stroke="black" strokeWidth="3" fill="blue" fillOpacity="0.5"/>
        );
    }
}

class Triangle extends React.Component {
    sendData = () => {
        this.props.parentCallback("Hey Popsie, How’s it going?");
    }

    render() {
        this.sendData();
        return(
            <polygon points="62.5,10 10,90 115,90" stroke="black" strokeWidth="3" fill="red" fillOpacity="0.5" />
        );
    }
}

class Path extends React.Component {
    sendData = () => {
        this.props.parentCallback("Hey Popsie, How’s it going?");
    }

    render() {
        this.sendData();
        return(
            <g>
                <path transform="translate(30, 70) scale(10 10)" stroke="black" strokeWidth="1" fill="none" d="M 0 0 L 1 0 Q 2 0 2 -1 L 2 -2 Q 2 -3 3 -3 L 5 -3 Q 6 -3 6 -2 L 6 0"/>
                <path transform="translate(30, 70) scale(10 10)" stroke="green" strokeWidth="0.7" fill="none" d="M 0 0 L 1 0 Q 2 0 2 -1 L 2 -2 Q 2 -3 3 -3 L 5 -3 Q 6 -3 6 -2 L 6 0"/>
            </g>
        );
    }
}

const exportedObject = {
    Circle,
    Triangle,
    Path
};

export default exportedObject;