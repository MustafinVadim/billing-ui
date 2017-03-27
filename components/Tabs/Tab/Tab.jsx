import { PureComponent, PropTypes } from "react";

import styles from "./Tab.scss";
import cx from "classnames";

class Tab extends PureComponent {
    render() {
        const { classNames, children, tab } = this.props;

        return (
            <div className={cx(styles.wrapper, classNames)} data-ft-id={`${tab}__tab-wrapper`}>
                {children}
            </div>
        );
    }
}

Tab.propTypes = {
    tab: PropTypes.string,
    classNames: PropTypes.string,
    children: PropTypes.node.isRequired
};

export default Tab;
