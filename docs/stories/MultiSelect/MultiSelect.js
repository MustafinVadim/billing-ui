import React from "react";

import MultiSelect from "../../../components/MultiSelect";
import Validation, { validate } from "../../../helpers/ValidationHelpers";

export class MultiSelectWrapper extends React.Component {
    static propTypes = MultiSelect.propTypes;

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
            inputValue: "",
            validationResult: {
                error: "",
                isValid: true
            }
        };
    }

    _handleAddLabel = ({ inputValue }) => {
        const { onAddLabel } = this.props;

        const newLabels = this.state.labels
            .filter((l) => l.labelContent.toLowerCase() !== inputValue.toLowerCase())
            .concat({
                labelContent: inputValue,
                validationResult: validate(inputValue, Validation.Email())
            });

        this.setState({
            labels: newLabels
        });

        this._validate(inputValue, newLabels);

        onAddLabel && onAddLabel(inputValue);
    };

    _handleRemoveLabel = index => {
        const { onRemoveLabel } = this.props;
        const { inputValue } = this.state;

        const newLabels = this.state.labels.filter((l, i) => i !== index);

        this.setState({
            labels: newLabels
        });

        this._validate(inputValue, newLabels);

        onRemoveLabel && onRemoveLabel(index);
    };

    _handleChangeLabel = (index, value) => {
        const { onChangeLabel } = this.props;
        const { inputValue } = this.state;

        const newLabels = this.state.labels.map((l, i) => ( i === index
            ? {
                labelContent: value,
                validationResult: validate(value, Validation.Email())
            }
            : l)
        );

        this.setState({
            labels: newLabels
        });

        this._validate(inputValue, newLabels);

        onChangeLabel && onChangeLabel(index, value);
    };

    _handleChange = value => {
        const { onChange } = this.props;

        this.setState({
            inputValue: value
        });

        onChange && onChange(value);
    };

    _handleBlur = () => {
        const { inputValue, labels } = this.state;

        this._validate(inputValue, labels);
    };

    _validate = (inputValue, labels) => {
        const inputValidationResult = validate(inputValue, Validation.Email());
        const validationResult = labels.reduce(
            (validationResult, label) => {
                if (!label.validationResult.isValid) {
                    return label.validationResult;
                } else {
                    return validationResult;
                }
            },
            inputValidationResult
        );

        this.setState({
            validationResult: validationResult
        });
    };

    render() {
        const { labels, inputValue, validationResult } = this.state;

        return (
            <MultiSelect
                {...this.props}
                labels={labels}
                inputValue={inputValue}
                inputValidation={Validation.Email()}
                labelsValidation={Validation.Required()}
                isValid={validationResult.isValid}
                tooltipCaption={validationResult.error}
                autocompleteURL={"url"}

                onChange={this._handleChange}
                onBlur={this._handleBlur}
                onAddLabel={this._handleAddLabel}
                onRemoveLabel={this._handleRemoveLabel}
                onChangeLabel={this._handleChangeLabel}
            />
        );
    }
}
