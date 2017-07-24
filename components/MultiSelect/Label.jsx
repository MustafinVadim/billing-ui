import { PureComponent } from "react";
import PropTypes from "prop-types";

import Icon, { IconTypes } from "../Icon";
import Tooltip, { TriggerTypes, PositionTypes } from "../Tooltip";

import styles from "./Label.scss";
import cx from "classnames";

class Label extends PureComponent {
    _tooltipTarget = null;

    _handleClickRemove = (evt) => {
        const { onRemove, index } = this.props;

        if (onRemove) {
            onRemove(index, evt);
        }
    };

    _setTooltipTarget = (el) => {
        this._tooltipTarget = el;
    };

    render() {
        const { children, tooltipContent, tooltipClassName, isActive } = this.props;
        const hasTooltip = !!tooltipContent;

        return (
            <span className={cx(styles.wrapper, { [styles.active]: isActive })}>
                <span className={styles.content} ref={this._setTooltipTarget}>
                    {children}
                    <Icon onClick={this._handleClickRemove}
                          className={styles.icon}
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
    tooltipContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]),
    tooltipClassName: PropTypes.string
};

export default Label;
