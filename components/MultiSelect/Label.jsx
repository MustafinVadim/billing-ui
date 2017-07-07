import { PureComponent } from "react";
import PropTypes from "prop-types";

import Icon, { IconTypes } from "../Icon";
import Tooltip, { TriggerTypes, PositionTypes } from "../Tooltip";

import styles from "./Label.scss";

class Label extends PureComponent {
    _tooltipTarget = null;

    _handleClick = (evt) => {
        this.props.onRemove(this.props.id, evt);
    };

    render() {
        const { children, tooltipContent, tooltipClassName } = this.props;
        const hasTooltip = !!tooltipContent;
        return (
            <span className={styles.wrapper}>
                <span className={styles.label} ref={ el => {
                    this._tooltipTarget = el
                }}>
                    {children}
                    <Icon onClick={this._handleClick}
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
    id: PropTypes.string,
    children: PropTypes.node,
    onRemove: PropTypes.func,
    tooltipContent: PropTypes.node,
    tooltipClassName: PropTypes.string
};

export default Label;
