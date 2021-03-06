﻿import { PureComponent } from "react";
import PropTypes from "prop-types";
import onClickOutside from "react-onclickoutside";
import debounce from "lodash/debounce";
import omit from "lodash/omit";
import { httpMethod } from "../../libs/axios";
import axios, { prepareRequestData } from "../../libs/axios";
import throttle from "lodash/throttle";

import TryAgain from "./TryAgain";
import OptionsList from "./OptionsList";
import keyCodes from "../../helpers/KeyCodes";

import { IconTypes } from "../Icon";
import TextInput from "../TextInput";

import styles from "./Autocomplete.scss";
import cx from "classnames";

class Autocomplete extends PureComponent {
    _valueCreator = null;
    _textInput = null;

    constructor(props) {
        super(props);
        const { value, defaultValue, disableOnClickOutside } = props;

        disableOnClickOutside();
        this._valueCreator = props.valueCreator;

        this.state = {
            searchResult: [],
            selectedOptionIndex: -1,
            tooltipErrorMessage: null,
            value: value ? value : defaultValue,
            isRequestFailed: false,
            isMenuOpened: false,
            isControlledByKeys: false
        };

        this.showNewOptions = debounce(this.showNewOptions, 200);
    }

    focus() {
        this._textInput.focus();
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

    handleChange = (value, evt, data) => {
        const { onChange } = this.props;

        if (!this.props.value) {
            this.setState({
                value
            });
        }

        this.showNewOptions(value);

        if (onChange) {
            onChange(value, evt, {
                ...data,
                source: "TextInput"
            });
        }
    };

    handleFocus = (evt, data) => {
        const value = evt.target.value || "";

        this.showNewOptions(value);

        if (this.props.onFocus) {
            this.props.onFocus(evt, data);
        }
    };

    handleClickOutside = evt => {
        this._handleBlur(evt, {});
    };

    _handleBlur = (evt, data) => {
        this.closeOptions();
        if (this.props.onBlur) {
            this.props.onBlur(evt, data);
        }
    };

    handleKey = evt => {
        const { searchResult, selectedOptionIndex } = this.state;
        const optionsCount = searchResult.length;

        switch (evt.keyCode) {
            case keyCodes.top:
                if (optionsCount > 0) {
                    evt.preventDefault();
                    this.setState({
                        isControlledByKeys: true
                    });
                    this._selectNextOption(-1, selectedOptionIndex, optionsCount);
                }
                break;
            case keyCodes.bottom:
                if (optionsCount > 0) {
                    evt.preventDefault();
                    this.setState({
                        isControlledByKeys: true
                    });
                    this._selectNextOption(1, selectedOptionIndex, optionsCount);
                }
                break;
            case keyCodes.esc:
                if (optionsCount > 0 && this.state.isMenuOpened) {
                    evt.preventDefault();
                    evt.stopPropagation();

                    this.closeOptions();
                }
                break;
            case keyCodes.enter:
                if (optionsCount > 0 && searchResult[selectedOptionIndex]) {
                    evt.preventDefault();

                    this.choose(selectedOptionIndex);
                } else {
                    this.closeOptions();
                }
                break;
        }

        if (this.props.onKeyDown) {
            this.props.onKeyDown(evt);
        }
    };

    handleOptionHover = index => {
        if (!this.state.isControlledByKeys) {
            this.setState({
                selectedOptionIndex: index
            });
        }
    };

    handleOptionHoverOut = () => {
        if (!this.state.isControlledByKeys) {
            this.setState({
                selectedOptionIndex: -1
            });
        }
    };

    _handleMouseMove = throttle(() => {
        this.setState({
            isControlledByKeys: false
        });
    }, 200);

    _selectNextOption = (step, currentIndex, optionsCount) => {
        let nextSelectedIndex = currentIndex + step;
        if (nextSelectedIndex >= optionsCount) {
            nextSelectedIndex = -1;
        } else if (nextSelectedIndex < -1) {
            nextSelectedIndex = optionsCount - 1;
        }

        this.setState({
            selectedOptionIndex: nextSelectedIndex
        });
    };

    _setTextInputNode = (el) => {
        this._textInput = el;
    };

    showNewOptions(text) {
        const { openIfEmpty, enableOnClickOutside } = this.props;
        const value = text || "";
        const pattern = value.trim();

        if (pattern === "" && !openIfEmpty) {
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
                        searchResult: Options,
                        isMenuOpened,
                        tooltipErrorMessage: ErrorMessage,
                        isRequestFailed: false,
                        selectedOptionIndex
                    });

                    if (isMenuOpened) {
                        enableOnClickOutside();
                    }
                }
            });
    }

    search(value) {
        const { requestData, requestMethod, enableOnClickOutside, url } = this.props;

        const requestParams = prepareRequestData(requestMethod, { ...requestData, value });

        return axios[requestMethod](url, requestParams)
            .then(({ data }) => data)
            .catch(() => {
                enableOnClickOutside();
                this.setState({
                    isRequestFailed: true,
                    isMenuOpened: true,
                    searchResult: [],
                    selectedOptionIndex: -1
                });
            });
    }

    choose(index) {
        const { onChange, clearOnSelect, closeOnSelect } = this.props;
        const value = this._valueCreator(this.state.searchResult[index]);

        if (clearOnSelect) {
            this.setState({ value: "" });
        }

        if (closeOnSelect) {
            this.closeOptions();
        }

        if (onChange) {
            onChange(value, {}, { source: "AutocompleteOption" });
        }

        this.fireSelect(index);
    }

    fireSelect(index) {
        const { onSelect } = this.props;
        const optionData = this.state.searchResult[index];

        if (optionData && onSelect) {
            onSelect(optionData.Value, optionData.Text, optionData.Data, optionData);
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
            "autocompleteWrapperClassName", "optionItemClassName", "optionActiveItemClassName", "menuClassName", "menuWidth", "maxMenuHeight",
            "optionClassName", "valueCreator", "renderItem", "disableOnClickOutside", "outsideClickIgnoreClass", "openIfEmpty", "closeOnSelect",
            "openIfNotFound", "requestMethod"
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

        const {
            hasSearchIcon, ftId, menuWidth, maxMenuHeight, notFoundText, renderItem, optionItemClassName, optionActiveItemClassName, optionClassName,
            inputClassName, menuClassName, openIfEmpty, openIfNotFound
        } = this.props;
        const { tooltipErrorMessage, isRequestFailed, isMenuOpened, value, searchResult, selectedOptionIndex } = this.state;

        const isValid = !tooltipErrorMessage || !value;
        const shouldRenderMenu = isMenuOpened && (!!value || openIfEmpty) && (searchResult.length > 0 || openIfNotFound);

        return (
            <div className={cx(styles.root, this.props.autocompleteWrapperClassName)} data-ft-id={ftId}>
                <TextInput {...inputProps}
                    ref={this._setTextInputNode}
                    inputClassName={cx(styles.input, inputClassName)}
                    placeholderClassName={styles.placeholder}
                    isValid={isValid}
                    iconType={hasSearchIcon ? IconTypes.Search : null}
                    tooltipCaption={tooltipErrorMessage}
                    onBlur={this._handleBlur}
                />

                {shouldRenderMenu && (
                    <div className={cx(styles.menu, menuClassName)} data-ft-id="autocomplete-menu" onMouseMove={this._handleMouseMove}>
                        {isRequestFailed && <TryAgain onRefresh={this.onSearchAgain} onClose={this.closeOptions} />}
                        {!isRequestFailed && (
                            <OptionsList
                                options={searchResult}
                                notFoundText={notFoundText}
                                value={value}
                                selectedIndex={selectedOptionIndex}
                                optionItemClassName={optionItemClassName}
                                optionActiveItemClassName={optionActiveItemClassName}
                                optionClassName={optionClassName}
                                onOptionClick={this.handleItemClick}
                                onHover={this.handleOptionHover}
                                onHoverOut={this.handleOptionHoverOut}
                                renderItem={renderItem}
                                maxHeight={maxMenuHeight}
                                width={menuWidth} />
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
    openIfEmpty: PropTypes.bool,
    openIfNotFound: PropTypes.bool,
    closeOnSelect: PropTypes.bool,
    defaultValue: PropTypes.string,
    notFoundText: PropTypes.string,
    maxMenuHeight: PropTypes.number,
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
    requestMethod: PropTypes.oneOf(Object.keys(httpMethod)),
    valueCreator: PropTypes.func,

    autocompleteWrapperClassName: PropTypes.string,
    menuClassName: PropTypes.string,
    optionItemClassName: PropTypes.string,
    optionActiveItemClassName: PropTypes.string,
    optionClassName: PropTypes.string,
    inputClassName: PropTypes.string,

    enableOnClickOutside: PropTypes.func,
    disableOnClickOutside: PropTypes.func
};

Autocomplete.defaultProps = {
    requestData: {},
    requestMethod: httpMethod.get,
    hasSearchIcon: false,
    clearOnSelect: false,
    closeOnSelect: true,
    openIfEmpty: false,
    openIfNotFound: true,
    defaultValue: "",
    notFoundText: "ничего не найдено",
    valueCreator: searchItem => searchItem.Text
};

export default onClickOutside(Autocomplete);
