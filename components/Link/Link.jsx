import { PureComponent, PropTypes } from "react";
import omit from "lodash/omit";
import classnames from "classnames";

import styles from "./Link.scss";

class Link extends PureComponent {
    render() {
        const { href, children, className, disabledClassName, disabled, ftId } = this.props;

        const fieldsToOmit = ["disabledClassName"];
        const tagProps = omit(this.props, fieldsToOmit);

        if (disabled) {
            const disabledClassNames = classnames(className, disabledClassName, styles.disabled);

            return (
                <span { ...tagProps } className={disabledClassNames} data-ft-id={ftId}>{children}</span>
            );
        }

        const linkClassNames = classnames(className, styles.link);

        if (href) {
            return (
                <a { ...tagProps } className={linkClassNames} data-ft-id={ftId}>{children}</a>
            );
        }

        return (
            <span { ...tagProps } className={linkClassNames} data-ft-id={ftId}>{children}</span>
        );
    }
}

Link.propTypes = {
    href: PropTypes.string,
    children: PropTypes.node,
    ftId: PropTypes.string,

    className: PropTypes.string,
    disabledClassName: PropTypes.string,
    disabled: PropTypes.bool
};

export default Link;
