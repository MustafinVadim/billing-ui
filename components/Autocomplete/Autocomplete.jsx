import { PureComponent } from "react";
import PropTypes from "prop-types";
import onClickOutside from "react-onclickoutside";
import debounce from "lodash/debounce";
import omit from "lodash/omit";
import axios from "../../libs/axios";

import TryAgain from "./TryAgain";
import OptionsList from "./OptionsList";
import keyCodes from "../../helpers/KeyCodes";
import { updateImmutableArrayByKey } from "../../helpers/ArrayHelper";

import Icon, { IconTypes } from "../Icon";
import TextInput from "../TextInput";

import styles from "./Autocomplete.scss";
import cx from "classnames";

class Autocomplete extends PureComponent {
    _valueCreator = null;

    constructor(props, context) {
        super(props, context);
        const { value, defaultValue, disableOnClickOutside } = props;

        disableOnClickOutside();
        this._valueCreator = props.valueCreator;

        this.state = {
            searchResult: [],
            selectedOptionIndex: -1,
            tooltipErrorMessage: null,
            value: value ? value : defaultValue,
            isRequestFailed: false,
            isMenuOpened: false
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

    handleChange = value => {
        const { onChange } = this.props;

        if (!this.props.value) {
            this.setState({
                value,
                tooltipErrorMessage: "",
                isRequestFailed: false
            });
        }

        this.showNewOptions(value);

        if (onChange) {
            onChange(value, { sours: "TextInput" });
        }
    };

    handleFocus = evt => {
        const value = evt.target.value || "";

        this.showNewOptions(value);

        if (this.props.onFocus) {
            this.props.onFocus(evt);
        }
    };

    handleClickOutside = evt => {
        this.closeOptions();

        if (this.props.onBlur) {
            this.props.onBlur(evt);
        }
    };

    handleKey = evt => {
        const { searchResult } = this.state;
        const currentSelected = this.state.selectedOptionIndex;
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
                selectedOptionIndex: nextSelected
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
            evt.preventDefault(); // Escape clears the input in IE
            handled = true;

            this.closeOptions();
        }

        if (!handled && this.props.onKeyDown) {
            this.props.onKeyDown(evt);
        }
    };

    handleOptionHover = index => {
        this.setState({
            selectedOptionIndex: index
        });
    };

    handleOptionHoverOut = () => {
        this.setState({
            selectedOptionIndex: -1
        });
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
                    let selectedOptionIndex = -1;

                    if (Options.length === 1) {
                        selectedOptionIndex = 0;
                    }

                    const isMenuOpened = !ErrorMessage;

                    this.setState({
                        searchResult: updateImmutableArrayByKey(this.state.searchResult, Options, "Value"),
                        isMenuOpened,
                        tooltipErrorMessage: ErrorMessage,
                        selectedOptionIndex
                    });

                    if (isMenuOpened) {
                        this.props.enableOnClickOutside();
                    }
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
            .then(({ data }) => data)
            .catch(() => {
                this.props.enableOnClickOutside();
                this.setState({
                    isRequestFailed: true,
                    isMenuOpened: true,
                    searchResult: [],
                    selectedOptionIndex: -1
                });
            });
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
                selectedOptionIndex: -1
            });
        }

        if (this.state.isMenuOpened) {
            this.setState({
                isMenuOpened: false
            })
        }

        this.props.disableOnClickOutside();
    }

    onSearchAgain = () => {
        this.showNewOptions(this.state.value);
        this.closeOptions();
    };

    render() {
        const fieldsToOmit = [
            "url", "ftId", "hasSearchIcon", "notFoundText", "requestData", "onSelect", "defaultValue", "clearOnSelect", "enableOnClickOutside",
            "autocompleteWrapperClassName", "optionItemClassName", "menuWidth", "optionClassName", "valueCreator", "renderItem", "disableOnClickOutside"
        ];

        const inputProps = omit({
            ...this.props,
            tooltipProps: {
                isOpen: true,
                ...this.props.tooltipProps
            },
            value: this.state.value,
            onFocus: this.handleFocus,
            onKeyDown: this.handleKey,
            onChange: this.handleChange
        }, fieldsToOmit);

        const { hasSearchIcon, ftId, menuWidth, notFoundText, renderItem, optionItemClassName, optionClassName } = this.props;
        const { tooltipErrorMessage, isRequestFailed, isMenuOpened, value, searchResult, selectedOptionIndex } = this.state;

        const isValid = !tooltipErrorMessage || !value;
        const shouldRenderMenu = isMenuOpened && !!value;

        return (
            <div className={cx(styles.root, this.props.autocompleteWrapperClassName)} data-ft-id={ftId}>
                {hasSearchIcon && <Icon type={IconTypes.Search} className={styles.search} />}
                <TextInput {...inputProps}
                           inputClassName={cx(styles.input, { [styles["with-icon"]]: hasSearchIcon })}
                           placeholderClassName={cx(styles.placeholder, { [styles["with-icon"]]: hasSearchIcon })}
                           isValid={isValid}
                           tooltipCaption={tooltipErrorMessage}
                />

                {shouldRenderMenu && (
                    <div className={styles.menu} style={{ width: menuWidth }} data-ft-id="autocomplete-menu">
                        {isRequestFailed && <TryAgain onRefresh={this.onSearchAgain} onClose={this.closeOptions} />}
                        {!isRequestFailed && (
                            <OptionsList
                                options={searchResult}
                                notFoundText={notFoundText}
                                value={value}
                                selectedIndex={selectedOptionIndex}
                                optionItemClassName={optionItemClassName}
                                optionClassName={optionClassName}
                                onOptionClick={this.handleItemClick}
                                onHover={this.handleOptionHover}
                                onHoverOut={this.handleOptionHoverOut}
                                renderItem={renderItem} />
                        )}
                    </div>
                )}
            </div>
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
    optionClassName: PropTypes.string,

    enableOnClickOutside: PropTypes.func,
    disableOnClickOutside: PropTypes.func
};

Autocomplete.defaultProps = {
    requestData: {},
    hasSearchIcon: false,
    clearOnSelect: false,
    defaultValue: "",
    notFoundText: "ничего не найдено",
    valueCreator: searchItem => searchItem.Text
};

export default onClickOutside(Autocomplete);
