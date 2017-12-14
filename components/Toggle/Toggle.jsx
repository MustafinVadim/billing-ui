import { PureComponent } from "react";
import PropTypes from "prop-types";

import ToggleColors from "./ToggleColors";

import cx from "classnames";
import styles from "./Toggle.scss";

class Toggle extends PureComponent {
    _handleChange = () => {
        const { onChange, isChecked, isDisabled } = this.props;

        if (!isDisabled) {
            onChange({ isChecked: !isChecked });
        }
    };

    render() {
        const { color, isChecked, isDisabled, children, className, labelAttributes } = this.props;

        return (
            <div className={cx(styles.wrapper, className, { [styles.disabled]: isDisabled })}>
                <label className={styles.label} { ...labelAttributes }>
                    <input type="checkbox" className={styles.checkbox} checked={isChecked} onChange={this._handleChange} />
                    <span className={cx(styles.switch, styles[color])} />
                    <span>{children}</span>
                </label>
            </div>
        );
    }
}

Toggle.propTypes = {
    className: PropTypes.string,
    labelAttributes: PropTypes.object,
    color: PropTypes.oneOf(Object.keys(ToggleColors)),

    isChecked: PropTypes.bool,
    isDisabled: PropTypes.bool,

    onChange: PropTypes.func,

    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

Toggle.defaultProps = {
    isChecked: false,
    color: ToggleColors.green
};

export default Toggle;
