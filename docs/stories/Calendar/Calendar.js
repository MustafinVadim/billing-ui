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
        const { minDate, maxDate, highlight} = this.props;
        const { isValid, date } = this.state;

        return (
            <Calendar
                {...this.props}
                onChange={this._handleChange}
                value={date}
                isValid={isValid}
                minDate={minDate ? moment(minDate).toISOString() : undefined}
                maxDate={maxDate ? moment(maxDate).toISOString() : undefined}
                highlight={{
                    ...highlight,
                    minDate: highlight.minDate ? moment(highlight.minDate).toISOString() : undefined,
                    maxDate: highlight.maxDate ? moment(highlight.maxDate).toISOString() : undefined
                }}
            />
        );
    }
}
