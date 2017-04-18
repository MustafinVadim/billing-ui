import PropTypes from "prop-types";
import { Component } from "react";
import omit from "lodash/omit";
import cx from "classnames";

import TextInput from "../TextInput";
import TextInputType from "../TextInput/TextInputType";
import calculateHeight from "./calculateHeight";
import styles from "./TextArea.scss";

class TextArea extends Component {
    _textArea = null;

    state = {
        height: null
    };

    constructor(props) {
        super(props);
        const { minHeight } = props;

        this.state = {
            height: minHeight
        };

        this.handleChange = this.handleChange.bind(this);
    }

    focus() {
        this._textArea.focus();
    }

    getDomNode() {
        return this._textArea.getDomNode();
    }

    getValidationResult() {
        return this._textArea.getValidationResult();
    }

    handleChange(value, evt, data) {
        const { onChange } = this.props;

        const textArea = evt.target;

        this.changeHeight(textArea);

        if (onChange) {
            onChange(value, evt, data);
        }
    }

    componentDidMount() {
        this._changeTextAreaNodeHeight();
    }

    componentDidUpdate() {
        this._changeTextAreaNodeHeight();
    }

    _changeTextAreaNodeHeight() {
        const textAreaDom = this._textArea.getDomNode();
        this.changeHeight(textAreaDom);
    }

    changeHeight(textArea) {
        const { height } = this.state;
        const { minHeight } = this.props;

        let newHeight = calculateHeight(textArea);

        if (newHeight < minHeight) {
            newHeight = minHeight;
        }

        if (newHeight !== height) {
            this.setState({
                height: newHeight
            });
        }
    }

    render() {
        const fieldsToOmit = ["minHeight", "inputClassName"];

        const { height } = this.state;
        const textInputProps = omit(this.props, fieldsToOmit);

        return (
            <TextInput isTextArea={true}
                       inputClassName={cx(styles.textArea, this.props.inputClassName)}
                       height={height}
                       {...textInputProps}
                       onChange={this.handleChange}
                       ref={ el => { this._textArea = el }} />
        );
    }
}

TextArea.propTypes = {
    minHeight: PropTypes.number,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    clearable: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    isValid: PropTypes.bool,
    forceInvalid: PropTypes.bool,
    validate: PropTypes.oneOf([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    tooltipCaption: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.element]),
    tooltipProps: PropTypes.object,
    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    mask: PropTypes.string,
    maskChar: PropTypes.string,
    alwaysShowMask: PropTypes.bool,
    wrapperClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    placeholderClassName: PropTypes.string,
    styles: PropTypes.object,
    type: PropTypes.oneOf(Object.keys(TextInputType).map((key) => TextInputType[key]))
};

TextArea.defaultProps = {
    minHeight: 30
};

export default TextArea
