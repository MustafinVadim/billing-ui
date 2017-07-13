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
            isMenuOpened: false,
            isControlledByKeys: false
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

    handleChange = (value, evt) => {
        const { onChange } = this.props;

        if (!this.props.value) {
            this.setState({
                value
            });
        }

        this.showNewOptions(value);

        if (onChange) {
            onChange(value, evt, { source: "TextInput" });
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
        this._handleBlur(evt);
    };

    _handleBlur = evt => {
        this.closeOptions();
        if (this.props.onBlur) {
            this.props.onBlur(evt);
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
            default:
                if (this.props.onKeyDown) {
                    this.props.onKeyDown(evt);
                }
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

    _handleMouseMove = () => {
        this.setState({
            isControlledByKeys: false
        });
    };

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
                        isRequestFailed: false,
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
            return onSelect(optionData.Value, optionData.Text, optionData.Data, optionData);
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
            "optionClassName", "valueCreator", "renderItem", "disableOnClickOutside", "outsideClickIgnoreClass"
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
            inputClassName, menuClassName
        } = this.props;
        const { tooltipErrorMessage, isRequestFailed, isMenuOpened, value, searchResult, selectedOptionIndex } = this.state;

        const isValid = !tooltipErrorMessage || !value;
        const shouldRenderMenu = isMenuOpened && !!value;

        return (
            <div className={cx(styles.root, this.props.autocompleteWrapperClassName)} data-ft-id={ftId}>
                {hasSearchIcon && <Icon type={IconTypes.Search} className={styles.search} />}
                <TextInput {...inputProps}
                           inputClassName={cx(styles.input, inputClassName, { [styles["with-icon"]]: hasSearchIcon })}
                           placeholderClassName={cx(styles.placeholder, { [styles["with-icon"]]: hasSearchIcon })}
                           isValid={isValid}
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
    hasSearchIcon: false,
    clearOnSelect: false,
    defaultValue: "",
    notFoundText: "ничего не найдено",
    valueCreator: searchItem => searchItem.Text
};

export default onClickOutside(Autocomplete);
