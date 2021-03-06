import PropTypes from "prop-types";
import { PureComponent, Children, cloneElement } from "react";
import CustomPropTypes from "../../helpers/CustomPropTypes";
import RadioButton, { valuePropType } from "../RadioButton";
import radioGroupStyles from "./RadioGroup.scss";
import classnames from "classnames";

class RadioGroup extends PureComponent {
    renderItems() {
        const { value, onChange, children } = this.props;

        return Children.map(children, radio => {
            return cloneElement(radio || {}, {
                key: radio.props.value,
                checked: value === radio.props.value,
                onChange: (evt) => {
                    onChange(evt.target.value, evt);
                }
            })
        });
    }

    render() {
        const { className, styles } = this.props;
        const classNames = classnames(styles.wrapper, className);

        return (
            <span className={classNames}>
                {this.renderItems()}
            </span>
        );
    }
}

RadioGroup.propTypes = {
    onChange: PropTypes.func,
    value: valuePropType,
    className: PropTypes.string,
    styles: PropTypes.object,
    children: CustomPropTypes.children(RadioButton)
};

RadioGroup.defaultProps = {
    className: "",
    styles: radioGroupStyles
};

export default RadioGroup;
