import PropTypes from "prop-types";
import { PureComponent } from "react";
import omit from "lodash/omit";
import classnames from "classnames";

import styles from "./Link.scss";

class Link extends PureComponent {
    render() {
        const { href, children, className, disabledClassName, disabled } = this.props;

        const fieldsToOmit = ["disabledClassName"];
        const tagProps = omit(this.props, fieldsToOmit);

        if (disabled) {
            const disabledClassNames = classnames(className, disabledClassName, styles.disabled);

            return (
                <span { ...tagProps } className={disabledClassNames}>{children}</span>
            );
        }

        const linkClassNames = classnames(className, styles.link);

        if (href) {
            if (tagProps.target === "_blank") {
                tagProps.rel = "noreferrer noopener";
            }

            return (
                <a { ...tagProps } className={linkClassNames}>{children}</a>
            );
        }

        return (
            <span { ...tagProps } className={linkClassNames}>{children}</span>
        );
    }
}

Link.propTypes = {
    href: PropTypes.string,
    children: PropTypes.node,

    className: PropTypes.string,
    disabledClassName: PropTypes.string,
    disabled: PropTypes.bool
};

export default Link;
