import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import omit from "lodash/omit";

import { TextInputType } from "../TextInput";
import { calculateContentWidth } from "../../helpers/NodeHelper";
import Autocomplete from "../Autocomplete";
import Label from "./Label";
import Tooltip, { TriggerTypes, PositionTypes, TooltipTypes } from "../Tooltip";

import keyCodes from "../../helpers/KeyCodes";
import { validate } from "../../helpers/ValidationHelpers";

import styles from "./MultiSelect.scss";
import cx from "classnames";

const labelControllerDirection = {
    next: 1,
    previous: -1
};

const LABEL_CLASSNAME = "js-multiselect-label";

class MultiSelect extends PureComponent {
    _inputDOMNode = null;
    _labelControllerDOMNode = null;
    _inputValidationResult = null;
    _autocompleteElement = null;

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedLabelIndex: -1,
            isFocused: false,
            inputWidth: props.minInputWidth,
            wasTouched: false
        };
    }

    componentWillReceiveProps(newProps) {
        if (!this.state.wasTouched) {
            this.setState({
                wasTouched: newProps.inputValue !== this.props.inputValue
            });
        }
    }

    _isInputValid = () => {
        const { inputValue } = this.props;
        if (!inputValue) {
            return false;
        }
        return this._inputValidationResult.isValid;
    };

    _handleFocus = (evt, data) => {
        const { onFocus } = this.props;

        this._setInputValidationResult(data.validationResult);

        this.setState({
            isFocused: true
        });

        if (onFocus) {
            onFocus(evt);
        }
    };

    _handleBlur = (evt, data) => {
        const { onBlur, inputValue, labels, labelsValidation } = this.props;

        const labelsValidationResult = validate(labels, labelsValidation);

        if (this._isInputValid()) {
            this._handleAddLabel({ inputValue });
            labelsValidationResult.isValid = true;
        }

        this.setState({
            isFocused: false
        });

        this._setInputValidationResult(data.validationResult);

        if (onBlur) {
            onBlur(evt, {
                ...data,
                validationResult: this._inputValidationResult,
                labelsValidationResult
            });
        }
    };

    _handleChange = (value, evt, data) => {
        const { onChange } = this.props;

        this._changeInputWidth();

        this._setInputValidationResult(data.validationResult);

        if (onChange) {
            onChange(value, evt, data);
        }
    };

    _handleMouseDown = evt => {
        const onInput = evt.target === this._inputDOMNode;
        const onLabel = evt.target.className.indexOf(LABEL_CLASSNAME) >= 0;
        if (!onInput && !onLabel) {
            this._inputDOMNode && this._inputDOMNode.focus();
            this.setState({
                selectedLabelIndex: -1
            });

            this._inputDOMNode.selectionStart = this._inputDOMNode.value.length;
            evt.preventDefault();
        }

        if (onLabel) {
            evt.preventDefault();
        }
    };

    _handleSelect = (Value, Text, Data, optionData) => {
        const { inputValue } = this.props;
        this._handleAddLabel({ autocompleteResult: optionData, inputValue });
        this._inputDOMNode && this._inputDOMNode.focus();
    };

    _handleKey = evt => {
        const { onKeyDown, labels, inputValue } = this.props;
        switch (evt.keyCode) {
            case keyCodes.comma:
            case keyCodes.semiColon:
            case keyCodes.space:
            case keyCodes.enter:
                const isCaretAtEnd = this._inputDOMNode.selectionStart === this._inputDOMNode.value.length;
                if (isCaretAtEnd && this._isInputValid()) {
                    this._handleAddLabel({ inputValue });
                    evt.preventDefault();
                }
                break;
            case keyCodes.backspace:
                if (!inputValue) {
                    this._handleRemoveLabel(labels.length - 1);
                }
                break;
            case keyCodes.left:
                const isCaretAtStart = this._inputDOMNode.selectionStart === 0;
                if (isCaretAtStart) {
                    this._labelControllerDOMNode.focus();
                }
                break;
        }
        if (onKeyDown) {
            onKeyDown(evt);
        }
    };

    _handleLabelControllerKey = evt => {
        const { onKeyDown } = this.props;
        const { selectedLabelIndex } = this.state;

        switch (evt.keyCode) {
            case keyCodes.left:
                this._selectNextLabel(labelControllerDirection.previous);
                evt.preventDefault();
                break;
            case keyCodes.right:
                this._selectNextLabel(labelControllerDirection.next);
                evt.preventDefault();
                break;
            case keyCodes.delete:
            case keyCodes.backspace:
                this._handleRemoveLabel(selectedLabelIndex);
                break;
            default:
                if (onKeyDown) {
                    onKeyDown(evt);
                }
        }
    };

    _handleLabelControllerBlur = () => {
        this.setState({
            selectedLabelIndex: -1
        });
    };

    _handleLabelControllerFocus = () => {
        const lastLabelIndex = this.props.labels.length - 1;
        this.setState({
            selectedLabelIndex: lastLabelIndex
        });
    };

    _handleRemoveLabel = (labelIndex) => {
        const { onRemoveLabel } = this.props;
        onRemoveLabel(labelIndex);
    };

    _handleAddLabel = ({ autocompleteResult, inputValue }) => {
        const { onAddLabel, onChange } = this.props;

        onChange && onChange("");
        this._autocompleteElement.showNewOptions();

        onAddLabel({ autocompleteResult, inputValue });
    };

    _handleLabelClick = index => {
        this._labelControllerDOMNode.focus();
        this.setState({
            selectedLabelIndex: index
        });
    };

    _setInputValidationResult = validationResult => {
        const { inputValidation, inputValue } = this.props;
        this._inputValidationResult = validationResult
            ? validationResult
            : validate(inputValue, inputValidation)
    };

    _setInputDOMNode = el => {
        if (el) {
            this._inputDOMNode = findDOMNode(el).getElementsByTagName("input")[0];
        }
    };

    _setLabelControllerDOMNode = el => {
        this._labelControllerDOMNode = findDOMNode(el);
    };

    _setAutocompleteElement = el => {
        if (!el || !el.getInstance) {
            return;
        }
        this._autocompleteElement = el.getInstance();
        this._setInputDOMNode(el);
    };

    _getMultiSelect = () => this;

    _changeInputWidth = () => {
        const { inputWidth } = this.state;
        const { minInputWidth, maxInputWidth } = this.props;

        let newInputWidth = calculateContentWidth(this._inputDOMNode);

        if (newInputWidth < minInputWidth) {
            newInputWidth = minInputWidth;
        }

        if (newInputWidth > maxInputWidth) {
            newInputWidth = maxInputWidth;
        }

        if (newInputWidth !== inputWidth) {
            this.setState({
                inputWidth: newInputWidth
            });
        }
    };

    _selectNextLabel = step => {
        const { selectedLabelIndex } = this.state;
        const minIndex = 0;
        const maxIndex = this.props.labels.length - 1;
        const newIndex = selectedLabelIndex + step;

        if (newIndex > maxIndex || newIndex < minIndex) {
            this._inputDOMNode.focus();
            this._inputDOMNode.selectionStart = this._inputDOMNode.value.length;
        } else {
            this.setState({
                selectedLabelIndex: newIndex
            });
        }
    };

    _renderLabels = labels => {
        const { labelTooltipClassName, onRemoveLabel } = this.props;
        const { selectedLabelIndex } = this.state;
        return labels.map((label, index) => (
            <Label
                index={index}
                className={LABEL_CLASSNAME}
                key={`multiselect-label-${index}`}
                isActive={selectedLabelIndex === index}
                tooltipContent={label.tooltipContent}
                tooltipClassName={labelTooltipClassName}
                onRemove={onRemoveLabel}
                onClick={this._handleLabelClick}
            >
                {label.labelContent}
            </Label>
        ))
    };

    render() {
        const { inputWidth, isFocused, wasTouched } = this.state;
        const { labels, wrapperClassName, isValid, inputValue, inputValidation, tooltipCaption, tooltipProps, autocompleteURL } = this.props;

        const autocompleteProps = omit(
            this.props,
            [
                "minInputWidth", "maxInputWidth", "labels", "tooltipClassName", "wrapperClassName", "onAddLabel", "onRemoveLabel", "labelsValidation",
                "inputValidation", "inputValue", "tooltipCaption", "tooltipProps", "labelTooltipClassName", "autocompleteURL"
            ]
        );

        const isFilled = labels.length > 0 || !!inputValue;
        const showInvalid = !isValid && wasTouched;

        return (
            <div onMouseDown={this._handleMouseDown}
                 className={cx(
                     styles.wrapper,
                     wrapperClassName,
                     {
                         [styles["focus"]]: isFocused,
                         [styles["validation-error"]]: showInvalid
                     })}
            >
                <div className={styles.content}>
                    {this._renderLabels(labels)}
                    <input className={styles["label-controller"]}
                           ref={this._setLabelControllerDOMNode}
                           tabIndex="-1"
                           onFocus={this._handleLabelControllerFocus}
                           onKeyDown={this._handleLabelControllerKey}
                           onBlur={this._handleLabelControllerBlur}
                    />
                    <Autocomplete
                        {...autocompleteProps}
                        autocompleteWrapperClassName={styles["autocomplete-wrapper"]}
                        wrapperClassName={styles["input-wrapper"]}
                        inputClassName={styles.input}
                        inputHighlightClassName={styles["input-highlight"]}
                        optionItemClassName={styles["autocomplete-option"]}
                        optionActiveItemClassName={styles["autocomplete-active-option"]}
                        outsideClickIgnoreClass={styles.wrapper}
                        width={inputWidth}
                        ref={this._setAutocompleteElement}
                        onFocus={this._handleFocus}
                        onBlur={this._handleBlur}
                        onChange={this._handleChange}
                        onSelect={this._handleSelect}
                        onKeyDown={this._handleKey}
                        validateFunction={inputValidation}
                        type={TextInputType.compact}
                        url={autocompleteURL}
                        value={inputValue}
                        isFilled={isFilled}
                    />

                    <Tooltip
                        {...tooltipProps}
                        getTarget={this._getMultiSelect}
                        trigger={TriggerTypes.manual}
                        isOpen={showInvalid && isFocused && !!tooltipCaption}
                    >
                        {tooltipCaption}
                    </Tooltip>
                </div>
            </div>
        );
    }
}

MultiSelect.propTypes = {
    minInputWidth: PropTypes.number,
    maxInputWidth: PropTypes.number,
    autocompleteURL: PropTypes.string,
    labelTooltipClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    onRemoveLabel: PropTypes.func,
    onAddLabel: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    isValid: PropTypes.bool,

    labels: PropTypes.arrayOf(
        PropTypes.shape({
            labelContent: PropTypes.string.isRequired,
            tooltipContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element])
        })
    ).isRequired,
    labelsValidation: PropTypes.func.isRequired,

    inputValue: PropTypes.string,
    inputValidation: PropTypes.func.isRequired,

    tooltipProps: PropTypes.object,
    tooltipCaption: PropTypes.string
};

MultiSelect.defaultProps = {
    minInputWidth: 10,
    maxInputWidth: 440,
    tooltipProps: {
        positionType: PositionTypes.rightMiddle,
        type: TooltipTypes.validation
    }
};

export default MultiSelect;
