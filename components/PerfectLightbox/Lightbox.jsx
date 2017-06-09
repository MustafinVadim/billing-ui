import PropTypes from "prop-types";
import { PureComponent } from "react";

import positionTypes from "./LightboxPositionType";
import styles from "./Lightbox.scss";
import cx from "classnames";

class Lightbox extends PureComponent {
    _handleCloseClick = () => {
        this.props.closeClick && this.props.closeClick();
        this.props.closePortal && this.props.closePortal();
    };

    render() {
        const { children, className, closeButtonClassName, positionType, width, ftId } = this.props;

        const lightboxClassNames = cx(
            styles.lightbox,
            styles[positionType],
            className
        );

        const lightboxStyle = {
            width
        };
        return (
            <div className={ lightboxClassNames } style={lightboxStyle} data-ft-id={ftId}>
                <button className={cx(styles["close-button"], closeButtonClassName)} onClick={this._handleCloseClick} data-ft-id="lightbox-close-button" />
                {children}
            </div>
        )
    }
}

Lightbox.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    closeButtonClassName: PropTypes.string,
    positionType: PropTypes.oneOf(Object.keys(positionTypes)),
    beforeClose: PropTypes.func,
    closeClick: PropTypes.func,
    closePortal: PropTypes.func, // передаётся сюда из Portal
    width: PropTypes.number,
    ftId: PropTypes.string
};
export default Lightbox
