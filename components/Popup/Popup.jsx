import PropTypes from "prop-types";
import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import events from "add-event-listener";
import onClickOutside from "react-onclickoutside";
import isEqual from "lodash/isEqual";

import Loader, { SpinnerTypes } from "../Loader";

import KeyCodes from "../../helpers/KeyCodes";
import { findContainer } from "../../helpers/NodeHelper";
import { calcPosition, adjustPositionType } from "../Tooltip/PositionHandler";
import { PositionTypes, TooltipTypes } from "../Tooltip";

import styles from "./Popup.scss";
import cx from "classnames";

class Popup extends PureComponent {
    constructor(props) {
        super(props);

        this._target = null;
        this._defaultType = TooltipTypes.tip;

        this.state = {
            position: {},
            positionType: props.positionType
        };
    }

    componentDidMount() {
        this._init();
    }

    componentWillUpdate() {
        this._detachEventListeners();
    }

    componentDidUpdate() {
        this._init();
    }

    componentWillUnmount() {
        this._detachEventListeners();
    }

    handleClickOutside() {
        this.props.onClose();
    }

    _init() {
        const { getTarget, wrapper } = this.props;

        this._target = findDOMNode(getTarget());
        this._wrapper = wrapper || findContainer(this._target);

        this._tryUpdatePosition();
        this._attachEventListeners();
    }

    _attachEventListeners() {
        const { closeOnEsc } = this.props;

        this._detachEventListeners();

        events.addEventListener(window, "resize", this._redraw);
        events.addEventListener(this._wrapper, "scroll", this._redraw);

        if (closeOnEsc) {
            events.addEventListener(window, "keydown", this._handleKeydown);
        }
    }

    _detachEventListeners() {
        const { closeOnEsc } = this.props;

        events.removeEventListener(window, "resize", this._redraw);
        events.removeEventListener(this._wrapper, "scroll", this._redraw);

        if (closeOnEsc) {
            events.removeEventListener(window, "keydown", this._handleKeydown);
        }
    }

    _redraw = () => {
        if (this._timer) {
            clearTimeout(this._timer);
        }

        this._timer = setTimeout(() => {
            this._tryUpdatePosition();
            delete this._timer;
        }, 100);
    };

    _handleKeydown = (evt) => {
        const { onClose } = this.props;

        if (evt.keyCode === KeyCodes.esc) {
            onClose();
        }
    };

    _tryUpdatePosition() {
        const positionType = adjustPositionType(this.props.positionType, this._target, this._popup, this._defaultType, this._wrapper);
        const position = calcPosition(positionType, this._target, this._popup, this._defaultType, this.props.offsetPosition);

        if (!isEqual(this.state.position, position)) {
            this.setState({ position, positionType });
        }
    }

    render() {
        const { children, className, onClose, showCross, isLoading, spinnerType, isOpened, wrapperClassName } = this.props;
        const { positionType, position } = this.state;

        const [tooltipPos, arrowPos] = positionType.split(" ");
        const wrapperClassNames = cx(
            wrapperClassName,
            styles.wrapper,
            styles.tooltip,
            styles[tooltipPos],
            styles[`arrow-${arrowPos}`],
            styles[this._defaultType], {
                [styles["as-open"]]: isOpened
            }
        );

        const popupClassNames = cx(
            className,
            styles.popup
        );

        return (
            <div className={wrapperClassNames} ref={component => component && (this._popup = component)} data-ft-id="popup" style={{...position}}>
                <Loader active={isLoading} caption="" type={spinnerType}>
                    <div className={popupClassNames}>
                        {showCross && <div className={styles.close} onClick={onClose} />}
                        {children}
                    </div>
                </Loader>
            </div>
        );
    }
}

Popup.propTypes = {
    isOpened: PropTypes.bool,
    getTarget: PropTypes.func.isRequired,
    showCross: PropTypes.bool,
    closeOnEsc: PropTypes.bool,
    isLoading: PropTypes.bool,
    spinnerType: PropTypes.oneOf(Object.values(SpinnerTypes)),

    onClose: PropTypes.func.isRequired,

    positionType: PropTypes.oneOf(Object.values(PositionTypes)),
    offsetPosition: PropTypes.object,
    wrapperClassName: PropTypes.string,
    className: PropTypes.string,

    disableOnClickOutside: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // onClickOutside API

    wrapper: PropTypes.node,
    children: PropTypes.node
};

Popup.defaultProps = {
    isOpened: true,
    closeOnEsc: true,
    positionType: PositionTypes.bottomCenter,
    showCross: true,
    isLoading: false,
    spinnerType: SpinnerTypes.normal
};

export default onClickOutside(Popup);
