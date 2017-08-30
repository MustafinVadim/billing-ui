import { PureComponent } from "react";
import PropTypes from "prop-types";

import Icon from "billing-ui/components/Icon";
import Link from "billing-ui/components/Link";

import styles from "./Action.scss";
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
    href: PropTypes.string,
    target: PropTypes.string,
    iconType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    className: PropTypes.string,
    iconClassName: PropTypes.string
};

Action.defaultProps = {
    className: ""
};

export default Action;
