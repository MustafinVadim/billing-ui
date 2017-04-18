import PropTypes from "prop-types";
import { PureComponent, Children, cloneElement } from "react";

import StepType from "./utils/StepType";
import Step from "./Step";
import CustomPropTypes from "billing-ui/helpers/CustomPropTypes";

import styles from "./StepMaster.scss";
import cx from "classnames";

class StepMaster extends PureComponent {
    state = {
        previousActiveStepIndex: 0
    };

    _handleSubmit = () => {
        const { onSubmitClick, submitDisabled } = this.props;

        if (!submitDisabled && onSubmitClick) {
            onSubmitClick();
        }
    };

    _handlePreviousStepClick = () => {
        const { onChangeStep, currentStepIndex } = this.props;
        const availablePreviousStep = currentStepIndex !== 0;

        if (availablePreviousStep && onChangeStep) {
            this.setState({ previousActiveStepIndex: currentStepIndex });
            onChangeStep({ currentStepIndex: currentStepIndex - 1 });
        }
    };

    _handleNextStepClick = () => {
        const { onChangeStep, isValidCurrentStep, currentStepIndex, steps } = this.props;
        const availableNextStep = currentStepIndex !== steps.length - 1 && isValidCurrentStep;

        if (availableNextStep && onChangeStep) {
            this.setState({ previousActiveStepIndex: currentStepIndex });
            onChangeStep({ currentStepIndex: currentStepIndex + 1 });
        }
    };

    _renderSteps() {
        const { currentStepIndex, children, width } = this.props;
        const { previousActiveStepIndex } = this.state;

        return Children.map(children, (step, index) => {
            if (index !== currentStepIndex && index !== previousActiveStepIndex) {
                return;
            }

            return cloneElement(step || {}, {
                key: `${step.props.name}-${index}`,
                width,
                classNames: cx(null, {
                    "right": currentStepIndex === index && currentStepIndex < previousActiveStepIndex,
                    "left": currentStepIndex === index && currentStepIndex > previousActiveStepIndex
                }),
                type: currentStepIndex === index
                    ? StepType.current
                    : index === currentStepIndex + 1
                    ? StepType.next
                    : StepType.previous
            })
        });
    }

    render() {
        const { steps, currentStepIndex, submitText, isValidCurrentStep, submitDisabled, classNames } = this.props;

        const availableNextStep = currentStepIndex !== steps.length - 1 && isValidCurrentStep;
        return (
            <div className={cx(styles.wrapper, classNames)} data-ft-id="step-master">
                <div className={styles.header}>
                    {(steps || []).map((step, i) => (
                        <span key={step} className={cx(styles["header-step"], {[styles["active-step"]]: i === currentStepIndex})}>
                            {`${i + 1}. ${step}${i !== steps.length - 1 ? "→" : ""}`}
                        </span>
                    ))}
                </div>
                <div className={styles.content}>
                    {this._renderSteps()}
                </div>
                <div className={styles.actions}>
                    <div className={cx(styles["previous-button"], {[styles["action-button-disabled"]]: currentStepIndex === 0 })}
                        data-ft-id="previous-button"
                        onClick={this._handlePreviousStepClick}>
                        Назад
                    </div>
                    <div className={cx(styles["submit-button"], {[styles["action-button-disabled"]]: submitDisabled })}
                        data-ft-id="submit-button"
                        onClick={this._handleSubmit}>
                        {submitText}
                    </div>
                    <div className={cx(styles["next-button"], {[styles["action-button-disabled"]]: !availableNextStep })}
                        data-ft-id="next-button"
                        onClick={this._handleNextStepClick}>
                        Далее
                    </div>
                </div>
            </div>
        );
    }
}

StepMaster.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    submitText: PropTypes.string,
    submitDisabled: PropTypes.bool,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentStepIndex: PropTypes.number,
    isValidCurrentStep: PropTypes.bool,
    classNames: PropTypes.string,
    children: CustomPropTypes.children(Step),
    onSubmitClick: PropTypes.func,
    onChangeStep: PropTypes.func
};

StepMaster.defaultProps = {
    submitText: "Сохранить",
    submitDisabled: true,
    currentStepIndex: 0,
    isValidCurrentStep: true
};

export default StepMaster;
