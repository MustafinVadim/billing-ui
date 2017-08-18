import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import Icon, { IconTypes } from "../Icon";
import Tooltip, { TriggerTypes, PositionTypes } from "../Tooltip";
import { calculateContentWidth } from "../../helpers/NodeHelper";

import styles from "./Label.scss";
import cx from "classnames";

const LABEL_REMOVE_ICON_CLASS_NAME = "js-label-remove-icon";

class Label extends PureComponent {
    _tooltipTarget = null;
    _inputDOMNode = null;

    constructor(props, context) {
        super(props, context);

        this.state = {
            inputWidth: 0
        };
    }

    componentDidUpdate() {
        const {isEditMode} = this.props;

        if (isEditMode) {
            this._changeInputWidth();
        }
    }

    isCaretAtEnd() {
        const { selectionStart, selectionEnd, value: { length } } = this._inputDOMNode;
        return selectionStart === length && selectionStart === selectionEnd;
    }

    isCaretAtStart() {
        const { selectionStart, selectionEnd } = this._inputDOMNode;
        return selectionEnd === 0 && selectionStart === selectionEnd
    }

    selectInput() {
        this._inputDOMNode && this._inputDOMNode.focus();
        this._inputDOMNode && this._inputDOMNode.select();
    }

    _handleClickRemove = evt => {
        const { onRemoveClick, index } = this.props;

        if (onRemoveClick) {
            onRemoveClick(index, evt);
        }
    };

    _handleMouseDown = evt => {
        const { onMouseDown, index } = this.props;

        const onRemoveIcon = evt.target.className.indexOf(LABEL_REMOVE_ICON_CLASS_NAME) >= 0;
        if (onRemoveIcon) {
            return;
        }

        if (onMouseDown) {
            onMouseDown(index, evt);
        }
    };

    _handleChange = evt => {
        const { onChange, index } = this.props;
        const value = evt.target.value.trim();

        onChange && onChange(index, value, evt);
    };

    _handleBlur = (evt) => {
        const { onBlur, index } = this.props;

        onBlur && onBlur(index, evt);
    };

    _handleFocus = (evt) => {
        const { onFocus, index } = this.props;

        onFocus && onFocus(index, evt);
    };

    _handleKey = evt => {
        const { onKeyDown, index } = this.props;

        if (onKeyDown) {
            onKeyDown(index, evt);
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
        this._inputDOMNode = findDOMNode(el);
    };

    render() {
        const { children, tooltipContent, tooltipClassName, isActive, isEditMode, className } = this.props;
        const { inputWidth } = this.state;
        const hasTooltip = !!tooltipContent && !isEditMode;

        const wrapperClassNames = cx(
            styles.wrapper,
            {
                [styles.active]: isActive,
                [styles["edit-mode"]]: isEditMode
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
                            tabIndex="-1"
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
                            onMouseDown={this._handleMouseDown}
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
    isEditMode: PropTypes.bool,
    validationResult: PropTypes.shape({
        isValid: PropTypes.bool,
        error: PropTypes.string
    }),
    children: PropTypes.string,
    onRemoveClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onEnterEditMode: PropTypes.func,
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
