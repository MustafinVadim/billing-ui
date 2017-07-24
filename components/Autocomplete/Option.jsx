import { PureComponent } from "react";
import PropTypes from "prop-types";
import { switchToRusLanguage, switchToEngLanguage } from "../../helpers/StringHelpers";
import Highlighter from "../Highlighter";
import styles from "./Option.scss";
import cx from "classnames";

class Option extends PureComponent {
    _handleClick = evt => {
        const { onOptionClick, index } = this.props;

        onOptionClick(evt, index);
    };

    _handleMouseEnter = () => {
        const { onHover, index } = this.props;

        onHover(index);
    };

    render() {
        const { optionData, renderItem, optionItemClassName, optionActiveItemClassName, optionClassName, value, index, isSelected, onHoverOut } = this.props;
        const { Text, Description, AdditionalInfo } = optionData;
        const rootClass = cx(
            styles.item,
            {
                [cx(styles.active, optionActiveItemClassName)]: isSelected,
                [optionItemClassName]: !!optionItemClassName
            }
        );
        const optionClass = cx(
            styles.option,
            optionClassName
        );

        return (
            <div className={rootClass}
                 data-ft-id={`autocomplete-item-${index}`}
                 onMouseDown={this._handleClick}
                 onMouseEnter={this._handleMouseEnter}
                 onMouseLeave={onHoverOut}>
                {renderItem
                    ? renderItem(optionData, value)
                    : (
                        <div>
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
}

Option.propTypes = {
    value: PropTypes.string,
    isSelected: PropTypes.bool,
    renderItem: PropTypes.func,
    optionData: PropTypes.shape({
        Text: PropTypes.string,
        Description: PropTypes.string,
        AdditionalInfo: PropTypes.string
    }).isRequired,
    index: PropTypes.number,

    optionItemClassName: PropTypes.string,
    optionActiveItemClassName: PropTypes.string,
    optionClassName: PropTypes.string,

    onOptionClick: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired,
    onHoverOut: PropTypes.func.isRequired
};

export default Option;
