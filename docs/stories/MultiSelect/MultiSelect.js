import React from "react";

import MultiSelect from "../../../components/MultiSelect";
import Validation from "../../../helpers/ValidationHelpers";

export class MultiSelectWrapper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            labels: [
                {
                    labelContent: "vasya@skbkontur.ru",
                    tooltipContent: "Вася",
                    validationResult: {
                        isValid: true
                    }
                },
                {
                    labelContent: "petya@skbkontur.ru",
                    tooltipContent: "Петя",
                    validationResult: {
                        isValid: true
                    }
                }
            ],
            inputValue: ""
        };
    }

    _handleAddLabel = ({ inputValue }) => {
        const { onAddLabel } = this.props;

        this.setState({
            labels: this.state.labels
                .filter((l) => l.labelContent.toLowerCase() !== inputValue.toLowerCase())
                .concat({
                    labelContent: inputValue,
                    tooltipContent: "Вася"
                })
        });

        onAddLabel && onAddLabel(arguments);
    };

    _handleRemoveLabel = index => {
        const { onRemoveLabel } = this.props;

        this.setState({
            labels: this.state.labels.filter((l, i) => i !== index)
        });

        onRemoveLabel && onRemoveLabel(arguments);
    };

    _handleChangeLabel = (index, value) => {
        const { onChangeLabel } = this.props;

        this.setState({
            labels: this.state.labels.map((l, i) => ( i === index
                ? {
                    labelContent: value
                }
                : l)
            )
        });

        onChangeLabel && onChangeLabel(arguments);
    };

    _handleChange = value => {
        const { onChange } = this.props;

        this.setState({
            inputValue: value
        });

        onChange && onChange(arguments);
    };

    render() {
        const { labels, inputValue,  } = this.state;

        return (
            <MultiSelect
                labels={labels}
                inputValue={inputValue}
                inputValidation={Validation.Email()}
                labelsValidation={Validation.Required()}
                isValid={true}

                onChange={this._handleChange}
                onAddLabel={this._handleAddLabel}
                onRemoveLabel={this._handleRemoveLabel}
                onChangeLabel={this._handleChangeLabel}
            />
        );
    }
}
