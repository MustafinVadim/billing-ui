import { PureComponent } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import Popup, { PositionTypes } from "billing-ui/components/Popup";

import ActionsTheme from "./ActionsTheme";

import styles from "./Actions.scss";
import cx from "classnames";

class Actions extends PureComponent {
    _popupTarget = null;
    state = {
        isOpened: false
    };

    componentDidUpdate(prevProps) {
        if (prevProps.isActive && !this.props.isActive) {
            this._handleClose();
        }
    }

    _handleClickContent = () => {
        const { shouldCloseOnClick } = this.props;

        if (shouldCloseOnClick) {
            this._handleClose();
        }
    };

    _handleOpen = () => {
        if (!this.state.isOpened) {
            const { onOpen } = this.props;

            this.setState({
                isOpened: true
            });

            if (onOpen) {
                onOpen();
            }
        }
    };

    _handleClose = () => {
        const { onClose } = this.props;

        this.setState({
            isOpened: false
        });

        if (onClose) {
            onClose();
        }
    };

    _setPopupTarget = (el) => {
        this._popupTarget = findDOMNode(el);
    };

    _getPopupTarget = () => this._popupTarget;

    _buildOffsetPosition() {
        const { offsetPosition, theme } = this.props;

        if (offsetPosition) {
            return offsetPosition;
        }

        return ActionsTheme.getOffsetPosition(theme);
    }

    render() {
        const { theme, className, popupClassName, actionsButtonClassName, children } = this.props;
        const { isOpened } = this.state;

        const ActionsButton = ActionsTheme.getButton(theme);

        return (
            <div className={cx(styles.wrapper, className)}>
                <ActionsButton
                    className={actionsButtonClassName}
                    onClick={this._handleOpen}
                    isActive={isOpened}
                    ref={this._setPopupTarget}
                />
                {isOpened && (
                    <Popup
                        getTarget={this._getPopupTarget}
                        onClose={this._handleClose}
                        className={cx(styles.popup, popupClassName)}
                        positionType={PositionTypes.leftTop}
                        offsetPosition={this._buildOffsetPosition()}
                        showCross={false}
                    >
                        <div onClick={this._handleClickContent}>
                            {children}
                        </div>
                    </Popup>
                )}
            </div>
        );
    }
}

Actions.propTypes = {
    theme: PropTypes.oneOf(Object.keys(ActionsTheme)),
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    actionsButtonClassName: PropTypes.string,
    isActive: PropTypes.bool,

    shouldCloseOnClick: PropTypes.bool,
    offsetPosition: PropTypes.object,

    onOpen: PropTypes.func,
    onClose: PropTypes.func,

    children: PropTypes.node
};

Actions.defaultProps = {
    theme: ActionsTheme.row,
    shouldCloseOnClick: true,
    isActive: true
};

export default Actions;
