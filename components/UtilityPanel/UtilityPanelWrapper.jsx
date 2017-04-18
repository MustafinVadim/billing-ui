import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactDOM from "react-dom";
import cx from "classnames";

import UtilityPanel from "./UtilityPanel";
import Portal from "../Portal";

import styles from "./UtilityPanelWrapper.scss";
import utilityPanelStyles from "./UtilityPanel.scss";

const CSS_ANIMATION_TIME = 300;

class UtilityPanelWrapper extends PureComponent {
    _beforeClose = (portalDOMNode, removePortalFromDOM) => {
        const { beforeClose } = this.props;
        portalDOMNode.className += " " + styles.closing;
        this._utilityPanel.className += " " + utilityPanelStyles.closing;
        beforeClose && beforeClose();

        setTimeout(removePortalFromDOM, CSS_ANIMATION_TIME);
    };

    render() {
        const { title, wrapperClassName, bodyClassName, children, overlayClassName, headerAdditionalContent, onScroll } = this.props;

        const portalClassNames = cx(
            styles.overlay,
            overlayClassName
        );

        const portalProps = {
            ...this.props,
            beforeClose: this._beforeClose
        };

        delete portalProps.children;
        delete portalProps.overlayClassName;
        delete portalProps.wrapperClassName;
        delete portalProps.title;

        return (
            <Portal { ...portalProps } className={portalClassNames}>
                <UtilityPanel
                    onScroll={onScroll}
                    title={title}
                    headerAdditionalContent={headerAdditionalContent}
                    wrapperClassName={wrapperClassName}
                    bodyClassName={bodyClassName}
                    ref={(el) => {
                        this._utilityPanel = ReactDOM.findDOMNode(el)
                    }}>
                    {children}
                </UtilityPanel>
            </Portal>
        );
    }
}

UtilityPanelWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    openByClickOn: PropTypes.node,
    isOpened: PropTypes.bool,
    closeOnEsc: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    onOpen: PropTypes.func,
    beforeClose: PropTypes.func,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,

    overlayClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    bodyClassName: PropTypes.string,
    title: PropTypes.string,
    headerAdditionalContent: PropTypes.node
};

export default UtilityPanelWrapper;
