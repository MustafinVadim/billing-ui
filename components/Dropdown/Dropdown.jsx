import PropTypes from "prop-types";
import { PureComponent, Children, cloneElement } from "react";
import { findDOMNode } from "react-dom";
import events from "add-event-listener";
import classnames from "classnames";
import findElement from "lodash/find";
import KeyCodes from "./../../helpers/KeyCodes";
import Icon, { IconTypes } from "./../Icon";
import Option from "./Option.jsx";
import dropdownStyles from "./Dropdown.scss";
import { getScrollTopMenu, getSiblingOptions } from "./DropdownHelpers";

class Dropdown extends PureComponent {
    state = {
        activeOption: null,
        isOpened: false
    };

    _availableOptions = [];
    _ignoreMouseOver = false;
    _optionsListNode = null;
    _ignoreTimeout = null;

    constructor(props) {
        super(props);
        this._initOptions(props);
    }

    componentWillMount() {
        this._mounted = true;
    }

    componentDidMount() {
        events.addEventListener(document, "click", this.handleDocumentClick);
        events.addEventListener(document, "keydown", this.handleKeyDown);
    }

    componentWillUpdate(nextProps) {
        this._initOptions({ ...nextProps });
    }

    componentDidUpdate() {
        this.setScrollTop();
    }

    componentWillUnmount() {
        this._mounted = false;

        events.removeEventListener(document, "click", this.handleDocumentClick);
        events.removeEventListener(document, "keydown", this.handleKeyDown);
    }

    setActiveOption(activeOption) {
        this.setState({ activeOption });
    }

    setValue = (newValue) => {
        const { value, onSelect } = this.props;
        this.toggleOptions(false);

        if (newValue !== value && onSelect) {
            onSelect(newValue);
        }
    };

    toggleOptions(isOpened) {
        if (!this.props.disabled) {
            this.setState({
                activeOption: null,
                isOpened: isOpened
            });
        }
    }

    setScrollTop() {
        const { activeOption } = this.state;

        clearTimeout(this._ignoreTimeout);
        if (this._optionsListNode && activeOption) {
            const activeOptionNode = findElement(
                this._availableOptions,
                (element) => element && element.attributes["data-option-id"].value === activeOption
            );

            this._optionsListNode.scrollTop = getScrollTopMenu(
                this._optionsListNode.scrollTop,
                activeOptionNode.offsetTop,
                activeOptionNode.offsetHeight,
                this._optionsListNode.offsetHeight
            );

            this._ignoreTimeout = setTimeout(() => {
                this._ignoreMouseOver = false;
            }, 200);
        }
    }

    handleClick = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        this.toggleOptions(!this.state.isOpened);
    };

    handleDocumentClick = (evt) => {
        if (!this._mounted) {
            return;
        }

        if (this.state.isOpened && !findDOMNode(this).contains(evt.target)) {
            this.toggleOptions(false);
        }
    };

    handleKeyDown = (evt) => {
        if (!this._mounted) {
            return;
        }

        const { activeOption, isOpened } = this.state;

        if (!isOpened || !this._optionValues) {
            return;
        }

        evt.stopPropagation();
        evt.preventDefault();
        const siblingOptions = getSiblingOptions(this._optionValues, activeOption);

        switch (evt.keyCode) {
            case KeyCodes.top:
                this.setActiveOption(siblingOptions.previous);
                this._ignoreMouseOver = true;
                break;
            case KeyCodes.bottom:
                this.setActiveOption(siblingOptions.next);
                this._ignoreMouseOver = true;
                break;
            case KeyCodes.home:
                this.setActiveOption(siblingOptions.first);
                this._ignoreMouseOver = true;
                break;
            case KeyCodes.end:
                this.setActiveOption(siblingOptions.last);
                this._ignoreMouseOver = true;
                break;
            case KeyCodes.pageUp:
                this._optionsListNode.scrollTop -= this._optionsListNode.offsetHeight;
                break;
            case KeyCodes.pageDown:
                this._optionsListNode.scrollTop += this._optionsListNode.offsetHeight;
                break;
            case KeyCodes.esc:
                this.toggleOptions(false);
                break;
            case KeyCodes.enter:
                if (activeOption) {
                    this.setValue(activeOption);
                }
                break;
        }
    };

    handleMouseOver = (activeOption) => {
        if (!this._ignoreMouseOver) {
            this.setActiveOption(activeOption);
        }
    };

    _initOptions({ value, children, defaultCaption }) {
        const options = Children.toArray(children).filter(option => option.type === Option);

        const availableOptions = options.filter(option => !option.props.disabled && value !== option.props.value);
        this._optionValues = availableOptions.map(option => option.props.value);

        const optionCaptions = options.reduce((result, option) => {
            result[option.props.value] = option.props.caption;
            return result;
        }, {});

        this._caption = value && optionCaptions[value] ? optionCaptions[value] : defaultCaption;
    }

    _addNodeInOptionsArray = (node) => {
        this._availableOptions.push(node);
    }

    _cleanOptionsArray = () => {
        this._availableOptions = [];
    }

    getOptionsList() {
        this._cleanOptionsArray();
        const { value, styles, children, optionsClassName } = this.props;

        const options = Children.map(children, option => {
            if (option && option.type === Option) {
                return cloneElement(option, {
                    key: option.props.value || option.props.key,
                    isSelected: value === option.props.value,
                    isActive: this.state.activeOption === option.props.value,
                    dataOptionId: option.props.value,
                    optionRef: node => {
                        this._addNodeInOptionsArray(node);
                    },
                    onClick: this.setValue,
                    onMouseOver: this.handleMouseOver
                });
            }
            return option;
        });

        const optionsStyles = classnames(styles.options, optionsClassName);

        if (options) {
            return (
                <div className={optionsStyles} ref={node => {
                    this._optionsListNode = node
                }} data-ft-id="dropdown-popup">
                    {options}
                </div>
            )
        }

        return null;
    }

    render() {
        const { value, additionalData, width, disabled, styles, className, attributes, fadeCaption, title } = this.props;
        const wrapperClassNames = classnames(styles.wrapper, className, { "with-fade": fadeCaption });
        const selectClassNames = classnames(styles.select, {
            [styles.disabled]: disabled,
            [styles.inactive]: !value
        });

        return (
            <div className={wrapperClassNames} {...attributes}>
                <div className={selectClassNames} onClick={this.handleClick} title={title === undefined ? this._caption : title}>
                    <div className={styles["select-input"]} style={{ "width": width }}>
                        <div className={styles.caption}>{this._caption}</div>
                        <div className={styles["additional-text"]}>{additionalData}</div>
                    </div>
                    <Icon className={styles.icon} type={IconTypes.ArrowTriangleDown} />
                </div>

                {this.state.isOpened && this.getOptionsList()}
            </div>
        );
    }
}

Dropdown.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    title: PropTypes.string,
    defaultCaption: PropTypes.string,
    fadeCaption: PropTypes.bool,
    additionalData: PropTypes.string,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    optionsClassName: PropTypes.string,
    styles: PropTypes.object,
    attributes: PropTypes.object,
    children: PropTypes.node.isRequired
};

Dropdown.defaultProps = {
    styles: dropdownStyles,
    defaultCaption: "Выберите",
    fadeCaption: false
};

export default Dropdown;
