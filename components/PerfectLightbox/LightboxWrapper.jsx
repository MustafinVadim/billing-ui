import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactDOM from "react-dom";
import cx from "classnames";
import omit from "lodash/omit";

import Portal from "../Portal";
import Lightbox from "./Lightbox";
import positionTypes from "./LightboxPositionType";
import styles from "./LightboxWrapper.scss";
import lightboxStyles from "./Lightbox.scss";

const CSS_ANIMATION_TIME = 400;

class LightboxWrapper extends PureComponent {
    _beforeClose = (portalDOMNode, removePortalFromDOM) => {
        portalDOMNode.className += " " + styles.closing;
        this._lightbox.className += " " + lightboxStyles.closing;
        this.props.beforeClose && this.props.beforeClose();

        setTimeout(removePortalFromDOM, CSS_ANIMATION_TIME);
    };

    render() {
        const { children, overlayClassName, lightboxClassName, closeButtonClassName, positionType, width, ftId } = this.props;

        const portalClassNames = cx(
            styles.overlay,
            overlayClassName
        );

        const fieldsToOmit = ["children", "overlayClassName", "lightboxClassName", "positionType", "width", "ftId", "closeButtonClassName"];

        const portalProps = {
            ...omit(this.props, fieldsToOmit),
            beforeClose: this._beforeClose
        };

        return (
            <Portal { ...portalProps } className={ portalClassNames }>
                <Lightbox
                    ftId={ftId}
                    className={lightboxClassName}
                    closeButtonClassName={closeButtonClassName}
                    positionType={positionType}
                    width={width}
                    ref={(elm) => {
                        this._lightbox = ReactDOM.findDOMNode(elm)
                    }}>
                    {children}
                </Lightbox>
            </Portal>
        );
    }
}

LightboxWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    openByClickOn: PropTypes.node,
    isOpened: PropTypes.bool,
    closeOnEsc: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    onOpen: PropTypes.func,
    beforeClose: PropTypes.func,
    onClose: PropTypes.func,
    ftId: PropTypes.string,

    overlayClassName: PropTypes.string,
    lightboxClassName: PropTypes.string,
    closeButtonClassName: PropTypes.string,
    positionType: PropTypes.oneOf(Object.keys(positionTypes)),
    width: PropTypes.number
};

LightboxWrapper.defaultProps = {
    positionType: positionTypes.top,
    closeOnEsc: true
};

export default LightboxWrapper
