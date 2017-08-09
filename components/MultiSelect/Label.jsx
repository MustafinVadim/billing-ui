import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import Icon, { IconTypes } from "../Icon";
import Tooltip, { TriggerTypes, PositionTypes, TooltipTypes } from "../Tooltip";
import { calculateContentWidth } from "../../helpers/NodeHelper";

import styles from "./Label.scss";
import cx from "classnames";

const LABEL_REMOVE_ICON_CLASS_NAME = "js-label-remove-icon";

class Label extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            inputWidth: 0,
            isEditMode: false
        }
    }

    _tooltipTarget = null;
    _inputDOMNode = null;

    componentDidUpdate() {
        if (this.state.isEditMode) {
            this._changeInputWidth();
            this._inputDOMNode && this._inputDOMNode.focus();
        }
    }

    _handleClickRemove = evt => {
        const { onRemove, index } = this.props;

        if (onRemove) {
            onRemove(index, evt);
        }
    };

    _handleClick = evt => {
        const { onClick, index } = this.props;

        const onRemoveIcon = evt.target.className.indexOf(LABEL_REMOVE_ICON_CLASS_NAME) >= 0;
        if (onRemoveIcon) {
            return;
        }

        if (onClick) {
            onClick(index, evt);
        }
    };

    _handleDoubleClick = () => {
        this.setState({
            isEditMode: true
        });
    };

    _handleChange = evt => {
        const { onChange, onRemove, index } = this.props;
        const value = evt.target.value;

        if (value) {
            onChange && onChange(index, value, evt);
        } else {
            onRemove && onRemove(index, evt);
        }
    };

    _handleBlur = () => {
        const { onBlur, index } = this.props;

        this.setState({
            isEditMode: false
        });

        onBlur && onBlur(index);
    };

    _changeInputWidth = () => {
        const { inputWidth } = this.state;

        let newInputWidth = calculateContentWidth(this._inputDOMNode);

        if (newInputWidth !== inputWidth) {
            this.setState({
                inputWidth: newInputWidth
            });
        }
    };

    _setTooltipTarget = el => {
        this._tooltipTarget = el;
    };

    _setInputDOMNode = el => {
        this._inputDOMNode = findDOMNode(el)
    };

    render() {
        const { children, tooltipContent, tooltipClassName, isActive, validationResult, className } = this.props;
        const { isEditMode, inputWidth } = this.state;
        const hasTooltip = (!!tooltipContent || !validationResult.isValid) && !isEditMode;

        const wrapperClassNames = cx(
            styles.wrapper,
            {
                [styles.active]: isActive,
                [styles.invalid]: !validationResult.isValid
            }
            );

        return (
            <span className={wrapperClassNames}>
                {isEditMode
                    ? (
                        <input
                            style={{
                                "width": inputWidth
                            }}
                            className={cx(styles.input, className)}
                            type="text"
                            value={children}
                            ref={this._setInputDOMNode}
                            onBlur={this._handleBlur}
                            onChange={this._handleChange}
                        />
                    )

                    : (
                        <span
                            className={cx(styles.content, className)}
                            ref={this._setTooltipTarget}
                            onClick={this._handleClick}
                            onDoubleClick={this._handleDoubleClick}
                        >
                            {children}
                            <Icon onClick={this._handleClickRemove}
                                  className={cx(styles.icon, LABEL_REMOVE_ICON_CLASS_NAME)}
                                  type={IconTypes.Delete} />
                        </span>
                    )
                }
                {hasTooltip && (
                    <Tooltip
                        className={tooltipClassName}
                        getTarget={() => this._tooltipTarget}
                        trigger={TriggerTypes.hover}
                        positionType={PositionTypes.topCenter}
                        type={validationResult.isValid ? TooltipTypes.tip : TooltipTypes.validation}
                        offsetPosition={{
                            top: 7
                        }}>
                        {validationResult.isValid ? tooltipContent : validationResult.error}
                    </Tooltip>
                )}
            </span>
        );
    }
}

Label.propTypes = {
    index: PropTypes.number,
    isActive: PropTypes.bool,
    validationResult: PropTypes.shape({
        isValid: PropTypes.bool,
        error: PropTypes.string
    }),
    children: PropTypes.node,
    onRemove: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    tooltipContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
    tooltipClassName: PropTypes.string
};

Label.defaultProps = {
    validationResult: {
        isValid: true,
        error: ""
    }
};

export default Label;
