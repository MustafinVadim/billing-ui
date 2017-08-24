import PropTypes from "prop-types";
import { PureComponent } from "react";
import IconType from "./IconType";
import cx from "classnames";
import styles from "./Icon.scss";

class Icon extends PureComponent {
    render() {
        const { type, className, onClick, isStrikeout, ...otherProps } = this.props;

        if (type === IconType.Ruble) {
            return (
                <span className={cx("currency-ruble", styles.icon, className)}>
                    {IconType.Ruble}
                </span>
            );
        }

        if (type === IconType.Billing) {
            return <span className={cx(styles[type], styles.icon, className)} />;
        }

        const iconClass = cx(
            "iconic base-unselectable",
            styles.icon,
            {
                [styles.strikeout]: isStrikeout
            },
            className
        );

        return (
            <span className={iconClass} unselectable="on" onClick={onClick} { ...otherProps }>
                {type}
            </span>
        );
    }
}

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    isStrikeout: PropTypes.bool
};

Icon.defaultProps = {
    className: "",
    onClick: () => {},
    isStrikeout: false
};

export const IconTypes = IconType;
export default Icon;
