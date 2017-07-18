import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import omit from "lodash/omit";

import { TextInputType } from "../TextInput";
import calculateWidth from "./calculateInputWidth";
import Autocomplete from "../Autocomplete";
import Label from "./Label";
import Tooltip, { TriggerTypes, PositionTypes, TooltipTypes } from "../Tooltip";

import keyCodes from "../../helpers/KeyCodes";
import { validate } from "../../helpers/ValidationHelpers";

import styles from "./MultiSelect.scss";
import cx from "classnames";

class MultiSelect extends PureComponent {
    _inputDOMNode = null;
    _selectorDOMNode = null;
    _wrapperElement = null;

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedLabelIndex: -1,
            isFocused: false,
            inputWidth: props.minWidth
        };
    }

    _isInputValid = () => {
        const { inputValidation, inputValue } = this.props;
        if (!inputValue) {
            return false
        }
        const validationResult = inputValidation(inputValue);
        return validationResult.isValid;
    };

    _handleFocus = (evt) => {
        const { onFocus } = this.props;
        this.setState({
            isFocused: true
        });

        if (onFocus) {
            onFocus(evt);
        }
    };

    _handleBlur = (evt, data) => {
        const { onBlur, inputValue, labels, labelsValidation, inputValidation } = this.props;

        if (this._isInputValid()) {
            this._handleAddLabel({ inputValue });
        }

        this.setState({
            isFocused: false
        });

        let newData = data;

        if (!newData) {
            newData = {
                validationResult: validate(inputValue, inputValidation);
            }
        }

        newData.labelsValidationResult = validate(labels, labelsValidation);

        if (onBlur) {
            onBlur(evt, newData);
        }
    };

    _handleChange = (value, evt, data) => {
        const { onChange } = this.props;

        this._changeWidth();
        if (onChange) {
            onChange(value, evt, data);
        }
    };

    _handleMouseDown = evt => {
        this._inputDOMNode && this._inputDOMNode.focus();
        this.setState({
            selectedLabelIndex: -1
        });
        if (evt.target !== this._inputDOMNode) {
            this._inputDOMNode.selectionStart = this._inputDOMNode.value.length;
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
                    this._selectorDOMNode.focus();
                }
                break;
            default:
                if (onKeyDown) {
                    onKeyDown(evt);
                }
        }
    };

    _handleSelectorKey = evt => {
        const { onKeyDown } = this.props;
        const { selectedLabelIndex } = this.state;

        switch (evt.keyCode) {
            case keyCodes.left:
                this._selectNextLabel(-1);
                evt.preventDefault();
                break;
            case keyCodes.right:
                this._selectNextLabel(1);
                evt.preventDefault();
                break;
            case keyCodes.delete:
                this._handleRemoveLabel(selectedLabelIndex);
                break;
            default:
                if (onKeyDown) {
                    onKeyDown(evt);
                }
        }
    };

    _handleSelectorBlur = () => {
        this.setState({
            selectedLabelIndex: -1
        });
    };

    _handleSelectorFocus = () => {
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

        onAddLabel({ autocompleteResult, inputValue });
    };

    _setInputDOMNode = el => {
        if (el) {
            this._inputDOMNode = findDOMNode(el).getElementsByTagName("input")[0];
        }
    };

    _changeWidth = () => {
        const { inputWidth } = this.state;
        const { minWidth, maxWidth } = this.props;

        let newWidth = calculateWidth(this._inputDOMNode);

        if (newWidth < minWidth) {
            newWidth = minWidth;
        }
        if (newWidth > maxWidth) {
            newWidth = maxWidth;
        }

        if (newWidth !== inputWidth) {
            this.setState({
                inputWidth: newWidth
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
                id={index}
                key={index}
                active={selectedLabelIndex === index}
                tooltipContent={label.tooltipContent || null}
                tooltipClassName={labelTooltipClassName}
                onRemove={onRemoveLabel}>
                {label.labelContent}
            </Label>
        ))
    };

    render() {
        const { inputWidth, isFocused } = this.state;
        const { labels, wrapperClassName, isValid, inputValue, inputValidation, tooltipCaption, tooltipProps } = this.props;

        const autocompleteProps = omit(
            this.props,
            [
                "minWidth", "maxWidth", "labels", "tooltipClassName", "wrapperClassName", "onAddLabel", "onRemoveLabel", "labelsValidation",
                "inputValidation", "inputValue", "tooltipCaption", "tooltipProps", "labelTooltipClassName"
            ]
        );

        const isFilled = labels.length > 0 || !!inputValue;

        return (
            <div onClick={this._handleClick}
                 onMouseDown={this._handleMouseDown}
                 className={cx(
                     styles.wrapper,
                     wrapperClassName,
                     {
                         [styles["focus"]]: isFocused,
                         [styles["validation-error"]]: !isValid
                     })}
                 ref={(el) => {
                     this._wrapperElement = el
                 }}>
                <div className={styles.content}>
                    {this._renderLabels(labels)}
                    <input className={styles["hidden-selector"]}
                           ref={(elm) => {
                               this._selectorDOMNode = findDOMNode(elm);
                           }}
                           onKeyDown={this._handleSelectorKey}
                           onBlur={this._handleSelectorBlur}
                           onFocus={this._handleSelectorFocus} />
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
                        ref={this._setInputDOMNode}
                        onFocus={this._handleFocus}
                        onBlur={this._handleBlur}
                        onChange={this._handleChange}
                        onSelect={this._handleSelect}
                        onKeyDown={this._handleKey}
                        validateFunction={inputValidation}
                        type={TextInputType.compact}
                        value={inputValue}
                        isFilled={isFilled}
                    />

                    <Tooltip
                        {...tooltipProps}
                        getTarget={() => this}
                        trigger={TriggerTypes.manual}
                        isOpen={!isValid && isFocused && !!tooltipCaption}
                    >
                        {tooltipCaption}
                    </Tooltip>
                </div>
            </div>
        );
    }
}

MultiSelect.propTypes = {
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    labelTooltipClassName: PropTypes.string,
    onRemoveLabel: PropTypes.func,
    onAddLabel: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    wrapperClassName: PropTypes.string,
    isValid: PropTypes.bool,

    labels: PropTypes.arrayOf(
        PropTypes.shape({
            labelContent: PropTypes.string.isRequired,
            tooltipContent: PropTypes.node
        })
    ),
    labelsValidation: PropTypes.func,

    inputValue: PropTypes.string,
    inputValidation: PropTypes.func,
    tooltipProps: PropTypes.object,
    tooltipCaption: PropTypes.string
};

MultiSelect.defaultProps = {
    minWidth: 10,
    maxWidth: 440,
    tooltipProps: {
        positionType: PositionTypes.rightMiddle,
        type: TooltipTypes.validation
    }
};

export default MultiSelect;
