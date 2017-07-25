import { PureComponent } from "react";
import PropTypes from "prop-types";

import Icon, { IconTypes } from "../Icon";
import Tooltip, { TriggerTypes, PositionTypes } from "../Tooltip";

import styles from "./Label.scss";
import cx from "classnames";

const LABEL_REMOVE_ICON_CLASS_NAME = "js-label-remove-icon";

class Label extends PureComponent {
    _tooltipTarget = null;

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

    _setTooltipTarget = el => {
        this._tooltipTarget = el;
    };

    render() {
        const { children, tooltipContent, tooltipClassName, isActive, className } = this.props;
        const hasTooltip = !!tooltipContent;

        return (
            <span className={cx(styles.wrapper, { [styles.active]: isActive })} >
                <span className={cx(styles.content, className)} ref={this._setTooltipTarget} onClick={this._handleClick}>
                    {children}
                    <Icon onClick={this._handleClickRemove}
                          className={cx(styles.icon, LABEL_REMOVE_ICON_CLASS_NAME)}
                          type={IconTypes.Delete} />
                </span>
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
    children: PropTypes.node,
    onRemove: PropTypes.func,
    onClick: PropTypes.func,
    className: PropTypes.string,
    tooltipContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
    tooltipClassName: PropTypes.string
};

export default Label;
