import PropTypes from "prop-types";
import { PureComponent } from "react";
import debounce from "lodash/debounce";
import omit from "lodash/omit";
import axios from "../../libs/axios";

import Highlighter from "../Highlighter";
import keyCodes from "../../helpers/KeyCodes";
import { updateImmutableArrayByKey } from "../../helpers/ArrayHelper";
import { switchToRusLanguage, switchToEngLanguage } from "../../helpers/StringHelpers";

import Icon, { IconTypes } from "../Icon";
import TextInput from "../TextInput";

import styles from "./Autocomplete.scss";
import cx from "classnames";

class Autocomplete extends PureComponent {
    _valueCreator = null;

    constructor(props, context) {
        super(props, context);
        const { value, defaultValue } = props;

        this._valueCreator = props.valueCreator;

        this.state = {
            searchResult: [],
            selected: -1,
            errorMessage: null,
            value: value ? value : defaultValue,
            opened: false
        };

        this.showNewOptions = debounce(this.showNewOptions, 200);
    }

    componentWillReceiveProps(props) {
        const { value, defaultValue } = props;

        if (value !== undefined || (defaultValue !== this.props.defaultValue)) {
            this.setState({
                value: value ? value : defaultValue,
                defaultValue
            });
        }
    }

    handleItemClick = (evt, index) => {
        if (evt.button !== 0) {
            return;
        }

        evt.preventDefault();
        this.choose(index);
    };

    handleChange = (value) => {
        const { onChange } = this.props;

        if (!this.props.value) {
            this.setState({
                value,
                errorMessage: ""
            });
        }

        this.showNewOptions(value);

        if (onChange) {
            onChange(value, { sours: "TextInput" });
        }
    };

    handleFocus = (evt) => {
        const value = evt.target.value || "";

        this.showNewOptions(value);

        if (this.props.onFocus) {
            this.props.onFocus(evt);
        }
    };

    handleBlur = (evt) => {
        this.closeOptions();

        if (this.props.onBlur) {
            this.props.onBlur(evt);
        }
    };

    handleKey = (evt) => {
        const { searchResult } = this.state;
        const currentSelected = this.state.selected;
        const optionsCount = searchResult.length;
        let handled = false;

        if ((evt.keyCode === keyCodes.top || evt.keyCode === keyCodes.bottom) && optionsCount) {
            evt.preventDefault();
            handled = true;

            const step = evt.keyCode === keyCodes.top ? -1 : 1;
            let nextSelected = currentSelected + step;
            if (nextSelected >= optionsCount) {
                nextSelected = -1;
            } else if (nextSelected < -1) {
                nextSelected = optionsCount - 1;
            }
            this.setState({
                selected: nextSelected
            });
        } else if (evt.keyCode === keyCodes.enter) {
            if (optionsCount && searchResult[currentSelected]) {
                evt.preventDefault();
                handled = true;

                this.choose(currentSelected);
            } else {
                this.closeOptions();
            }
        } else if (evt.keyCode === keyCodes.esc && optionsCount) {
            evt.preventDefault(); // Escape clears the input on IE.
            handled = true;

            this.closeOptions();
        }

        if (!handled && this.props.onKeyDown) {
            this.props.onKeyDown(evt);
        }
    };

    showNewOptions(text) {
        const value = text || "";
        const pattern = value.trim();

        if (pattern === "") {
            this.closeOptions();
            return;
        }

        this.search(pattern)
            .then(({ Options, ErrorMessage }) => {
                if (this.state.value === value) {
                    let selected = -1;

                    if (Options.length === 1) {
                        selected = 0;
                    }

                    this.setState({
                        searchResult: updateImmutableArrayByKey(this.state.searchResult, Options, "Value"),
                        opened: true,
                        errorMessage: ErrorMessage,
                        selected
                    });
                }
            });
    }

    search(value) {
        const { requestData, url } = this.props;

        return axios
            .get(url, {
                params: {
                    ...requestData,
                    value
                }
            })
            .then(({ data }) => data);
    }

    choose(index) {
        const { onChange, clearOnSelect } = this.props;
        const value = this._valueCreator(this.state.searchResult[index]);

        if (clearOnSelect) {
            this.setState({ value: "" });
        }

        this.closeOptions();

        if (onChange) {
            onChange(value, { source: "AutocompleteOption" });
        }
        this.fireSelect(index);
    }

    fireSelect(index) {
        const { onSelect } = this.props;
        const optionData = this.state.searchResult[index];

        if (optionData && onSelect) {
            return onSelect(optionData.Value, optionData.Text, optionData.Data);
        }
    }

    closeOptions() {
        if (this.state.searchResult.length !== 0) {
            this.setState({
                searchResult: [],
                selected: -1
            });
        }

        if (this.state.opened) {
            this.setState({
                opened: false
            })
        }
    }

    renderOption(optionData, index) {
        const { renderItem, optionItemClassName, optionClassName } = this.props;
        const { value } = this.state;
        const { Text, Description, AdditionalInfo } = optionData;
        const rootClass = cx({
            [styles.item]: true,
            [styles.active]: this.state.selected === index,
            [optionItemClassName]: optionItemClassName
        });
        const optionClass = cx(
            styles.option,
            optionClassName
        );

        return (
            <div key={index}
                className={rootClass}
                data-ft-id={`autocomplete-item-${index}`}
                onMouseDown={(e) => this.handleItemClick(e, index)}
                onMouseEnter={(e) => this.setState({ selected: index })}
                onMouseLeave={(e) => this.setState({ selected: -1 })}>
                {renderItem
                    ? renderItem(optionData, this.state.value)
                    : (<div>
                        <div className={styles["additional-info"]}>
                            {AdditionalInfo}
                        </div>
                        <div className={optionClass}>
                            <Highlighter
                                textToHighlight={Text}
                                searchWords={[value, switchToRusLanguage(value), switchToEngLanguage(value)]} />
                        </div>
                        <div className={styles.description}>
                            {Description}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    renderOptionsList() {
        const { menuWidth, notFoundText } = this.props;

        if (!this.state.opened || !this.state.value) {
            return null;
        }

        const options = this.state.searchResult.map((data, index) => this.renderOption(data, index));

        return (
            <div className={styles.menuHolder}>
                <div className={styles.menu} style={{ width: menuWidth }} data-ft-id="autocomplete-menu">
                    {options.length === 0
                        ? <div className={styles.empty} data-ft-id="autocomplete-empty-result">{notFoundText}</div>
                        : options
                    }
                </div>
            </div>
        );
    }

    render() {
        const fieldsToOmit = ["url", "ftId", "hasSearchIcon", "notFoundText", "requestData", "onSelect", "defaultValue", "clearOnSelect",
            "autocompleteWrapperClassName", "optionItemClassName", "menuWidth", "optionClassName", "valueCreator", "renderItem"];

        const inputProps = omit({
            ...this.props,
            tooltipProps: {
                isOpen: true,
                ...this.props.tooltipProps
            },
            value: this.state.value,
            onBlur: this.handleBlur,
            onFocus: this.handleFocus,
            onKeyDown: this.handleKey,
            onChange: this.handleChange
        }, fieldsToOmit);

        const { hasSearchIcon, ftId } = this.props;
        const { errorMessage } = this.state;

        return (
            <span className={cx(styles.root, this.props.autocompleteWrapperClassName)} data-ft-id={ftId}>
                {hasSearchIcon && <Icon type={IconTypes.Search} className={styles.search} />}
                <TextInput {...inputProps}
                    inputClassName={cx(styles.input, { [styles["with-icon"]]: hasSearchIcon })}
                    placeholderClassName={cx(styles.placeholder, { [styles["with-icon"]]: hasSearchIcon })}
                    isValid={!errorMessage || !inputProps.value}
                    tooltipCaption={errorMessage}
                />

                {!errorMessage && this.renderOptionsList()}
            </span>
        );
    }
}

Autocomplete.propTypes = {
    ftId: PropTypes.string,
    value: PropTypes.string,
    hasSearchIcon: PropTypes.bool,
    clearOnSelect: PropTypes.bool,
    defaultValue: PropTypes.string,
    notFoundText: PropTypes.string,
    source: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func
    ]),

    renderItem: PropTypes.func,
    menuWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    tooltipProps: PropTypes.object,

    onKeyDown: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,

    url: PropTypes.string.isRequired,
    requestData: PropTypes.object,
    valueCreator: PropTypes.func,

    autocompleteWrapperClassName: PropTypes.string,
    optionItemClassName: PropTypes.string,
    optionClassName: PropTypes.string
};

Autocomplete.defaultProps = {
    requestData: {},
    hasSearchIcon: false,
    clearOnSelect: false,
    defaultValue: "",
    notFoundText: "ничего не найдено",
    valueCreator: (searchItem) => searchItem.Text
};

export default Autocomplete;
