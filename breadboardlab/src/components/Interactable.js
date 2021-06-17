import {Component, cloneElement} from "react";
import PropTypes from "prop-types";

import interact from "interactjs";

export default class Interactable extends Component {
    // Default values
    static defaultProps = {
        draggable: false,
        resizable: false,
        gesturable: false,
        dropzone: false,
        draggableOptions: {},
        resizableOptions: {},
        gesturableOptions: {},
        dropzoneOptions: {},
        onDown: {},
        onMove: {},
        onUp: {},
        onCancel: {},
        onTap: {},
        onDoubleTap: {},
        onHold: {},
    };

    setInteractions() {
        // Action Props
        if (this.props.draggable) this.interact.draggable(this.props.draggableOptions);
        if (this.props.resizable) this.interact.resizable(this.props.resizableOptions);
        if (this.props.gesturable) this.interact.gesturable(this.props.gesturableOptions);
        if (this.props.dropzone) this.interact.dropzone(this.props.dropzoneOptions);

        // Events Props
        if (this.props.onDown) this.interact.on("down", this.props.onDown);
        if (this.props.onMove) this.interact.on("move", this.props.onMove);
        if (this.props.onUp) this.interact.on("down", this.props.onUp);
        if (this.props.onCancel) this.interact.on("down", this.props.onCancel);
        if (this.props.onTap) this.interact.on("down", this.props.onTap);
        if (this.props.onDoubleTap) this.interact.on("doubletap", this.props.onDoubleTap)
        if (this.props.onHold) this.interact.on("down", this.props.onHold);

        if (this.props.styleCursor === false) this.interact.styleCursor(false);
    }

    componentDidMount() {
        this.interact = interact(this.node);
        this.setInteractions();
    }

    render() {
        return cloneElement(this.props.children, {
            ref: node => this.node = node,
        });
    }
}

// Props typechecking
Interactable.propTypes = {
    children: PropTypes.node.isRequired,

    draggable: PropTypes.bool,
    draggableOptions: PropTypes.object,

    resizable: PropTypes.bool,
    resizableOptions: PropTypes.object,

    gesturable: PropTypes.bool,
    gesturableOptions: PropTypes.object,

    dropzone: PropTypes.bool,
    dropzoneOptions: PropTypes.object,

    // Pointer Events Types
    // onDown: PropTypes.func,
    // onMove: PropTypes.func,
    // onUp: PropTypes.func,
    // onCancel: PropTypes.func,
    // onTap: PropTypes.func,
    // onDoubleTap: PropTypes.func,
    // onHold: PropTypes.func,

};
