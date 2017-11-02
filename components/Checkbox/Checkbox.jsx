import PropTypes from "prop-types";
import { PureComponent } from "react";

import CheckboxStates from "./CheckboxStates";

import checkboxStyles from "./Checkbox.scss";
import cx from "classnames";

class Checkbox extends PureComponent {
    constructor(props) {
        super(props);

        this._needAnimation = false;
    }

    componentDidMount() {
        this._needAnimation = true;
    }

    handleChange = (evt) => {
        const { checked, onChange } = this.props;

        if (onChange) {
            onChange(checked === CheckboxStates.unchecked, evt);
        }
    };

    render() {
        const {
            checked, checkboxClassName, labelClassName, wrapperClassName, styles,
            children, disabled, readonly, ftId, withLineStrikethrough, ...checkboxProps
        } = this.props;
        const labelClassNames = cx(styles.label, labelClassName, {
            [styles.partially]: checked === CheckboxStates.partiallyChecked
        });
        const wrapperClassNames = cx(styles.wrapper, wrapperClassName, {
            [styles.strikethrough]: withLineStrikethrough,
            [styles["with-animation"]]: withLineStrikethrough && this._needAnimation
        });
        const checkboxClassNames = cx(styles.checkbox, checkboxClassName, {
            "disabled": disabled,
            "readonly": readonly
        });

        return (
            <label className={wrapperClassNames} data-ft-id={ftId}>
                <input {...checkboxProps}
                    checked={checked === CheckboxStates.checked}
                    disabled={disabled}
                    readOnly={readonly}
                    className={checkboxClassNames}
                    type="checkbox"
                    onChange={this.handleChange} />
                <span className={labelClassNames}>
                    <span className={styles.content}>{children}</span>
                    {withLineStrikethrough && <span className={cx(styles["line-through"])}></span>}
                </span>
            </label>
        );
    }
}

Checkbox.propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.oneOf(Object.values(CheckboxStates)),
    disabled: PropTypes.bool,
    withLineStrikethrough: PropTypes.bool,
    readonly: PropTypes.bool,
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
    checked: CheckboxStates.unchecked,
    disabled: false,
    readonly: false,
    withLineStrikethrough: false,
    styles: checkboxStyles
};

export default Checkbox;
