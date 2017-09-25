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
        const { color, isChecked, isDisabled } = this.props;

        return (
            <div className={cx(styles.wrapper, { [styles.disabled]: isDisabled })}>
                <label>
                    <input type="checkbox" className={styles.checkbox} checked={isChecked} onChange={this._handleChange} />
                    <span className={cx(styles.label, styles[color])} />
                </label>
            </div>
        );
    }
}

Toggle.propTypes = {
    color: PropTypes.oneOf(Object.keys(ToggleColors)),
    isChecked: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func
};

Toggle.defaultProps = {
    isChecked: false,
    color: ToggleColors.green
};

export default Toggle;
