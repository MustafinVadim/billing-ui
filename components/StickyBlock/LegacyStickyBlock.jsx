import { PureComponent } from "react";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";
import events from "add-event-listener";
import NavigatorResolver from "../../helpers/NavigatorResolver";
import styles from "./LegacyStickyBlock.scss";
import cx from "classnames";

class LegacyStickyBlock extends PureComponent {
    constructor(props) {
        super(props);

        this._container = null;
        this._scrollContainer = document.querySelector(props.scrollContainer);
        this._isIEInWin10 = NavigatorResolver.isWin10 && (NavigatorResolver.isIE11 || NavigatorResolver.isEdge);
        this._handleScroll = throttle(this._updateState.bind(this), 50);
        this._handleResize = throttle(this._updateState.bind(this), 100);

        this._observer = new MutationObserver(throttle(this._updateState.bind(this), 100));

        this.state = {
            isFixed: false
        };
    }

    componentDidMount() {
        events.addEventListener(this._scrollContainer, "scroll", this._handleScroll);
        events.addEventListener(window, "resize", this._handleResize);
        this._observer.observe(this._scrollContainer, {
            childList: true,
            subtree: true
        });
    }

    componentWillUnmount() {
        events.removeEventListener(this._scrollContainer, "scroll", this._handleScroll);
        events.removeEventListener(window, "resize", this._handleResize);
        this._observer.disconnect();
    }

    _updateState() {
        if (this._scrollContainer.scrollTop > this._container.offsetTop) {
            this._setFixed(true);
        } else {
            this._setFixed(false);
        }
    }

    _setFixed(isFixed) {
        if (this.state.isFixed !== isFixed) {
            this.setState({ isFixed });
        }
    }

    render() {
        const { children, className } = this.props;
        const { isFixed } = this.state;

        const classNames = cx(
            styles.sticky,
            className,
            {
                [styles.fixed]: isFixed && !this._isIEInWin10,
                [styles["ms-device-fixed"]]: isFixed && this._isIEInWin10
            }
        );

        return (
            <div className={classNames} ref={elem => { this._container = elem }}>
                {children}
            </div>
        );
    }
}

LegacyStickyBlock.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    scrollContainer: PropTypes.string
};

LegacyStickyBlock.defaultProps = {
    scrollContainer: "#MainWrapper"
};

export default LegacyStickyBlock;
