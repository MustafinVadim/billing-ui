import PropTypes from "prop-types";
import { PureComponent } from "react";
import cx from "classnames";

import Link from "../Link";

import styles from "./ReadComment.scss";

class ReadComment extends PureComponent {
    _textBlock = null;
    _maxCollapsedHeight = 90;

    state = {
        hasOverflow: false,
        actualHeight: 80
    };

    componentDidMount = () => {
        this._calculateHeight();
    };

    componentDidUpdate = () => {
        this._calculateHeight();
        this._updateOverflow();
    };

    hasOverflow = () => {
        return this.state.actualHeight > this._maxCollapsedHeight;
    };

    _toggleCollapse = evt => {
        evt.stopPropagation();
        this.props.onCollapseToggle();
    };

    _calculateHeight() {
        const { actualHeight } = this.state;
        const { isCollapsed } = this.props;

        const currentHeight = this._textBlock.style.height;

        const blockBordersVerticalWidth = parseInt(getComputedStyle(this._textBlock).borderTopWidth)
            + parseInt(getComputedStyle(this._textBlock).borderBottomWidth);
        this._textBlock.style.height = isCollapsed ? this._maxCollapsedHeight : 0;
        let newHeight = this._textBlock.scrollHeight + blockBordersVerticalWidth;
        this._textBlock.style.height = currentHeight;

        if (newHeight !== actualHeight) {
            this.setState({
                actualHeight: newHeight
            });
        }
    }

    _updateOverflow = () => {
        const hasOverflow = this.hasOverflow();

        if (this.state.hasOverflow !== hasOverflow) {
            this.setState({ hasOverflow: hasOverflow });
        }
    };

    render() {
        const { value, isCollapsed, title, date } = this.props;
        const { hasOverflow } = this.state;

        const toggleButtonText = isCollapsed ? "показать полностью" : "скрыть";
        const textBlockHeight = hasOverflow ? (isCollapsed ? this._maxCollapsedHeight : this.state.actualHeight) : "";

        const textClassNames = cx(
            styles.text,
            {
                [styles["overflow"]]: hasOverflow,
                [styles["collapsed"]]: isCollapsed
            }
        );

        return (
            <div className={styles.wrapper}>
                {(title || date) && (
                    <div className={styles.header}>
                        <div className={styles.title}>{title}</div>
                        <div className={styles.date}>{date}</div>
                    </div>
                )}
                <div
                    className={textClassNames}
                    ref={elem => { this._textBlock = elem }}
                    style={{ height: textBlockHeight }}>
                    {value || "Написать комментарий"}
                </div>

                {hasOverflow && (
                    <Link className={styles.toggle} onClick={this._toggleCollapse}>
                        {toggleButtonText}
                    </Link>
                )}
            </div>
        );
    }
}

ReadComment.propTypes = {
    value: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    isCollapsed: PropTypes.bool,

    onCollapseToggle: PropTypes.func
};

export default ReadComment;
