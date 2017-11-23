import PropTypes from "prop-types";
import { PureComponent } from "react";

import StepType from "../utils/StepType";

import styles from "./Step.scss";
import cx from "classnames";

class Step extends PureComponent {
    state = {
        isHidden: false
    };
    _timer = null;

    componentDidUpdate() {
        if (this.props.type === StepType.next || this.props.type === StepType.previous) {
            this._timer = setTimeout(() => {
                this.setState({ isHidden: true });
            }, 300)
        }
    }

    componentWillUnmount() {
        clearTimeout(this._timer);
    }

    render() {
        const { type, children, classNames, width, name } = this.props;
        const stepClassNames = cx(styles.wrapper, styles[type.toLowerCase()], classNames, {
            [styles.hidden]: this.state.isHidden
        });

        return (
            <div className={stepClassNames} style={{width: width}} data-ft-id={`${name.toLowerCase()}__step-wrapper`}>
                {children}
            </div>
        );
    }
}

Step.propTypes = {
    type: PropTypes.oneOf(Object.keys(StepType)),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    classNames: PropTypes.string,
    children: PropTypes.node.isRequired
};

export default Step;
