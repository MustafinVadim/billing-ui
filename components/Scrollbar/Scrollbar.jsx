import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactScrollbar from "react-custom-scrollbars";

import styles from "./Scrollbar.scss";
import cx from "classnames";

class Scrollbar extends PureComponent {
    constructor(props) {
        super(props);
        this._scrollbar = null;
        this._autoUpdateInterval = setInterval(this._forceUpdate, 60);
    }

    componentWillUnmount() {
        clearInterval(this._autoUpdateInterval);
    }

    getScrollbar() {
        return this._scrollbar;
    }

    _forceUpdate = () => {
        if (this._scrollbar) {
            this._scrollbar.forceUpdate();
        }
    };

    _renderTrackHorizontal = props => {
        const resetStyle = {
            position: null,
            height: null
        };

        return <div { ...props } style={resetStyle} className={cx(styles.track, styles["is-horizontal"], {[styles.invisible]: !this.props.isVisible})} />;
    };

    _renderTrackVertical = props => {
        const resetStyle = {
            position: null,
            width: null
        };

        return <div { ...props } style={resetStyle} className={cx(styles.track, styles["is-vertical"], {[styles.invisible]: !this.props.isVisible})} />;
    };

    _renderThumbHorizontal = props => {
        const resetStyle = {
            position: null,
            display: null,
            width: null
        };

        return <div { ...props } style={resetStyle} className={cx(styles.thumb, styles["is-horizontal"])} />;
    };

    _renderThumbVertical = props => {
        const resetStyle = {
            position: null,
            display: null,
            height: null
        };

        return <div { ...props } style={resetStyle} className={cx(styles.thumb, styles["is-vertical"])} />;
    };

    _saveScrollbarRef = el => {
        this._scrollbar = el
    };

    render() {
        const { children, containerClassName, ...scrollbarProps } = this.props;

        const resetDefaultContainerStyle = {
            position: null,
            overflow: null,
            width: null,
            height: null
        };

        delete scrollbarProps.isVisible;

        return (
            <ReactScrollbar
                className={cx(styles.container, containerClassName)}
                style={resetDefaultContainerStyle}
                renderTrackHorizontal={this._renderTrackHorizontal}
                renderTrackVertical={this._renderTrackVertical}
                renderThumbHorizontal={this._renderThumbHorizontal}
                renderThumbVertical={this._renderThumbVertical}
                {...scrollbarProps}
                ref={this._saveScrollbarRef}
            >
                {children}
            </ReactScrollbar>
        );
    }
}

Scrollbar.propTypes = {
    containerClassName: PropTypes.string,
    isVisible: PropTypes.bool,

    children: PropTypes.node.isRequired
    // Так же можно передать остальные props ReactScrollbar
};

Scrollbar.defaultProps = {
    isVisible: true
};

export default Scrollbar;
