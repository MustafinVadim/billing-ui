import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactDOM from "react-dom";
import DefaultTextInput from "./DefaultTextInput";
import CompactTextInput from "./CompactTextInput";
import CustomPropTypes from "../../helpers/CustomPropTypes";
import TextInputType from "./TextInputType";
import { TooltipTypes, PositionTypes } from "../Tooltip";
import { IconTypes } from "../Icon";
import Validation, { validate } from "../../helpers/ValidationHelpers";

class TextInputWrapper extends PureComponent {

    _inputDom = null;

    _setDomNode = (el) => {
        if (el) {
            const tagName = this.props.isTextArea ? "textarea" : "input";
            this._inputDom = ReactDOM.findDOMNode(el).getElementsByTagName(tagName)[0];
        }
    };

    getDomNode() {
        return this._inputDom;
    }

    focus() {
        this._inputDom.focus();
    }

    getValidationResult() {
        return validate(this.props.value, this.props.validateFunction);
    }

    render() {
        const { type, placeholderClassName, labelClassName, ...others } = this.props;

        return (
            type === TextInputType.compact
                ? <CompactTextInput {...others} labelClassName={labelClassName} ref={this._setDomNode} />
                : <DefaultTextInput {...others} placeholderClassName={placeholderClassName} ref={this._setDomNode} />
        );
    }
}

TextInputWrapper.propTypes = {
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
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

    iconType: PropTypes.oneOf(Object.values(IconTypes)),
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
