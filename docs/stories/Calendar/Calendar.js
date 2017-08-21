import React from "react";

import Calendar from "../../../components/Calendar";

export class CalendarWrapper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            date: ""
        };
    }

    _handleChange = (date) => {
        const { onChange } = this.props;

        this.setState({ date });

        onChange && onChange(date);
    };

    render() {

        return (
            <Calendar
                {...this.props}
                onChange={this._handleChange}
                value={this.state.date}
            />
        );
    }
}
