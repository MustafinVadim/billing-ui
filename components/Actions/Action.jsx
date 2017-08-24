import PropTypes from "prop-types";
import { PureComponent } from "react";
import Icon from "../Icon";
import Link from "../Link";
import styles from "./Actions.scss";
import cx from "classnames";

class Action extends PureComponent {
    render() {
        const { href, target, description, onClick, className, iconType, iconClassName } = this.props;

        return (
            <Link className={cx(styles.action, className)} href={href} target={target} onClick={onClick}>
                <Icon className={cx(styles.icon, iconClassName)} type={iconType} />
                <span className={styles.description}>{description}</span>
            </Link>
        );
    }
}

Action.propTypes = {
    onClick: PropTypes.func,
    asLink: PropTypes.bool,
    href: PropTypes.string,
    target: PropTypes.string,
    iconType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    className: PropTypes.string,
    iconClassName: PropTypes.string
};

Action.defaultProps = {
    className: "",
    onClick: () => {},
    asLink: false
};

export default Action;
