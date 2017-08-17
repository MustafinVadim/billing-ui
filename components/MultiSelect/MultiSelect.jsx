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

const LABEL_CLASSNAME = "js-multiselect-label";

class MultiSelect extends PureComponent {
    _inputDOMNode = null;
    _labelControllerDOMNode = null;
    _inputValidationResult = null;
    _autocompleteElement = null;
    _selectedLabelElement = null;
    _editedLabelElement = null;

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedLabelIndex: -1,
            editedLabelIndex: -1,
            isFocused: false,
            inputWidth: props.minInputWidth,
            wasTouched: false
        };
    }

    componentWillReceiveProps(newProps) {
        if (!this.state.wasTouched) {
            this.setState({
                wasTouched: newProps.inputValue !== this.props.inputValue || newProps.labels !== this.props.labels
            });
        }
    }

    _isInputValid = () => {
        const { inputValue } = this.props;
        if (!inputValue || !(inputValue || "").trim()) {
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
            this._handleLabelAdd({ inputValue });
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
    };

    _handleSelect = (Value, Text, Data, optionData) => {
        const { inputValue } = this.props;
        this._handleLabelAdd({ autocompleteResult: optionData, inputValue });
        this._autocompleteElement.showNewOptions();
        this._inputDOMNode && this._inputDOMNode.focus();
    };

    _handleKey = evt => {
        const { onKeyDown, labels, inputValue } = this.props;

        const isCaretAtEnd = this._inputDOMNode.selectionStart === this._inputDOMNode.value.length;
        const isCaretAtStart = this._inputDOMNode.selectionStart === 0;

        switch (evt.keyCode) {
            case keyCodes.comma:
            case keyCodes.semiColon:
            case keyCodes.space:
            case keyCodes.enter:
                if (isCaretAtEnd && this._isInputValid()) {
                    this._handleLabelAdd({ inputValue });
                    this._autocompleteElement.showNewOptions();
                    evt.preventDefault();
                }
                break;

            case keyCodes.backspace:
                if (isCaretAtStart) {
                    this._handleLabelRemove(labels.length - 1);
                }
                break;

            case keyCodes.left:
                if (isCaretAtStart) {
                    const lastLabelIndex = this.props.labels.length - 1;
                    this._selectLabel(lastLabelIndex);

                    evt.preventDefault();
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
            case keyCodes.enter:
                this._selectedLabelElement.enterEditMode();
                break;

            case keyCodes.left:
                this._selectLabel(selectedLabelIndex - 1);
                evt.preventDefault();
                break;

            case keyCodes.right:
                this._selectLabel(selectedLabelIndex + 1);
                evt.preventDefault();
                break;

            case keyCodes.delete:
            case keyCodes.backspace:
                this._handleLabelRemove(selectedLabelIndex);
                break;
        }

        if (onKeyDown) {
            onKeyDown(evt);
        }
    };

    _handleLabelControllerBlur = () => {
        this.setState({
            selectedLabelIndex: -1
        });
    };

    _handleLabelRemove = (labelIndex) => {
        const { onRemoveLabel } = this.props;
        onRemoveLabel(labelIndex);
    };

    _handleLabelAdd = ({ autocompleteResult, inputValue }) => {
        const { onAddLabel, onChange } = this.props;

        this._inputDOMNode.value = "";
        this._changeInputWidth();
        onChange && onChange("");

        onAddLabel({ autocompleteResult, inputValue: (inputValue || "").trim() });
    };

    _handleLabelChange = (index, value, evt) => {
        const { onChangeLabel, inputValidation } = this.props;

        const validationResult = validate(value, inputValidation);

        if (onChangeLabel) {
            onChangeLabel(index, value, evt, {
                validationResult
            });
        }
    };

    _handleLabelFocus = index => {
        this.setState({
            editedLabelIndex: index
        });
    };

    _handleLabelBlur = (index, evt) => {
        const { onBlur, labels, labelsValidation } = this.props;

        this.setState({
            editedLabelIndex: -1
        });

        const labelsValidationResult = validate(labels, labelsValidation);
        this._setInputValidationResult();

        if (onBlur) {
            onBlur(evt, {
                validationResult: this._inputValidationResult,
                labelsValidationResult
            });
        }
    };

    _handleLabelMouseDown = (index, evt) => {
        this._labelControllerDOMNode.focus();
        this._selectLabel(index);
        evt.preventDefault();
    };

    _handleLabelKey = (index, evt) => {
        const { onKeyDown } = this.props;

        switch (evt.keyCode) {
            case keyCodes.enter:
                this._editedLabelElement.exitEditMode();
                this._inputDOMNode.focus();
                break;

            case keyCodes.left:
                if (this._editedLabelElement.isCaretAtStart()) {
                    this._selectLabel(index - 1);
                    evt.preventDefault();
                }
                break;

            case keyCodes.right:
                if (this._editedLabelElement.isCaretAtEnd()) {
                    this._selectLabel(index + 1);
                    evt.preventDefault();
                }
                break;

            case keyCodes.comma:
            case keyCodes.semiColon:
            case keyCodes.space:
                if (this._editedLabelElement.isCaretAtEnd()) {
                    this._editedLabelElement.exitEditMode();
                    this._inputDOMNode.focus();
                    evt.preventDefault();
                }
                break;
        }

        if (onKeyDown) {
            onKeyDown(evt);
        }
    };

    _handleLabelExitEditMode = (index, value) => {
        const { onChangeLabelComplete } = this.props;

        onChangeLabelComplete && onChangeLabelComplete(index, value);
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

    _setSelectedLabelElement = el => {
        this._selectedLabelElement = el;
    };

    _setEditedLabelElement = el => {
        this._editedLabelElement = el;
    };

    _setLabelElement = index => el => {
        const { selectedLabelIndex, editedLabelIndex } = this.state;
        if (index === selectedLabelIndex) {
            this._setSelectedLabelElement(el);
        }

        if (index === editedLabelIndex) {
            this._setEditedLabelElement(el);
        }
    };

    _getMultiSelect = () => this;

    _changeInputWidth = () => {
        const { inputWidth } = this.state;

        let newInputWidth = calculateContentWidth(this._inputDOMNode);

        if (newInputWidth !== inputWidth) {
            this.setState({
                inputWidth: newInputWidth
            });
        }
    };

    _selectLabel = index => {
        const minIndex = 0;
        const maxIndex = this.props.labels.length - 1;

        if (index > maxIndex || index < minIndex) {
            this._inputDOMNode.focus();
            this._inputDOMNode.selectionStart = this._inputDOMNode.value.length;
        } else {
            this._labelControllerDOMNode.focus();
            this.setState({
                selectedLabelIndex: index
            });
        }
    };

    _renderLabels = labels => {
        const { labelTooltipClassName } = this.props;
        const { selectedLabelIndex } = this.state;
        return labels.map((label, index) => (
            <Label
                index={index}
                className={LABEL_CLASSNAME}
                key={`multiselect-label-${index}`}
                isActive={selectedLabelIndex === index}
                validationResult={label.validationResult}
                tooltipContent={label.tooltipContent}
                tooltipClassName={labelTooltipClassName}
                onRemove={this._handleLabelRemove}
                onChange={this._handleLabelChange}
                onMouseDown={this._handleLabelMouseDown}
                onFocus={this._handleLabelFocus}
                onBlur={this._handleLabelBlur}
                onKeyDown={this._handleLabelKey}
                onEnterEditMode={this._handleLabelEnterEditMode}
                onExitEditMode={this._handleLabelExitEditMode}
                ref={this._setLabelElement(index)}
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
                "labels", "tooltipClassName", "wrapperClassName", "onAddLabel", "onRemoveLabel", "onChangeLabel", "labelsValidation",
                "inputValidation", "inputValue", "tooltipCaption", "tooltipProps", "labelTooltipClassName", "autocompleteURL", "onChangeLabelComplete"
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
    onChangeLabel: PropTypes.func,
    onChangeLabelComplete: PropTypes.func,
    isValid: PropTypes.bool,

    labels: PropTypes.arrayOf(
        PropTypes.shape({
            labelContent: PropTypes.string.isRequired,
            tooltipContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element])
        })
    ).isRequired,
    labelsValidation: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.arrayOf(PropTypes.func)]),

    inputValue: PropTypes.string,
    inputValidation: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.arrayOf(PropTypes.func)]),

    tooltipProps: PropTypes.object,
    tooltipCaption: PropTypes.string
};

MultiSelect.defaultProps = {
    tooltipProps: {
        positionType: PositionTypes.rightMiddle,
        type: TooltipTypes.validation
    }
};

export default MultiSelect;
