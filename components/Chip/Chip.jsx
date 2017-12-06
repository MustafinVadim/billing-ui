import { PureComponent } from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";

import Icon, { IconTypes } from "../Icon";

import styles from "./Chip.scss";
import cx from "classnames";

class Chip extends PureComponent {
    render() {
        const { className, children, iconClassName, onRemove, closeIconFtId } = this.props;
        const fieldsToOmit = ["className", "children", "iconClassName", "onRemove", "ref", "key"];
        const spanProps = omit(this.props, fieldsToOmit);

        return (
            <span
                className={cx(styles.content, className)}
                {...spanProps}
            >
                {children}
                <Icon
                    onClick={onRemove}
                    className={cx(styles.icon, iconClassName)}
                    type={IconTypes.Delete}
                    data-ft-id={closeIconFtId}
                />
            </span>
        );
    }
}

Chip.propTypes = {
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    closeIconFtId: PropTypes.string,

    children: PropTypes.string,

    onRemove: PropTypes.func
};

export default Chip;
