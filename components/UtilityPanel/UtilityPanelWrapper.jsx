import { PureComponent, PropTypes } from "react";
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
        const { title, panelClassName, children, overlayClassName, headerContent } = this.props;

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
        delete portalProps.panelClassName;
        delete portalProps.title;

        return (
            <Portal { ...portalProps } className={portalClassNames}>
                <UtilityPanel
                    title={title}
                    headerContent={headerContent}
                    className={panelClassName}
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

    overlayClassName: PropTypes.string,
    panelClassName: PropTypes.string,
    title: PropTypes.string,
    headerContent: PropTypes.node
};

export default UtilityPanelWrapper;
