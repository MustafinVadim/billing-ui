import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import Icon, { IconTypes } from "../Icon";
import Tooltip, { TriggerTypes, PositionTypes } from "../Tooltip";
import { calculateContentWidth } from "../../helpers/NodeHelper";
import keyCodes from "../../helpers/KeyCodes";

import styles from "./Label.scss";
import cx from "classnames";

const LABEL_REMOVE_ICON_CLASS_NAME = "js-label-remove-icon";

class Label extends PureComponent {
    _tooltipTarget = null;
    _inputDOMNode = null;

    constructor(props, context) {
        super(props, context);

        this.state = {
            inputWidth: 0,
            isEditMode: false
        }
    }

    componentDidUpdate() {
        if (this.state.isEditMode) {
            this._changeInputWidth();
            this._inputDOMNode && this._inputDOMNode.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isActive && !nextProps.validationResult.isValid) {
            this.switchToEditMode();
        }
    }

    switchToEditMode() {
        this.setState({
            isEditMode: true
        });
        this._inputDOMNode && this._inputDOMNode.select();
    }

    exitEditMode() {
        const { onExitEditMode, index } = this.props;

        this.setState({
            isEditMode: false
        });

        onExitEditMode(index);
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
        this.switchToEditMode();
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

    _handleFocus = () => {
        this.switchToEditMode();
    };

    _handleBlur = () => {
        const { onBlur, index } = this.props;

        this.exitEditMode();

        onBlur && onBlur(index);
    };

    _handleKey = evt => {
        const { onKeyDown } = this.props;
        switch (evt.keyCode) {
            case keyCodes.comma:
            case keyCodes.semiColon:
            case keyCodes.space:
                const isCaretAtEnd = this._inputDOMNode.selectionStart === this._inputDOMNode.value.length;
                if (isCaretAtEnd) {
                    this.exitEditMode();
                }
                break;

            case keyCodes.enter:
                this.exitEditMode();
                break;
        }

        if (onKeyDown) {
            onKeyDown(evt);
        }
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
        const hasTooltip = !!tooltipContent && !isEditMode;

        const wrapperClassNames = cx(
            styles.wrapper,
            {
                [styles.active]: isActive
            }
        );

        return (
            <span className={wrapperClassNames}>
                {isEditMode || !validationResult.isValid
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
                            onFocus={this._handleFocus}
                            onKeyDown={this._handleKey}
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
                        offsetPosition={{
                            top: 7
                        }}>
                        {tooltipContent}
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
    onKeyDown: PropTypes.func,
    onExitEditMode: PropTypes.func,
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
