import { PureComponent, PropTypes } from "react";
import ReactDOM from "react-dom";
import cx from "classnames";
import debounce from "lodash/debounce";
import events from "add-event-listener";
import isEqual from "lodash/isEqual";

import Button, { ButtonType } from "../Button";
import NavigatorResolver from "../../helpers/NavigatorResolver";
import { containerNodeSelector } from "./StickyActionBarContainer";
import { findContainer, findContainerBySelector, getAbsoluteHeight } from "../../helpers/NodeHelper";

import styles from "./ActionsBar.scss";

class ActionsBar extends PureComponent {
    constructor(props) {
        super(props);
        this._isIEInWin10 = NavigatorResolver.isWin10 && (NavigatorResolver.isIE11 || NavigatorResolver.isEdge);

        this.state = {
            fixed: false,
            heightActionsBar: 0
        };
    }

    componentDidMount() {
        this._handleResize = debounce(this._renderStickyActionsBar.bind(this), 100);
        this._handleRender = debounce(this._renderStickyActionsBar.bind(this), 50);

        this._handleRender();
        events.addEventListener(window, "resize", this._handleResize);
    }

    componentDidUpdate() {
        this._handleRender();
    }

    componentWillUnmount() {
        events.removeEventListener(window, "resize", this._handleResize);
    }

    _renderStickyActionsBar() {
        this._containerNode = findContainerBySelector(this._actionsBarNode, containerNodeSelector);
        this._mainWrapperNode = this._containerNode && findContainer(this._containerNode);

        if (!this._containerNode) {
            return;
        }

        const newState = this._collectState();
        if (!isEqual(newState, this.state)) {
            this.setState(newState)
        }
    }

    _collectState() {
        const fixed = this._containerNode.scrollHeight > this._mainWrapperNode.clientHeight;

        if (this.state.fixed === fixed) {
            return this.state;
        }

        return {
            fixed,
            heightActionsBar: fixed && this._actionsBarNode
                ? getAbsoluteHeight(this._actionsBarNode)
                : 0
        }
    }

    handleCancelClick = () => {
        const { cancelDisabled, onCancelClick } = this.props;

        if (!cancelDisabled) {
            onCancelClick();
        }
    };

    render() {
        const {
            showSubmit, showCancel, barClassName, submitClassName, cancelClassName, submitText, cancelText, submitDisabled, cancelDisabled,
            onSubmitClick, submitAttributes, cancelAttributes, wrapperClassName, children
        } = this.props;

        const actionsBarClassNames = cx(styles.actionsBar, barClassName, {
            [styles.fixed]: this.state.fixed && !this._isIEInWin10,
            [styles["ms-device-fixed"]]: this.state.fixed && this._isIEInWin10
        });

        const actionsBarStyle = this.state.fixed ? { width: this._containerNode.offsetWidth } : {};
        const ghostActionsBarStyle = this.state.fixed ? { height: this.state.heightActionsBar } : {};

        return (
            <div className={cx(styles["actionsBar-wrapper"], wrapperClassName)}>
                <div className={styles["ghost-actionsBar"]} style={ghostActionsBarStyle}></div>
                <div className={actionsBarClassNames} style={actionsBarStyle} ref={el => { this._actionsBarNode = ReactDOM.findDOMNode(el) }}>
                    {showSubmit && (
                        <Button type={ButtonType.button}
                                onClick={onSubmitClick}
                                disabled={submitDisabled}
                                className={cx(styles.actionSubmit, submitClassName, {[styles.disabled]: submitDisabled})}
                                attributes={{
                                    "data-ft-id": "submit-button",
                                    ...submitAttributes
                                }}
                        >
                            {submitText}
                        </Button>
                    )}
                    {showCancel && (
                        <button type="button"
                                onClick={this.handleCancelClick}
                                className={cx(styles.actionCancel, cancelClassName, { [styles.disabled]: cancelDisabled })}
                                data-ft-id="cancel-button"
                                { ...cancelAttributes }
                        >
                            {cancelText}
                        </button>
                    )}
                    {children}
                </div>
            </div>
        );
    }
}

ActionsBar.propTypes = {
    showSubmit: PropTypes.bool.isRequired,
    showCancel: PropTypes.bool.isRequired,

    submitAttributes: PropTypes.object,
    cancelAttributes: PropTypes.object,

    wrapperClassName: PropTypes.string,
    barClassName: PropTypes.string,
    submitClassName: PropTypes.string,
    cancelClassName: PropTypes.string,

    submitText: PropTypes.string.isRequired,
    cancelText: PropTypes.string,

    submitDisabled: PropTypes.bool.isRequired,
    cancelDisabled: PropTypes.bool,

    onSubmitClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func,

    children: PropTypes.node
};

ActionsBar.defaultProps = {
    showSubmit: true,
    showCancel: true,

    submitDisabled: false,
    cancelDisabled: false,

    submitText: "Сохранить",
    cancelText: "Отменить"
};

export default ActionsBar;
