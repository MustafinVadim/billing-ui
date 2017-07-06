import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

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
    }

    render() {
        const { inputWidth, isFocused } = this.state;

        return (
            <div onClick={this._handleClick.bind(this)}
                 className={cx(styles.wrapper, { [styles["focus"]]: isFocused })}>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Autocomplete
                    onChange={ this._handleChange }
                    autocompleteWrapperClassName={styles.autocompleteWrapper}
                    wrapperClassName={styles.inputWrapper}
                    inputClassNames={styles.input}
                    width={inputWidth}
                    {...this.props}
                    textInputRef={this._setInputDOMNode}
                    onFocus={this._handleFocus}
                    onBlur={this._handleBlur}
                    type={TextInputType.compact}
                    placeholder="TEST"
                    isFilled={true}
                />
            </div>
        );
    }
}

MultiSelect.propTypes = {
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number
};

MultiSelect.defaultProps = {
    minWidth: 10,
    maxWidth: 440
};

export default MultiSelect;
