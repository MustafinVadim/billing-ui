import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import calculateWidth from "./calculateInputWidth";
import Autocomplete from "../Autocomplete";
import Label from "./Label";

import styles from "./MultiSelect.scss";

class MultiSelect extends PureComponent {
    _inputDOMNode = null;

    constructor(props, context) {
        super(props, context);

        this.state = {
            inputWidth: this.props.minWidth
        };
    }

    _handleChange = (value, evt) => {
        this._changeWidth(evt.target);
    };

    _setInputDOMNode = (el) => {
        if (el) {
            this._inputDOMNode = findDOMNode(el);
        }
    };

    _handleClick = () => {
        this._inputDOMNode && this._inputDOMNode.focus();
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
        const { inputWidth } = this.state;
        return (
            <div onClick={this._handleClick.bind(this)} className={styles.wrapper}>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Label>test@skbkontur.ru</Label>
                <Autocomplete
                    onChange={ this._handleChange }
                    inputClassNames={styles.input}
                    width={inputWidth}
                    {...this.props}
                    textInputRef={this._setInputDOMNode} />
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
