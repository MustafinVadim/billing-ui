import { PureComponent, PropTypes, cloneElement } from "react";
import ReactDOM, { findDOMNode } from "react-dom";
import KeyCodes from "../../helpers/KeyCodes";

class Portal extends PureComponent {

    constructor() {
        super();
        this.state = { active: false };
        this.handleWrapperClick = this.handleWrapperClick.bind(this);
        this.closePortal = this.closePortal.bind(this);
        this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.portal = null;
        this.node = null;
    }

    componentDidMount() {
        if (this.props.closeOnEsc) {
            document.addEventListener("keydown", this.handleKeydown);
        }

        if (this.props.closeOnOutsideClick) {
            document.addEventListener("mouseup", this.handleOutsideMouseClick);
            document.addEventListener("touchstart", this.handleOutsideMouseClick);
        }

        if (this.props.isOpened) {
            this.openPortal();
        }
    }

    componentWillReceiveProps(newProps) {
        if (typeof newProps.isOpened !== "undefined") {
            if (newProps.isOpened) {
                if (this.state.active) {
                    this.renderPortal(newProps);
                } else {
                    this.openPortal(newProps);
                }
            }
            if (!newProps.isOpened && this.state.active) {
                this.closePortal();
            }
        }

        if (typeof newProps.isOpened === "undefined" && this.state.active) {
            this.renderPortal(newProps);
        }
    }

    componentWillUnmount() {
        if (this.props.closeOnEsc) {
            document.removeEventListener("keydown", this.handleKeydown);
        }

        if (this.props.closeOnOutsideClick) {
            document.removeEventListener("mouseup", this.handleOutsideMouseClick);
            document.removeEventListener("touchstart", this.handleOutsideMouseClick);
        }

        this.closePortal(true);
    }

    handleWrapperClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.active) {
            return;
        }
        this.openPortal();
    }

    openPortal(props = this.props) {
        this.setState({ active: true });
        this.renderPortal(props);
        this.props.onOpen(this.node);
    }

    closePortal(isUnmounted = false) {
        const resetPortalState = () => {
            if (this.node) {
                ReactDOM.unmountComponentAtNode(this.node);
                document.body.removeChild(this.node);
            }
            this.portal = null;
            this.node = null;
            if (isUnmounted !== true) {
                this.setState({ active: false });
            }
        };

        if (this.state.active) {
            if (this.props.beforeClose) {
                this.props.beforeClose(this.node, resetPortalState);
            } else {
                resetPortalState();
            }

            this.props.onClose();
        }
    }

    handleOutsideMouseClick(e) {
        if (!this.state.active) {
            return;
        }

        const root = findDOMNode(this.portal);
        if (root.contains(e.target) || (e.button && e.button !== 0)) {
            return;
        }

        e.stopPropagation();
        this.closePortal();
    }

    handleKeydown(e) {
        if (e.keyCode === KeyCodes.esc && this.state.active) {
            this.closePortal();
        }
    }

    applyClassName(props) {
        if (props.className) {
            this.node.className = props.className;
        }
    }

    renderPortal(props) {
        if (!this.node) {
            this.node = document.createElement("div");
            this.applyClassName(props);
            document.body.appendChild(this.node);
        } else {
            this.applyClassName(props);
        }

        let children = props.children;
        if (typeof props.children.type === "function") {
            children = cloneElement(props.children, { closePortal: this.closePortal });
        }

        this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
            this,
            children,
            this.node,
            this.props.onUpdate
        );
    }

    render() {
        if (this.props.openByClickOn) {
            return cloneElement(this.props.openByClickOn, { onClick: this.handleWrapperClick });
        }
        return null;
    }
}

Portal.propTypes = {
    className: PropTypes.string,
    children: PropTypes.element.isRequired,
    openByClickOn: PropTypes.element,
    closeOnEsc: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    isOpened: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    beforeClose: PropTypes.func,
    onUpdate: PropTypes.func
};

Portal.defaultProps = {
    onOpen: () => {},
    onClose: () => {},
    onUpdate: () => {}
};

export default Portal;
