import { PureComponent, PropTypes } from "react";
import IconType from "./IconType";
import classnames from "classnames";
import styles from "./Icon.scss";

class Icon extends PureComponent {
    render() {
        const { type, className, onClick } = this.props;
        const hasStrikeout = type === IconType.TrashStrikeout;
        const iconClass = classnames(
            "iconic base-unselectable",
            styles.icon,
            {
                [styles.strikeout]: hasStrikeout
            },
            className
        );

        return (
            <span className={iconClass} unselectable="on" onClick={onClick}>
                {type}
            </span>
        );
    }
}

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

Icon.defaultProps = {
    className: "",
    onClick: () => {}
};

export const IconTypes = IconType;
export default Icon;
