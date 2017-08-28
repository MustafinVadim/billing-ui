import React from "react";

import Calendar from "../../../components/Calendar";

import moment from "../../../libs/moment";

export class CalendarWrapper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            date: "",
            isValid: true
        };
    }

    _handleChange = (date, data) => {
        const { onChange } = this.props;

        this.setState({
            date,
            isValid: data.isValid
        });

        onChange && onChange(date, data);
    };

    render() {
        const { minDate, maxDate, highlightRange, defaultStartDate} = this.props;
        const { isValid, date } = this.state;

        return (
            <Calendar
                {...this.props}
                onChange={this._handleChange}
                value={date}
                isValid={isValid}
                minDate={minDate ? moment(minDate).toISOString() : undefined}
                maxDate={maxDate ? moment(maxDate).toISOString() : undefined}
                highlightRange={{
                    ...highlightRange,
                    minDate: highlightRange && highlightRange.minDate ? moment(highlightRange.minDate).toISOString() : undefined,
                    maxDate: highlightRange && highlightRange.maxDate ? moment(highlightRange.maxDate).toISOString() : undefined
                }}
                defaultStartDate={defaultStartDate ? moment(defaultStartDate).toISOString() : undefined}
            />
        );
    }
}
