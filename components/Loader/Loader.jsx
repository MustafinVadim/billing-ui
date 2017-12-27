import { PureComponent } from "react";
import PropTypes from "prop-types";

import Spinner from "./Spinner";
import { SpinnerTypes } from "./SpinnerTypes";
import styles from "./Loader.scss";
import cx from "classnames";

class Loader extends PureComponent {
    state = {
        loader: null,
        spinnerTopPosition: null
    }

    componentWillReceiveProps() {
        if (this.state.loader) {
            this._setSpinnerPosition(this.state.loader.getBoundingClientRect())
        }
    }

    _setSpinnerPosition = (loaderBackgroundPosition) => {
        const windowHeight = window.innerHeight;
        if (loaderBackgroundPosition.bottom > windowHeight) {
            const spinnerTopPosition = (windowHeight - loaderBackgroundPosition.top) / 2;
            this.setState({
                spinnerTopPosition
            });
        } else {
            this.setState({
                spinnerTopPosition: null
            });
        }
    }

    _renderSpinner() {
        const { type, caption, spinnerContainerClassName, isSmooth } = this.props;
        const { spinnerTopPosition } = this.state;
        const topPosition = spinnerTopPosition && {
            top: `${spinnerTopPosition}px`
        };
        return (
            <span className={cx(styles.spinnerContainerCenter, spinnerContainerClassName, {
                [styles.smooth]: isSmooth
            })}>
                <Spinner
                    spinnerClassName={cx({ [styles["absolute-spinner"]]: !!spinnerTopPosition })}
                    style={topPosition}
                    type={type}
                    caption={caption} />
            </span>
        );
    }

    _saveLoaderRef = (elem) => {
        if (elem) {
            this.setState({
                loader: elem
            })
        }
    }

    render() {
        const { active, className, children } = this.props;
        const loaderClassName = cx(styles.loader, className, {
            [styles.active]: active
        });

        return (
            <div ref={this._saveLoaderRef} className={loaderClassName}>
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
    isSmooth: PropTypes.bool,
    children: PropTypes.node
};

Loader.defaultProps = {
    type: SpinnerTypes.normal,
    isSmooth: false
};

export default Loader;
