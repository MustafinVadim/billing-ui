import PropTypes from "prop-types";
import { Component } from "react";
import checkboxStyles from "./Checkbox.scss";
import classnames from "classnames";

class Checkbox extends Component {
    handleChange = (evt) => {
        const { checked, onChange } = this.props;

        if (onChange) {
            onChange(!checked, evt)
        }
    };

    render() {
        const {
            checked, checkboxClassName, labelClassName, wrapperClassName, styles,
            children, disabled, readonly, ftId, ...checkboxProps
        } = this.props;
        const labelClassNames = classnames(styles.label, labelClassName);
        const wrapperClassNames = classnames(styles.wrapper, wrapperClassName);
        const checkboxClassNames = classnames(styles.checkbox, checkboxClassName, {
            "disabled": disabled,
            "readonly": readonly
        });

        return (
            <label className={wrapperClassNames} data-ft-id={ftId}>
                <input {...checkboxProps}
                    checked={checked}
                    disabled={disabled}
                    readOnly={readonly}
                    className={checkboxClassNames}
                    type="checkbox"
                    onChange={this.handleChange} />
                <span className={labelClassNames}>
                    {children}
                </span>
            </label>
        );
    }
}

Checkbox.propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    readonly: PropTypes.bool.isRequired,
    labelClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    checkboxClassName: PropTypes.string,
    styles: PropTypes.object,
    ftId: PropTypes.string,
    children: PropTypes.node
    // Так же можно передать остальные стандартные атрибуты чекбокса, но визуально они ни как не обрабатываются
};

Checkbox.defaultProps = {
    labelClassName: "",
    wrapperClassName: "",
    checkboxClassName: "",
    checked: false,
    disabled: false,
    readonly: false,
    styles: checkboxStyles
};

export default Checkbox;
