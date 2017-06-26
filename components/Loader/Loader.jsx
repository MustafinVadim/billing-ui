import { PureComponent } from "react";
import PropTypes from "prop-types";

import Spinner from "./Spinner";
import { SpinnerTypes } from "./SpinnerTypes";
import styles from "./Loader.scss";
import cx from "classnames";

class Loader extends PureComponent {
    _renderSpinner() {
        const { type, caption, spinnerContainerClassName } = this.props;

        return (
            <span className={cx(styles.spinnerContainerCenter, spinnerContainerClassName)}>
                <Spinner type={type} caption={caption} />
            </span>
        );
    }

    render() {
        const { active, className, children } = this.props;
        const loaderClassName = cx(styles.loader, className, {
            [styles.active]: active
        });

        return (
            <div className={loaderClassName}>
                {children}
                {active && this._renderSpinner()}
            </div>
        );
    }
}

Loader.propTypes = {
    active: PropTypes.bool.isRequired,
    caption: PropTypes.string,
    className: PropTypes.string,
    spinnerContainerClassName: PropTypes.string,
    type: PropTypes.oneOf(Object.keys(SpinnerTypes)),
    children: PropTypes.node
};

Loader.defaultProps = {
    type: SpinnerTypes.normal
};

export default Loader;
