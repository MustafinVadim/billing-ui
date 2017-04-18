import PropTypes from "prop-types";
import { PureComponent } from "react";
import dateSelectType from "./DateSelectType";
import keyCodes from "../../helpers/KeyCodes";
import { fixYPopupPosition } from "./PopupPositionHelper";

import cx from "classnames";
import styles from "./DateSelect.scss";

const HEIGHT = 30;
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

class DateSelect extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            opened: false,
            pos: 0,
            topCapped: false,
            botCapped: false,
            current: 0
        };
    }

    componentDidUpdate() {
        if (this._holder) {
            this._holder.style.top = fixYPopupPosition(this._holder);
        }
    }

    handleKey = (evt) => {
        if (this.state.opened) {
            switch (evt.keyCode) {
                case keyCodes.enter:
                    if (this.state.current !== null && this.props.onChange) {
                        const value = this.props.value + this.state.current;
                        this.props.onChange({ target: { value } }, value);
                    }
                    this.close();
                    evt.stopPropagation();
                    break;

                case keyCodes.esc:
                    this.close();
                    evt.stopPropagation();
                    break;

                case keyCodes.top:
                    this.setState({ current: this.state.current - 1 });
                    evt.preventDefault();
                    break;

                case keyCodes.bottom:
                    this.setState({ current: this.state.current + 1 });
                    evt.preventDefault();
                    break;
            }
        } else {
            switch (evt.keyCode) {
                case keyCodes.space:
                case keyCodes.top:
                case keyCodes.bottom:
                    this.open();
                    evt.preventDefault();
                    break;
            }
        }
    };

    handleUp = (evt) => {
        evt.preventDefault();
        this.resetSize(this.state.pos - HEIGHT);
    };

    handleDown = (evt) => {
        evt.preventDefault();
        this.resetSize(this.state.pos + HEIGHT);
    };

    handleItemClick = (evt) => {
        if (evt.button !== 0) {
            return;
        }

        const rect = evt.currentTarget.getBoundingClientRect();
        const y = evt.clientY - rect.top + this.state.top + this.state.pos;
        const value = this.props.value + Math.floor(y / HEIGHT);

        this.close();

        if (this.props.onChange) {
            this.props.onChange({target: {value}}, value);
        }
    };

    handleMouseMove = (evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();
        const y = evt.clientY - rect.top + this.state.top + this.state.pos;
        const current = Math.floor(y / HEIGHT);
        this.setState({current});
    };

    handleMouseLeave = () => {
        this.setState({current: null});
    };

    handleWheel = (evt) => {
        evt.preventDefault();

        let deltaY = evt.deltaY;
        if (evt.deltaMode === 1) {
            deltaY *= HEIGHT;
        } else if (evt.deltaMode === 2) {
            deltaY *= HEIGHT * 4;
        }
        const pos = this.state.pos + deltaY;
        this.resetSize(pos);
    };

    open = () => {
        if (this.state.opened) {
            return;
        }

        this.resetSize(0);
        this.setState({
            opened: true,
            current: 0
        });
    };

    close = () => {
        if (!this.state.opened) {
            return;
        }

        this.setState({ opened: false });
    };

    resetSize(pos) {
        let newPos = pos;
        const { type, value } = this.props;
        let top, height;

        switch (type) {
            case dateSelectType.month:
                top = -value * HEIGHT;
                height = 12 * HEIGHT;
                break;
            case dateSelectType.year:
                top = -5 * HEIGHT;
                height = 11 * HEIGHT;
                break;
        }

        const minPos = this.getMinPos() - top;
        const maxPos = this.getMaxPos() - top - height + HEIGHT;
        if (minPos >= newPos) {
            newPos = minPos;
        }
        if (maxPos <= newPos) {
            newPos = maxPos;
        }
        const topCapped = newPos <= minPos;
        const botCapped = newPos >= maxPos;

        this.setState({ pos: newPos, top, height, topCapped, botCapped });
    }

    getMinPos() {
        const { type, value, minYear } = this.props;

        switch (type) {
            case dateSelectType.month:
                return -value * HEIGHT;
            case dateSelectType.year:
                return (minYear - value) * HEIGHT;
        }
    }

    getMaxPos() {
        const { type, value, maxYear } = this.props;

        switch (type) {
            case dateSelectType.month:
                return (11 - value) * HEIGHT;
            case dateSelectType.year:
                return (maxYear - value) * HEIGHT;
        }
    }

    getItem(index) {
        const value = this.props.value + index;

        if (this.props.type === dateSelectType.month) {
            return MONTHS[value];
        }

        return value;
    }

    renderMenu() {
        const { top, height, pos, current, topCapped, botCapped } = this.state;

        let shift = pos % HEIGHT;
        if (shift < 0) {
            shift += HEIGHT;
        }
        const from = (pos - shift + top) / HEIGHT;
        const to = from + Math.ceil((height + shift) / HEIGHT);
        const items = [];

        for (let i = from; i < to; ++i) {
            const itemClassNames = cx(styles.item, {
                [styles.active]: i === current,
                [styles.selected]: i === 0
            });
            const item = this.getItem(i);

            items.push(
                <div key={i} className={itemClassNames} data-ft-id={`date-select-menu-item-${item}`}>
                    {item}
                </div>
            );
        }


        const style = {
            top: top - 3
        };

        const shiftStyle = {
            position: "relative",
            top: -shift
        };

        const holderClassNames = cx(styles.holder, {
            [styles["is-top-capped"]]: topCapped
        });

        return (
            <div className={holderClassNames} style={style} onKeyDown={this.handleKey} ref={(c) => { this._holder = c }} data-ft-id="date-select-menu">
                {!topCapped && (
                    <div className={styles.up} onMouseDown={this.handleUp} />
                )}
                <div className={styles.items} style={{height}}>
                    <div style={shiftStyle}>{items}</div>
                    <div className={styles.overlay}
                        data-ft-id="date-select-menu_overlay"
                        onMouseDown={this.handleItemClick}
                        onMouseMove={this.handleMouseMove}
                        onMouseLeave={this.handleMouseLeave}
                        onWheel={this.handleWheel}
                    />
                </div>
                {!botCapped && (
                    <div className={styles.down} onMouseDown={this.handleDown} />
                )}
            </div>
        );
    }

    render() {
        const { type, width } = this.props;
        const rootProps = {
            className: styles.root,
            style: { width },
            tabIndex: "0",
            onBlur: this.close,
            onKeyDown: this.handleKey
        };

        return (
            <div {...rootProps}>
                <div className={styles.caption} onClick={this.open} data-ft-id={`date-select-${type}-button`}>
                    {this.getItem(0)}
                    <div className={styles.arrow} />
                </div>
                {this.state.opened && this.renderMenu()}
            </div>
        );
    }
}

DateSelect.propTypes = {
    maxYear: PropTypes.number,
    minYear: PropTypes.number,
    type: PropTypes.oneOf(Object.keys(dateSelectType).map(key => dateSelectType[key])).isRequired,
    value: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func
};

DateSelect.defaultProps = {
    type: dateSelectType.year,
    minYear: 1900,
    maxYear: 2100,
    width: "auto"
};

export default DateSelect;
