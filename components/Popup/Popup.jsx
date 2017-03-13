import { PureComponent, PropTypes } from "react";
import { findDOMNode } from "react-dom";
import events from "add-event-listener";
import onClickOutside from "react-onclickoutside";

import Loader from "react-ui/Loader";
import Spinner from "react-ui/Spinner";

import { findContainer } from "../../helpers/NodeHelper";
import { calcPosition, adjustPositionType } from "../Tooltip/PositionHandler";
import { PositionTypes, TooltipTypes } from "../Tooltip";
import Icon, { IconTypes } from "../Icon";
import styles from "./Popup.scss";
import cx from "classnames";

class Popup extends PureComponent {
    _target = null;
    _defaultType = TooltipTypes.tip;

    constructor(props) {
        super();

        this.state = {
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

        this._tryUpdatePositionType();
        this._setPositionToStyle();
        this._attachEventListeners();
    }

    _attachEventListeners() {
        this._detachEventListeners();

        events.addEventListener(window, "resize", this._redraw);
        events.addEventListener(this._wrapper, "scroll", this._redraw);
    }

    _detachEventListeners() {
        events.removeEventListener(window, "resize", this._redraw);
        events.removeEventListener(this._wrapper, "scroll", this._redraw);
    }

    _setPositionToStyle() {
        const position = calcPosition(this.state.positionType, this._target, this._popup, this._defaultType, this.props.offsetPosition);

        Object.keys(position).map(property => {
            this._popup.style[property] = position[property]
        });
    }

    _redraw = () => {
        if (this._timer) {
            clearTimeout(this._timer);
        }

        this._timer = setTimeout(() => {
            this._tryUpdatePositionType();
            delete this._timer;
        }, 100);
    };

    _tryUpdatePositionType() {
        const positionType = adjustPositionType(this.props.positionType, this._target, this._popup, this._defaultType);

        if (this.state.positionType !== positionType) {
            this.setState({ positionType });
        }
    }

    render() {
        const { children, className, onClose, showCross, isLoading, spinnerType } = this.props;
        const { positionType } = this.state;

        const [tooltipPos, arrowPos] = positionType.split(" ");
        const popupClassNames = cx(
            className,
            styles.tooltip,
            styles.popup,
            styles[tooltipPos],
            styles[`arrow-${arrowPos}`],
            styles[this._defaultType],
            styles["as-open"]
        );

        return (
            <div className={popupClassNames} ref={component => component && (this._popup = component)} data-ft-id="popup">
                <Loader active={isLoading} caption="" type={spinnerType}>
                    <div className={styles.container}>
                        {showCross && <Icon type={IconTypes.Delete} className={styles.icon} onClick={onClose} />}
                        {children}
                    </div>
                </Loader>
            </div>
        );
    }
}

Popup.propTypes = {
    getTarget: PropTypes.func.isRequired,
    showCross: PropTypes.bool,
    isLoading: PropTypes.bool,
    spinnerType: PropTypes.oneOf(Object.values(Spinner.Types)),

    onClose: PropTypes.func.isRequired,

    positionType: PropTypes.oneOf(Object.values(PositionTypes)),
    offsetPosition: PropTypes.object,
    className: PropTypes.string,

    disableOnClickOutside: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // onClickOutside API

    wrapper: PropTypes.node,
    children: PropTypes.node
};

Popup.defaultProps = {
    positionType: PositionTypes.bottomCenter,
    showCross: true,
    isLoading: false,
    spinnerType: Spinner.Types.normal
};

export default onClickOutside(Popup);
