import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactDOM from "react-dom";
import events from "add-event-listener";
import moment from "../../libs/moment";

import Calendar from "./Calendar";
import DateSelect from "./DateSelect";
import Legenda from "./Legend";
import CustomPropTypes from "../../helpers/CustomPropTypes";

import styles from "./Picker.scss";

const isDetached = element => {
    let newElement = element;
    const body = document.body;

    do {
        if (newElement === body) {
            return false;
        }
        newElement = newElement.parentNode;
    } while (newElement);

    return true;
};

class Picker extends PureComponent {
    _handleDocClick = this.handleDocClick.bind(this);

    constructor(props, context) {
        super(props, context);

        this.state = {
            date: props.value && props.value.isValid() ? props.value : moment()
        };
    }

    componentDidMount() {
        this._mounted = true;

        events.addEventListener(document, "mousedown", this._handleDocClick);

        const picker = ReactDOM.findDOMNode(this);

        const pickerInWindowBottomPosY = picker.getBoundingClientRect().bottom;

        if (pickerInWindowBottomPosY > window.innerHeight) {
            picker.style.bottom = `${this.props.verticalShift}px`;
        }
    }

    componentWillUnmount() {
        this._mounted = false;

        events.removeEventListener(document, "mousedown", this._handleDocClick);
    }

    handleMonthChange = (evt) => {
        var newDate = moment(this.state.date).month(evt.target.value);
        this.setState({ date: newDate });

        this.refs.calendar.moveToDate(newDate);
    };

    handleYearChange = (evt) => {
        var newDate = moment(this.state.date).year(evt.target.value);
        this.setState({ date: newDate });

        this.refs.calendar.moveToDate(newDate);
    };

    handleDocClick(evt) {
        if (!this._mounted) {
            return;
        }

        const target = evt.target || evt.srcElement;
        if (!ReactDOM.findDOMNode(this).contains(target) && !isDetached(target)) {
            this.props.onClose();
        }
    }

    render() {
        const { date } = this.state;
        const { minYear, maxYear, minDate, maxDate, highlightRange, defaultStartDate, disableInvalidDates, value } = this.props;

        const initialDate = value.isValid() || !defaultStartDate.isValid() ? moment(date).subtract(3, "weeks") : defaultStartDate;

        return (
            <div className={styles.root} data-ft-id="calendar-picker">

                <div className={styles.header}>
                    <div>
                        <DateSelect type="year"
                                    disableInvalidDates={disableInvalidDates}
                                    value={date.year()}
                                    minYear={minYear}
                                    maxYear={maxYear}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    width={60}
                                    onChange={this.handleYearChange}
                        />
                        <DateSelect type="month"
                                    disableInvalidDates={disableInvalidDates}
                                    value={date.month()}
                                    year={date.year()}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    width={95}
                                    onChange={this.handleMonthChange}
                        />
                    </div>
                </div>
                <Calendar ref="calendar"
                          {...this.props}
                          initialDate={initialDate}
                          onNav={(date) => this.setState({ date })}
                />
                {highlightRange && highlightRange.legend && (
                    <Legenda text={highlightRange.legend} color={highlightRange.color} />
                )}
            </div>
        );
    }
}

Picker.propTypes = {
    value: PropTypes.instanceOf(moment),
    defaultStartDate: PropTypes.instanceOf(moment),
    disableInvalidDates: PropTypes.bool,
    verticalShift: PropTypes.number,
    maxDate: PropTypes.instanceOf(moment),
    minDate: PropTypes.instanceOf(moment),
    highlightRange: PropTypes.shape({
        minDate: CustomPropTypes.date,
        maxDate: CustomPropTypes.date,
        legend: PropTypes.string,
        color: PropTypes.string
    }),
    minYear: PropTypes.number,
    maxYear: PropTypes.number,
    onPick: PropTypes.func,
    onClose: PropTypes.func
};

export default Picker;
