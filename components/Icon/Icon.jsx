import PropTypes from "prop-types";
import { PureComponent } from "react";
import IconType from "./IconType";
import classnames from "classnames";
import styles from "./Icon.scss";

class Icon extends PureComponent {
    render() {
        const { type, className, onClick, isStrikeout, ...otherProps } = this.props;

        const iconClass = classnames(
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
    className: PropTypes.string.isRequired,
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
