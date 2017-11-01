import { PureComponent } from "react";
import PropTypes from "prop-types";
import CSSTransition from "react-transition-group/CSSTransition";

import Icon from "../Icon";
import InformerStatus from "./InformerStatus";

import styles from "./Informer.scss";
import cx from "classnames";

export const ANIMATION_DURATION = 200;

class Informer extends PureComponent {
    _handleClick = () => {
        const { onClick, message, iconType, status } = this.props;

        onClick({ message, iconType, status });
    };

    render() {
        const { message, iconType, status, isVisible } = this.props;

        return (
            <CSSTransition
                in={isVisible}
                appear={true}
                classNames={{
                    enter: styles.enter,
                    enterActive: styles["enter-active"],
                    appear: styles.appear,
                    appearActive: styles["appear-active"],
                    exit: styles.leave,
                    exitActive: styles["leave-active"]
                }}
                timeout={ANIMATION_DURATION}
            >
                <div className={cx(styles.informer, styles[status])} onClick={this._handleClick}>
                    {iconType && (
                        <Icon type={iconType} className={styles.icon} />
                    )}
                    {message}
                </div>
            </CSSTransition>
        );
    }
}

Informer.propTypes = {
    message: PropTypes.string,
    iconType: PropTypes.string,
    status: PropTypes.oneOf(Object.keys(InformerStatus)),
    onClick: PropTypes.func,
    isVisible: PropTypes.bool
};

export default Informer;
