import React from "react";

import Autocomplete from "../../../components/Autocomplete";

export class AutocompleteWrapper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            inputValue: ""
        };
    }

    _handleChange = value => {
        const { onChange } = this.props;

        this.setState({
            inputValue: value
        });

        onChange && onChange(value);
    };

    render() {

        return (
            <Autocomplete
                {...this.props}
                isValid={true}
                url={"url"}

                onChange={this._handleChange}
            />
        );
    }
}
