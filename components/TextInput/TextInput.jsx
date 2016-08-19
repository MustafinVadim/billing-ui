import { Component, PropTypes } from "react";
import MaskedInput from "react-input-mask";

import Tooltip, { TriggerTypes, PositionTypes, TooltipTypes } from "../Tooltip";
import classnames from "classnames";

class TextInput extends Component {
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

    _handleOnChange(evt) {
        const { onChange } = this.props;

        if (typeof onChange === "function") {
            onChange(evt);
        }
    }

    _handleOnFocus(evt) {
        const { onFocus } = this.props;

        if (typeof onFocus === "function") {
            onFocus(evt);
        }
    }

    _handleOnBlur(evt) {
        const { onBlur } = this.props;

        if (typeof onBlur === "function") {
            onBlur(evt);
        }
    }

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
            tooltipCaption,
            tooltipType,
            tooltipPosition,
            clearable,
            ...others
        } = this.props;
        const { wasTouched } = this.state;

        const isInvalid = !isValid && wasTouched;
        const inputClassNames = classnames(styles.input, inputClassName, {
            [styles["input-validation-error"]]: isInvalid,
            [styles.readonly]: others.readonly,
            [styles.disabled]: others.disabled,
            [styles.clearable]: clearable
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
            onChange: (evt) => this._handleOnChange(evt),
            onFocus: (evt) => this._handleOnFocus(evt),
            onBlur: (evt) => this._handleOnBlur(evt)
        };

        const hasTooltip = ((tooltipType !== TooltipTypes.validation || isInvalid)) && tooltipCaption != null;

        return (
            <div>
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

                {hasTooltip && (
                    <Tooltip getTarget={() => this._input} trigger={TriggerTypes.focus} positionType={tooltipPosition} type={tooltipType}>
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
    isTextArea: PropTypes.bool,
    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    alwaysShowMask: PropTypes.bool,
    inputClassName: PropTypes.string,
    styles: PropTypes.object,
    tooltipCaption: PropTypes.string,
    tooltipType: PropTypes.oneOf(Object.keys(TooltipTypes).map((key) => TooltipTypes[key])),
    tooltipPosition: PropTypes.oneOf(Object.keys(PositionTypes).map((key) => PositionTypes[key]))
};

TextInput.defaultProps = {
    tooltipType: TooltipTypes.validation,
    tooltipPosition: PositionTypes.rightMiddle
};

export default TextInput;
