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
            inputWidth: 0,
            isEditMode: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isEditMode) {
            this._changeInputWidth();
            this._inputDOMNode && this._inputDOMNode.focus();

            if (!prevState.isEditMode || prevProps.isActive) {
                this._inputDOMNode && this._inputDOMNode.select();
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isActive && !nextProps.validationResult.isValid) {
            this.enterEditMode();
        }
    }

    enterEditMode() {
        const { onEnterEditMode, index} = this.props;

        this.setState({
            isEditMode: true
        });
        this._inputDOMNode && this._inputDOMNode.select();

        onEnterEditMode && onEnterEditMode(index);
    }

    exitEditMode() {
        const { onExitEditMode, validationResult: { isValid }, index, children } = this.props;
        if (isValid) {
            this.setState({
                isEditMode: false
            });
            onExitEditMode && onExitEditMode(index, children)
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

    _handleClickRemove = evt => {
        const { onRemove, index } = this.props;

        if (onRemove) {
            onRemove(index, evt);
        }
    };

    _handleMouseDown = evt => {
        const { onMouseDown, index, isActive } = this.props;

        const onRemoveIcon = evt.target.className.indexOf(LABEL_REMOVE_ICON_CLASS_NAME) >= 0;
        if (onRemoveIcon) {
            return;
        }

        if (isActive) {
            this.enterEditMode();
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
        const { onBlur, onRemove, index, children } = this.props;

        this.exitEditMode();

        if (!children) {
            onRemove && onRemove(index, evt);
        }

        onBlur && onBlur(index);
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
        const { children, tooltipContent, tooltipClassName, isActive, className } = this.props;
        const { isEditMode, inputWidth } = this.state;
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
    children: PropTypes.string,
    onRemove: PropTypes.func,
    onMouseDown: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
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
