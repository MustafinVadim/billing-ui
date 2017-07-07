import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import omit from "lodash/omit";

import { TextInputType } from "../TextInput";
import calculateWidth from "./calculateInputWidth";
import Autocomplete from "../Autocomplete";
import Label from "./Label";

import styles from "./MultiSelect.scss";
import cx from "classnames";

class MultiSelect extends PureComponent {
    _inputDOMNode = null;

    constructor(props, context) {
        super(props, context);

        this.state = {
            inputWidth: this.props.minWidth,
            isFocused: false
        };
    }

    _handleClick = () => {
        this._inputDOMNode && this._inputDOMNode.focus();
    };

    _handleChange = (value, evt) => {
        this._changeWidth(evt.target);
    };

    _handleFocus = () => {
        if (this.state.isFocused !== true) {
            this.setState({
                isFocused: true
            });
        }
    };

    _handleBlur = () => {
        if (this.state.isFocused !== false) {
            this.setState({
                isFocused: false
            });
        }
    };

    _setInputDOMNode = (el) => {
        if (el) {
            this._inputDOMNode = findDOMNode(el);
        }
    };

    _changeWidth(input) {
        const { inputWidth } = this.state;
        const { minWidth, maxWidth } = this.props;

        let newWidth = calculateWidth(input);

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

    _renderLabels = (labels) => {
        const { tooltipClassName } = this.props;
        return labels.map(label => (
            <Label
                key={label.key}
                tooltipContent={label.tooltipContent || null}
                tooltipClassName={tooltipClassName}>
                {label.labelContent}
            </Label>
        ))
    };

    render() {
        const { inputWidth, isFocused } = this.state;
        const { labels } = this.props;

        const autocompleteProps = omit(
            this.props,
            ["minWidth", "maxWidth", "labels", "tooltipClassName"]
        );

        return (
            <div onClick={this._handleClick.bind(this)}
                 className={cx(styles.wrapper, { [styles["focus"]]: isFocused })}>
                {this._renderLabels(labels)}
                <Autocomplete
                    {...autocompleteProps}
                    onChange={ this._handleChange }
                    autocompleteWrapperClassName={styles.autocompleteWrapper}
                    wrapperClassName={styles.inputWrapper}
                    inputClassName={styles.input}
                    inputHighlightClassName={styles.inputHighlight}
                    width={inputWidth}
                    textInputRef={this._setInputDOMNode}
                    onFocus={this._handleFocus}
                    onBlur={this._handleBlur}
                    type={TextInputType.compact}
                    isFilled={true}
                />
            </div>
        );
    }
}

MultiSelect.propTypes = {
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    labels: PropTypes.arrayOf(
        PropTypes.shape({
            labelContent: PropTypes.string.isRequired,
            tooltipContent: PropTypes.node
        })
    ),
    tooltipClassName: PropTypes.string
};

MultiSelect.defaultProps = {
    minWidth: 10,
    maxWidth: 440
};

export default MultiSelect;
