import { PureComponent, PropTypes } from "react";
import MaskedInput from "react-input-mask";

import Tooltip, { TriggerTypes, PositionTypes, TooltipTypes } from "../Tooltip";
import { validate } from "../../helpers/ValidationHelpers";
import classnames from "classnames";

class TextInput extends PureComponent {
    state = {
        wasTouched: false
    };

    componentWillReceiveProps(newProps) {
        if (!this.state.wasTouched) {
            this.setState({
                wasTouched: newProps.value !== this.props.value
            });
        }
    }

    _handleOnChange = (evt) => {
        if (typeof this.props.onChange === "function") {
            const value = evt.target.value;
            this.props.onChange(value, evt, {
                validationResult: validate(value, this.props.validateFunction)
            });
        }
    };

    _handleOnFocus = (evt) => {
        if (typeof this.props.onFocus === "function") {
            const value = evt.target.value;
            this.props.onFocus(evt, {
                validationResult: validate(value, this.props.validateFunction)
            });
        }
    };

    _handleOnBlur = (evt) => {
        const { onBlur, value } = this.props;

        if (typeof onBlur === "function") {
            onBlur(evt, {
                validationResult: validate(value, this.props.validateFunction)
            });
        }
    };

    render() {
        const {
            width,
            height,
            mask,
            maskChar,
            alwaysShowMask,
            styles,
            isValid,
            isTextArea,
            inputClassName,
            counterClassName,
            tooltipCaption,
            tooltipType,
            tooltipPosition,
            tooltipClassName,
            clearable,
            forceInvalid,
            maxCounter,
            ...others
        } = this.props;
        const { wasTouched } = this.state;

        const isInvalid = (!isValid && wasTouched) || forceInvalid;

        const hasCounter = !!maxCounter;
        const valueLength = others.value ? others.value.trim().length : 0;
        const counter = maxCounter - valueLength;

        const inputClassNames = classnames(styles.input, inputClassName, {
            [styles["input-validation-error"]]: isInvalid,
            [styles.readonly]: others.readonly,
            [styles.disabled]: others.disabled,
            [styles.clearable]: clearable
        });

        const counterClassNames = classnames(styles.counter, counterClassName, {
            [styles["invalid"]]: isInvalid && counter < 0
        });

        const inputProps = {
            ...others,
            ref: el => {
                this._input = el
            },
            title: others.value,
            style: {
                "width": width,
                "height": height
            },
            type: "text",
            className: inputClassNames,
            onChange: this._handleOnChange,
            onInput: this._handleOnChange, // todo: поправить после отказа от IE9 - оставить 2 разных евента
            onFocus: this._handleOnFocus,
            onBlur: this._handleOnBlur
        };
        delete inputProps.validateFunction;

        const hasTooltip = ((tooltipType !== TooltipTypes.validation || isInvalid)) && tooltipCaption != null;
        const ftId = inputProps["data-ft-id"];

        return (
            <div data-ft-id={ftId ? `${ftId}-wrapper` : null}>
                {isTextArea && (
                    <textarea {...inputProps} />
                )}

                {!isTextArea && mask && (
                    <MaskedInput {...inputProps} mask={mask}
                        maskChar={maskChar || "_"}
                        alwaysShowMask={alwaysShowMask} />
                )}

                {!isTextArea && !mask && (
                    <input {...inputProps} />
                )}

                {hasCounter && (
                    <span className={counterClassNames}>
                        {counter}
                    </span>
                )}

                {hasTooltip && (
                    <Tooltip
                        getTarget={() => this._input}
                        trigger={TriggerTypes.focus}
                        positionType={tooltipPosition}
                        type={tooltipType}
                        className={tooltipClassName}>
                        {tooltipCaption}
                    </Tooltip>
                )}
            </div>
        );
    }
}

TextInput.propTypes = {
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    value: PropTypes.string,
    clearable: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    isValid: PropTypes.bool,
    forceInvalid: PropTypes.bool,
    validateFunction: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    isTextArea: PropTypes.bool,
    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxCounter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    alwaysShowMask: PropTypes.bool,
    inputClassName: PropTypes.string,
    counterClassName: PropTypes.string,
    styles: PropTypes.object,
    tooltipCaption: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.element]),
    tooltipClassName: PropTypes.string,
    tooltipType: PropTypes.oneOf(Object.keys(TooltipTypes).map((key) => TooltipTypes[key])),
    tooltipPosition: PropTypes.oneOf(Object.keys(PositionTypes).map((key) => PositionTypes[key]))
};

TextInput.defaultProps = {
    tooltipType: TooltipTypes.validation,
    tooltipPosition: PositionTypes.rightMiddle,
    tooltipClassName: "",
    forceInvalid: false
};

export default TextInput;
