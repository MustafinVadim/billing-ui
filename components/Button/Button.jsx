import { Component, PropTypes } from "react";
import AppearanceType from "./AppearanceType";
import ButtonSize from "./ButtonSize";
import ButtonType from "./ButtonType";
import Link from "../Link";
import classnames from "classnames";
import buttonStyles from "./Button.scss";

class Button extends Component {
    render() {
        const { href, target, className, onClick, children, appearance, type, size, disabled, active, styles } = this.props;
        const classNames = classnames(
            styles.button,
            className,
            styles[AppearanceType[appearance]],
            styles["size-" + ButtonSize[size]], {
                [styles.disabled]: disabled,
                [styles["as-active"]]: !disabled && active
            });

        if (href) {
            return <Link onClick={onClick} href={href} className={classNames} target={target}>{children}</Link>;
        }

        if (type) {
            return <button onClick={onClick} className={classNames} type={type}>{children}</button>;
        }

        return <span onClick={onClick} className={classNames}>{children}</span>;
    }
}

Button.propTypes = {
    onClick: PropTypes.func,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    target: PropTypes.string,
    className: PropTypes.string,
    styles: PropTypes.shape({
        button: PropTypes.string
    }).isRequired,
    type: PropTypes.oneOf(Object.keys(ButtonType).map((key) => ButtonType[key])),
    size: PropTypes.oneOf(Object.keys(ButtonSize).map((key) => ButtonSize[key])),
    appearance: PropTypes.oneOf(Object.keys(AppearanceType).map((key) => AppearanceType[key]))
};

Button.defaultProps = {
    className: "",
    active: false,
    disabled: false,
    styles: buttonStyles,
    appearance: AppearanceType.default,
    size: ButtonSize.default
};

export default Button;
