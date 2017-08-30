import { PureComponent } from "react";
import PropTypes from "prop-types";

import SpecialCharacters from "billing-ui/helpers/SpecialCharacters";

import styles from "./ActionButtonRow.scss";
import cx from "classnames";

class ActionButtonRow extends PureComponent {
    render() {
        const { isActive, onClick, className } = this.props;

        return (
            <div className={cx(styles.button, className, { [styles.active]: isActive })} onMouseDown={onClick}>
                <div className={styles.dots}>
                    {SpecialCharacters.Ellipsis}
                </div>
            </div>
        );
    }
}

ActionButtonRow.propTypes = {
    isActive: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default ActionButtonRow;
