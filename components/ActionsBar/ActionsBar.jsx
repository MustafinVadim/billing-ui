import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactDOM from "react-dom";
import events from "add-event-listener";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import isEqual from "lodash/isEqual";

import Button, { ButtonType } from "../Button";
import NavigatorResolver from "../../helpers/NavigatorResolver";
import { CONTAINER_NODE_SELECTOR } from "./StickyActionBarContainer";
import { findContainer, findContainerBySelector, getAbsoluteHeight, findScrollContainer } from "../../helpers/NodeHelper";

import styles from "./ActionsBar.scss";
import cx from "classnames";

class ActionsBar extends PureComponent {
    constructor(props) {
        super(props);
        this._isIEInWin10 = NavigatorResolver.isWin10 && (NavigatorResolver.isIE11 || NavigatorResolver.isEdge);

        this.state = {
            fixed: false,
            heightActionsBar: 0
        };

        this._observer = new MutationObserver(debounce(this._renderStickyActionsBar.bind(this), 60));
    }

    componentDidMount() {
        this._handleResize = debounce(this._renderStickyActionsBar.bind(this), 100);
        this._handleScroll = throttle(this._renderStickyActionsBar.bind(this), 60);
        this._handleRender = debounce(this._renderStickyActionsBar.bind(this), 50);

        this._scrollContainer = findScrollContainer(this._actionsBarNode);

        const containerNode = findContainerBySelector(this._actionsBarNode, CONTAINER_NODE_SELECTOR);
        if (containerNode) {
            this._observer.observe(containerNode, {
                childList: true,
                subtree: true
            });
        }

        this._handleRender();
        events.addEventListener(window, "resize", this._handleResize);
        events.addEventListener(this._scrollContainer, "scroll", this._handleScroll);
    }

    componentDidUpdate() {
        this._handleRender();
    }

    componentWillUnmount() {
        events.removeEventListener(window, "resize", this._handleResize);
        events.removeEventListener(this._scrollContainer, "scroll", this._handleScroll);
        this._observer.disconnect();
    }

    _renderStickyActionsBar() {
        if (!this.props.isSticky) {
            return;
        }

        this._containerNode = findContainerBySelector(this._actionsBarNode, CONTAINER_NODE_SELECTOR);
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
        const containerBottom = this._containerNode.getBoundingClientRect().bottom;
        const fixed = containerBottom >= this._mainWrapperNode.clientHeight;

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
            showSubmit, showCancel, submitClassName, cancelClassName, submitText, cancelText, submitDisabled, cancelDisabled,
            onSubmitClick, submitAttributes, cancelAttributes, wrapperClassName, barClassName, contentClassName, children
        } = this.props;

        const actionsBarClassNames = cx(styles.actionsBar, barClassName, {
            [styles.fixed]: this.state.fixed && !this._isIEInWin10,
            [styles["ms-device-fixed"]]: this.state.fixed && this._isIEInWin10
        });

        const actionsBarStyle = this.state.fixed ? { width: this._containerNode.offsetWidth } : {};
        const ghostActionsBarStyle = this.state.fixed ? { height: this.state.heightActionsBar } : {};

        return (
            <div className={cx(styles["actionsBar-wrapper"], wrapperClassName)}>
                <div className={styles["ghost-actionsBar"]} style={ghostActionsBarStyle} />
                <div className={actionsBarClassNames} style={actionsBarStyle} ref={el => {
                    this._actionsBarNode = ReactDOM.findDOMNode(el)
                }}>
                    <div className={contentClassName}>
                        <div>
                            {showSubmit && (
                                <Button
                                    type={ButtonType.button}
                                    onClick={onSubmitClick}
                                    disabled={submitDisabled}
                                    className={cx(styles.actionSubmit, submitClassName, { [styles.disabled]: submitDisabled })}
                                    attributes={{
                                        "data-ft-id": "submit-button",
                                        ...submitAttributes
                                    }}
                                >
                                    {submitText}
                                </Button>
                            )}
                            {showCancel && (
                                <button
                                    type="button"
                                    onClick={this.handleCancelClick}
                                    className={cx(styles.actionCancel, cancelClassName, { [styles.disabled]: cancelDisabled })}
                                    data-ft-id="cancel-button"
                                    {...cancelAttributes}
                                >
                                    {cancelText}
                                </button>
                            )}
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

ActionsBar.propTypes = {
    showSubmit: PropTypes.bool,
    showCancel: PropTypes.bool,

    submitAttributes: PropTypes.object,
    cancelAttributes: PropTypes.object,

    isSticky: PropTypes.bool,

    wrapperClassName: PropTypes.string,
    barClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    submitClassName: PropTypes.string,
    cancelClassName: PropTypes.string,

    submitText: PropTypes.string,
    cancelText: PropTypes.string,

    submitDisabled: PropTypes.bool,
    cancelDisabled: PropTypes.bool,

    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,

    children: PropTypes.node
};

ActionsBar.defaultProps = {
    showSubmit: true,
    showCancel: true,

    isSticky: false,

    submitDisabled: false,
    cancelDisabled: false,

    submitText: "Сохранить",
    cancelText: "Отменить"
};

export default ActionsBar;
