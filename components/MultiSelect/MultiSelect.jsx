import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import omit from "lodash/omit";

import { TextInputType } from "../TextInput";
import calculateWidth from "./calculateInputWidth";
import Autocomplete from "../Autocomplete";
import Label from "./Label";
import keyCodes from "../../helpers/KeyCodes";

import styles from "./MultiSelect.scss";
import cx from "classnames";

class MultiSelect extends PureComponent {
    _inputDOMNode = null;

    constructor(props, context) {
        super(props, context);

        this.state = {
            isFocused: false,
            inputValue: "",
            inputWidth: props.minWidth
        };
    }

    _handleMouseDown = evt => {
        this._inputDOMNode && this._inputDOMNode.focus();
        if (evt.target !== this._inputDOMNode) {
            evt.preventDefault();
        }
    };

    _handleChange = value => {
        this.setState({
            inputValue: value
        });

        this._changeWidth();
    };

    _handleSelect = (Value, Text, Data, optionData) => {
        this._addLabel(optionData);
    };

    _handleKey = evt => {
        const { onKeyDown, onRemoveLabel, labels } = this.props;
        const { inputValue } = this.state;
        switch (evt.keyCode) {
            case keyCodes.space:
                this._addLabel(null, inputValue);
                evt.preventDefault();
                break;
            case keyCodes.backspace:
                if (!inputValue) {
                    const lastLabelKey = labels[labels.length - 1].id;
                    onRemoveLabel(lastLabelKey)
                }
                break;
            default:
                if (onKeyDown) {
                    onKeyDown(evt);
                }
        }
    };

    _handleFocus = () => {
        if (this.state.isFocused !== true) {
            this.setState({
                isFocused: true
            });
        }
    };

    _handleBlur = () => {
        if (this.state.isFocused === true) {
            this.setState({
                isFocused: false
            });
        }
    };

    _addLabel(autocompleteResult, inputValue) {
        const { onAddLabel } = this.props;
        onAddLabel(autocompleteResult, inputValue);
        if (this.state.inputValue !== "") {
            this.setState({
                inputValue: ""
            });
        }
        this._inputDOMNode && this._inputDOMNode.focus();
    }

    _setInputDOMNode = el => {
        if (el) {
            this._inputDOMNode = findDOMNode(el);
        }
    };

    _changeWidth() {
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

    _renderLabels = labels => {
        const { tooltipClassName, onRemoveLabel } = this.props;
        return labels.map(label => (
            <Label
                id={label.id}
                key={label.id}
                tooltipContent={label.tooltipContent || null}
                tooltipClassName={tooltipClassName}
                onRemove={onRemoveLabel}>
                {label.labelContent}
            </Label>
        ))
    };

    render() {
        const { inputValue, inputWidth, isFocused } = this.state;
        const { labels, wrapperClassName } = this.props;

        const autocompleteProps = omit(
            this.props,
            ["minWidth", "maxWidth", "labels", "tooltipClassName", "wrapperClassName", "onAddLabel", "onRemoveLabel"]
        );

        const isFilled = labels.length > 0 || inputValue;

        return (
            <div onClick={this._handleClick}
                 onMouseDown={this._handleMouseDown}
                 className={cx(styles.wrapper, wrapperClassName, { [styles["focus"]]: isFocused })}>
                <div className={styles.content}>
                    {this._renderLabels(labels)}
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
                        textInputRef={this._setInputDOMNode}
                        onFocus={this._handleFocus}
                        onBlur={this._handleBlur}
                        onChange={this._handleChange}
                        onSelect={this._handleSelect}
                        onKeyDown={this._handleKey}
                        type={TextInputType.compact}
                        value={inputValue}
                        isFilled={isFilled}
                    />
                </div>
            </div>
        );
    }
}

MultiSelect.propTypes = {
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    labels: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            labelContent: PropTypes.string.isRequired,
            tooltipContent: PropTypes.node
        })
    ),
    tooltipClassName: PropTypes.string,
    onRemoveLabel: PropTypes.func,
    onAddLabel: PropTypes.func,
    onKeyDown: PropTypes.func,
    wrapperClassName: PropTypes.string
};

MultiSelect.defaultProps = {
    minWidth: 10,
    maxWidth: 440
};

export default MultiSelect;
