import PropTypes from "prop-types";
import { PureComponent } from "react";

import styles from "./TabButton.scss";
import cx from "classnames";

class TabButton extends PureComponent {
    _handleClick = (evt) => {
        const { onClick, isDisabled, isActive } = this.props;

        if (!isDisabled && !isActive) {
            onClick({ tab: evt.target.getAttribute("name") });
        }
    };

    render() {
        const { tab, title, isActive, className, isDisabled } = this.props;

        return (
            <span
                className={cx(styles.tab, className, { [styles.active]: isActive, [styles.disabled]: isDisabled })}
                name={tab}
                data-ft-id={`${tab}-tab-button`}
                onClick={this._handleClick}
            >
                {title}
            </span>
        );
    }
}

TabButton.propTypes = {
    tab: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
    isDisabled: PropTypes.bool,
    className: PropTypes.string
};

export default TabButton;
