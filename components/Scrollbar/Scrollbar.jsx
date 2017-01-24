import { PureComponent, PropTypes } from "react";
import ReactScrollbar from "react-custom-scrollbars";

import styles from "./Scrollbar.scss";
import cx from "classnames";

class Scrollbar extends PureComponent {
    _renderTrackHorizontal = props => {
        const resetStyle = {
            position: null,
            height: null
        };

        return <div { ...props } style={resetStyle} className={cx(styles.track, styles["is-horizontal"])} />;
    };

    _renderTrackVertical = props => {
        const resetStyle = {
            position: null,
            width: null
        };

        return <div { ...props } style={resetStyle} className={cx(styles.track, styles["is-vertical"])} />;
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

    render() {
        const { children, containerClassName } = this.props;

        const resetDefaultContainerStyle = {
            position: null,
            overflow: null,
            width: null,
            height: null
        };

        return (
            <ReactScrollbar
                className={cx(styles.container, containerClassName)}
                style={resetDefaultContainerStyle}
                renderTrackHorizontal={this._renderTrackHorizontal}
                renderTrackVertical={this._renderTrackVertical}
                renderThumbHorizontal={this._renderThumbHorizontal}
                renderThumbVertical={this._renderThumbVertical}
            >
                {children}
            </ReactScrollbar>
        );
    }
}

Scrollbar.propTypes = {
    containerClassName: PropTypes.string,

    children: PropTypes.node.isRequired
};

export default Scrollbar;
