import PropTypes from "prop-types";
import { PureComponent } from "react";
import MessageType from "./MessageType";
import cx from "classnames";

import styles from "./WarningMessage.scss";

class WarningMessage extends PureComponent {
    render() {
        const { children, type, className, hidden, animated, attributes } = this.props;

        const messageClassNames = cx(styles.message, styles[type], className, {
            [styles.hidden]: hidden,
            [styles.animated]: animated
        });
        return (
            <div className={messageClassNames} { ...attributes }>{children}</div>
        );
    }
}

WarningMessage.propTypes = {
    children: PropTypes.node,
    type: PropTypes.oneOf(Object.keys(MessageType)),
    className: PropTypes.string,
    hidden: PropTypes.bool,
    animated: PropTypes.bool,
    attributes: PropTypes.object
};

WarningMessage.defaultProps = {
    type: MessageType.base,
    className: "",
    animated: true,
    hidden: false
};

export default WarningMessage
