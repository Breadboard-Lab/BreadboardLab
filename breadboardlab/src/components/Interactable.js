import { Component, cloneElement } from "react";
import PropTypes from "prop-types";

import interact from "interactjs";

export default class Interactable extends Component {
    static defaultProps = {
        draggable: false,
        dropzone: false,
        resizable: false,
        draggableOptions: {},
        dropzoneOptions: {},
        resizableOptions: {}
    };

    render() {
        return cloneElement(this.props.children, {
            ref: node => (this.node = node),
            draggable: false
        });
    }

    componentDidMount() {
        this.interact = interact(this.node);
        this.setInteractions();
    }

    setInteractions() {
        if (this.props.draggable)
            this.interact.draggable(this.props.draggableOptions);
        if (this.props.dropzone)
            this.interact.dropzone(this.props.dropzoneOptions);
        if (this.props.resizable)
            this.interact.resizable(this.props.resizableOptions);
        if (this.props.gesturable)
            this.interact.gesturable(this.props.gesturableOptions);
        if (this.props.onmove)
            this.interact.on("move", this.props.onmove);
        if (this.props.ondown)
            this.interact.on("down", this.props.ondown);
        if (this.props.styleCursor === false)
            this.interact.styleCursor(false);
    }
}

Interactable.propTypes = {
    children: PropTypes.node.isRequired,
    draggable: PropTypes.bool,
    draggableOptions: PropTypes.object,
    dropzone: PropTypes.bool,
    dropzoneOptions: PropTypes.object,
    resizable: PropTypes.bool,
    resizableOptions: PropTypes.object
};
