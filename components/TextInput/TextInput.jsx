import PropTypes from "prop-types";
import { PureComponent } from "react";
import MaskedInput from "react-input-mask";
import Tooltip, { PositionTypes, TooltipTypes, TriggerTypes } from "../Tooltip";
import { validate } from "../../helpers/ValidationHelpers";
import InputTypes from "./InputTypes";
import { IconTypes } from "../Icon";
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
            validateOnMount,
            isTextArea,
            inputClassName,
            counterClassName,
            tooltipCaption,
            tooltipType,
            tooltipPosition,
            tooltipClassName,
            tooltipProps,
            clearable,
            forceInvalid,
            maxCounter,
            inputType,
            iconType,
            ...others
        } = this.props;

        const value = others.value || "";
        const { wasTouched } = this.state;

        // для обратной совместимости (используй tooltipProps)
        const tooltipProperties = {
            positionType: tooltipPosition,
            type: tooltipType,
            className: tooltipClassName,
            ...tooltipProps
        };

        const isInvalid = validateOnMount ? !isValid || forceInvalid : (!isValid && wasTouched) || forceInvalid;

        const hasCounter = !!maxCounter;
        const valueLength = value.trim().length;
        const counter = maxCounter - valueLength;
        const showWarning = tooltipType === TooltipTypes.warning && tooltipCaption;

        const inputClassNames = classnames(styles.input, inputClassName, {
            [styles["with-icon"]]: !!iconType,
            [styles["input-validation-error"]]: isInvalid,
            [styles["input-warning"]]: showWarning,
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
            value,
            title: inputType === InputTypes.password ? null : value,
            style: {
                ...others.style,
                "width": width,
                "height": height
            },
            type: inputType,
            ["data-ft-id"]: "text-input",
            className: inputClassNames,
            onChange: this._handleOnChange,
            onInput: this._handleOnChange, // todo: для вставки текста из контекстного меню в IE
            onFocus: this._handleOnFocus,
            onBlur: this._handleOnBlur
        };
        delete inputProps.validateFunction;

        const hasTooltip
            = ((tooltipType !== TooltipTypes.validation && tooltipType !== TooltipTypes.warning)
                || isInvalid
                || showWarning
            )
            && !!tooltipCaption;
        const ftId = others["data-ft-id"];

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
                        {...tooltipProperties}
                    >
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
    iconType: PropTypes.oneOf(Object.values(IconTypes)),
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    isValid: PropTypes.bool,
    forceInvalid: PropTypes.bool,
    validateOnMount: PropTypes.bool,
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
    // Tooltip.props
    tooltipCaption: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.element]),
    tooltipProps: PropTypes.object,
    tooltipType: PropTypes.oneOf(Object.keys(TooltipTypes).map((key) => TooltipTypes[key])),
    tooltipPosition: PropTypes.oneOf(Object.keys(PositionTypes).map((key) => PositionTypes[key])),
    tooltipClassName: PropTypes.string,
    inputType: PropTypes.oneOf(Object.keys(InputTypes).map((key) => InputTypes[key]))
};

TextInput.defaultProps = {
    tooltipType: TooltipTypes.validation,
    tooltipPosition: PositionTypes.rightMiddle,
    tooltipClassName: "",
    forceInvalid: false,
    validateOnMount: false,
    tooltipProps: {},
    inputType: InputTypes.text
};

export default TextInput;
