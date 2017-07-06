import PropTypes from "prop-types";
import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import DefaultTextInput from "./DefaultTextInput";
import CompactTextInput from "./CompactTextInput";
import CustomPropTypes from "../../helpers/CustomPropTypes";
import TextInputType from "./TextInputType";
import { TooltipTypes, PositionTypes } from "../Tooltip";
import Validation, { validate } from "../../helpers/ValidationHelpers";
class TextInputWrapper extends PureComponent {
    _inputDOMNode = null;

    _setInputDOMNode = (el) => {
        const { textInputRef } = this.props;

        if (el) {
            this._inputDOMNode = findDOMNode(el);
        }

        if (textInputRef) {
            textInputRef(el);
        }
    };

    getDomNode() {
        return this._inputDOMNode;
    }

    focus() {
        this._inputDOMNode.focus();
    }

    getValidationResult() {
        return validate(this.props.value, this.props.validateFunction);
    }

    render() {
        const { type, placeholderClassName, labelClassName, ...others } = this.props;

        return (
            type === TextInputType.compact
                ? <CompactTextInput {...others} labelClassName={labelClassName} textInputRef={this._setInputDOMNode} />
                : <DefaultTextInput {...others} placeholderClassName={placeholderClassName} textInputRef={this._setInputDOMNode} />
        );
    }
}

TextInputWrapper.propTypes = {
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    textInputRef: PropTypes.func,
    isTextArea: PropTypes.bool,
    clearable: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    isValid: PropTypes.bool,
    forceInvalid: PropTypes.bool,
    validateOnMount: PropTypes.bool,
    validateFunction: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    tooltipCaption: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.element]),
    // Tooltip.props
    tooltipProps: PropTypes.object,

    // deprecated! используй tooltipProps
    tooltipClassName: CustomPropTypes.deprecated(
        PropTypes.string,
        "Use `tooltipProps: { className }` props instead"
    ),
    tooltipType: CustomPropTypes.deprecated(
        PropTypes.oneOf(Object.keys(TooltipTypes).map((key) => TooltipTypes[key])),
        "Use `tooltipProps: { type }` props instead"
    ),
    tooltipPosition: CustomPropTypes.deprecated(
        PropTypes.oneOf(Object.keys(PositionTypes).map((key) => PositionTypes[key])),
        "Use `tooltipProps: { positionType }` props instead"
    ),

    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxCounter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    alwaysShowMask: PropTypes.bool,
    wrapperClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    counterClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    placeholderClassName: PropTypes.string,
    placeholderWrapperClassName: PropTypes.string,
    styles: PropTypes.object,
    type: PropTypes.oneOf(Object.keys(TextInputType).map((key) => TextInputType[key]))
    // Так же можно передать остальные стандартные атрибуты текстового инпута, но визуально они ни как не обрабатываются
};

TextInputWrapper.defaultProps = {
    wrapperClassName: "",
    inputClassName: "",
    labelClassName: "",
    placeholderClassName: "",
    width: 180,
    isValid: true,
    isTextArea: false,
    type: TextInputType.default,
    validateFunction: Validation.Anything
};

export default TextInputWrapper;
