import { PureComponent } from "react";
import PropTypes from "prop-types";

import Icon, { IconTypes } from "../Icon";

import styles from "./Label.scss";

class Label extends PureComponent {
    render() {
        const { children, onRemove } = this.props;
        return (
            <span className={styles.root}>
                {children}
                <Icon onClick={onRemove}
                      className={styles.icon}
                      type={IconTypes.Delete} />
            </span>
        );
    }
}

Label.propTypes = {
    children: PropTypes.node,
    onRemove: PropTypes.func
};

export default Label;
