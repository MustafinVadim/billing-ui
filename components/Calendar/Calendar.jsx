import PropTypes from "prop-types";
import { PureComponent } from "react";
import moment, { formatDate, convertISOString, inRange } from "../../libs/moment";
import TimeConstants from "../../helpers/TimeConstants";
import CustomPropTypes from "../../helpers/CustomPropTypes";

import cx from "classnames";
import styles from "./Calendar.scss";

const MONTH_NAMES = [
    "Январь", "Февраль", "Март", "Апрель",
    "Май", "Июнь", "Июль", "Август",
    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const DAY = TimeConstants.day;
const WEEK = 7 * DAY;
const FIRST_WEEK_SHIFT = (new Date(0).getDay() - 1) * DAY;
const DAY_HEIGHT = 31;
const DAY_WIDTH = 28;
const CALENDAR_HEIGHT = 210;
const ROWS_COUNT = Math.ceil(CALENDAR_HEIGHT / DAY_HEIGHT);

const getWeek = (time) => {
    return Math.floor((FIRST_WEEK_SHIFT + time) / WEEK);
};

const getDayTop = (fromWeek, offset, time) => {
    return (getWeek(time) - fromWeek) * DAY_HEIGHT - offset;
};

const getDay = date => {
    const day = date.day();
    return day ? day - 1 : 6;
};

const dateToPos = date => {
    return getWeek(+date) * DAY_HEIGHT;
};

const posToDate = pos => {
    return moment(Math.floor(pos / DAY_HEIGHT) * WEEK - FIRST_WEEK_SHIFT);
};

class Calendar extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            pos: this._prettyfyPosition(dateToPos(props.initialDate))
        };

        this._today = moment();
    }

    moveToDate(date) {
        const newDate = moment(0);
        newDate.year(date.year());
        newDate.month(date.month());
        this.setState({ pos: this._prettyfyPosition(dateToPos(newDate)) });
    }

    handleWheel = (evt) => {
        evt.preventDefault();

        let deltaY = evt.deltaY;
        if (evt.deltaMode === 1) {
            deltaY *= DAY_HEIGHT;
        } else if (evt.deltaMode === 2) {
            deltaY *= DAY_HEIGHT * 4;
        } else if (evt.deltaMode === 0) {
            deltaY = deltaY / Math.abs(deltaY) * DAY_HEIGHT * 5;
        }

        const pos = this._prettyfyPosition(this.state.pos + deltaY);

        this.setState({ pos });

        const date = posToDate(pos);
        date.date(date.date() + 6);
        this.props.onNav(date);
    };

    handleMouseDown = (evt) => {
        const { onPick, minDate, maxDate, disableInvalidDates } = this.props;

        if (evt.button !== 0) {
            return;
        }

        const rect = evt.currentTarget.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;

        const time = posToDate(this.state.pos + y);
        const date = moment(time);
        const weekDay = Math.floor(x / DAY_WIDTH);
        if (weekDay < 7) {
            date.date(date.date() + weekDay);

            if (!inRange(date, minDate, maxDate) && disableInvalidDates) {
                return;
            }

            onPick && onPick(date);
        }
    };

    handleMouseMove = (evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();

        this.setState({
            mouseX: evt.clientX - rect.left,
            mouseY: evt.clientY - rect.top
        });
    };

    handleMouseLeave = () => {
        this.setState({ mouseX: -10 });
    };

    renderMonth(offset, from, week) {
        const months = [];
        let monthStart = moment(from);
        monthStart.date(1);

        for (let i = 0; i < 4; ++i) {
            const monthEnd = moment(monthStart);
            monthEnd.month(monthEnd.month() + 1);
            const y = getDayTop(week, offset, +monthStart);
            const monthWrapperStyle = {
                top: y,
                height: getDayTop(week, offset, +monthEnd) - y
            };
            const monthClassNames = cx(styles.month, {
                [styles.grey]: monthStart.month() % 2
            });

            const monthStyle = {
                position: "relative",
                top: Math.max(0, -y)
            };

            const isJanuary = monthStart.month() === 0;

            months.push(
                <div key={+monthStart} className={monthClassNames} style={monthWrapperStyle}>
                    <div style={monthStyle}>
                        {MONTH_NAMES[monthStart.month()]}
                        {isJanuary && <div className={styles.year}>{monthStart.year()}</div>}
                    </div>
                </div>
            );

            monthStart = monthEnd;
        }

        return months;
    }

    renderCells(offset, from, week) {
        const { value, minDate, maxDate, highlightRange, disableInvalidDates } = this.props;

        const cells = [];
        const cellCount = Math.ceil((CALENDAR_HEIGHT + offset) / DAY_HEIGHT) * 7;

        for (let i = 0; i < cellCount; ++i) {
            const cur = from + i * DAY;
            const curWeek = getWeek(cur);
            const date = moment(cur);
            const x = getDay(date) * DAY_WIDTH;
            const y = (curWeek - week) * DAY_HEIGHT - offset;
            const style = {
                left: x,
                top: y
            };

            const mouseX = this.state.mouseX;
            const mouseY = this.state.mouseY;
            const active = x < mouseX && x + DAY_WIDTH > mouseX && y < mouseY && y + DAY_HEIGHT > mouseY;
            const disabled = !inRange(date, minDate, maxDate) && disableInvalidDates;
            const current = date.isSame(value, "day");
            const highlighted = highlightRange && inRange(date, highlightRange.minDate, highlightRange.maxDate);

            const highlightedStyle = highlighted ? {
                color: !current ? highlightRange.color : null,
                backgroundColor: current ? highlightRange.color : null
            } : null;

            const cellClassNames = cx(styles.cell, {
                [styles.active]: active,
                [styles.today]: date.isSame(this._today, "day"),
                [styles.current]: current,
                [styles.grey]: date.month() % 2,
                [styles.disabled]: disabled
            });
            cells.push((
                <span key={cur} className={cellClassNames} style={style} data-ft-id={`calendar-day_${formatDate(date)}`}>
                    <span className={styles["cell-inner"]} style={highlightedStyle}>{date.date()}</span>
                </span>
            ));
        }

        return cells;
    }

    _prettyfyPosition(pos) {
        const { minDate: minDateISO, maxDate: maxDateISO, disableInvalidDates } = this.props;

        if (!disableInvalidDates) {
            return pos;
        }

        let date = posToDate(pos);

        const minDate = convertISOString(minDateISO);
        const maxDate = convertISOString(maxDateISO);

        const minWeek = getWeek(minDate);
        const maxWeek = getWeek(maxDate);

        const firstShowingWeek = getWeek(date);
        const lastShowingWeek = getWeek(date) + ROWS_COUNT - 1;

        if (maxWeek - minWeek <= ROWS_COUNT - 1) {
            date = moment((minDate + maxDate) / 2).subtract(Math.floor(ROWS_COUNT / 2), "weeks");
        } else if (firstShowingWeek <= minWeek) {
            date = minDate;
        } else if (lastShowingWeek >= maxWeek) {
            date = moment(maxDate).subtract(ROWS_COUNT - 1, "weeks");
        }

        return dateToPos(date);
    }

    render() {
        let offset = this.state.pos % DAY_HEIGHT;
        if (offset < 0) {
            offset += DAY_HEIGHT;
        }
        const from = posToDate(this.state.pos - offset);
        const week = getWeek(from);

        const months = this.renderMonth(offset, from, week);
        const cells = this.renderCells(offset, from, week);

        return (
            <div className={styles.root} tabIndex="0" onWheel={this.handleWheel}>
                {cells}
                {months}
                <div className={styles.mask}
                     data-ft-id="calendar-days_overlay"
                     onMouseMove={this.handleMouseMove}
                     onMouseLeave={this.handleMouseLeave}
                     onMouseDown={this.handleMouseDown}
                />
            </div>
        );
    }
}

Calendar.propTypes = {
    initialDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
    disableInvalidDates: PropTypes.bool,
    value: PropTypes.instanceOf(moment),
    onNav: PropTypes.func,
    onPick: PropTypes.func,
    maxDate: PropTypes.instanceOf(moment),
    minDate: PropTypes.instanceOf(moment),
    highlightRange: PropTypes.shape({
        minDate: CustomPropTypes.date,
        maxDate: CustomPropTypes.date,
        legend: PropTypes.string,
        color: PropTypes.string
    })
};

export default Calendar;
