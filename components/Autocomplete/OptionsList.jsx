import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import Option from "./Option";
import styles from "./OptionsList.scss";
import cx from "classnames";

class OptionsList extends PureComponent {
    _selectedOptionDOMNode = null;
    _wrapperDOMNode = null;

    componentDidUpdate(prevProps) {
        const { selectedIndex, maxHeight } = this.props;
        if (selectedIndex !== prevProps.selectedIndex && !!maxHeight) {
            this._changeScrollPosition();
        }
    }

    _changeScrollPosition() {
        const selectedOption = this._selectedOptionDOMNode;
        const wrapper = this._wrapperDOMNode;

        if (!selectedOption || !wrapper) {
            return;
        }
        const viewPortTop = wrapper.scrollTop;
        const viewPortBottom = viewPortTop + wrapper.clientHeight;

        const optionTop = selectedOption.offsetTop;
        const optionBottom = optionTop + selectedOption.clientHeight;

        if (optionBottom > viewPortBottom) {
            wrapper.scrollTop = optionBottom - wrapper.clientHeight;
        } else if (optionTop < viewPortTop) {
            wrapper.scrollTop = optionTop;
        }

    }

    render() {
        const { options, notFoundText, selectedIndex, width, maxHeight, ...optionProps } = this.props;

        const wrapperClassNames = cx({
            [styles.scroll]: !!maxHeight
        });

        return options.length === 0
            ? <div className={styles.empty} data-ft-id="autocomplete-empty-result">{notFoundText}</div>
            : <div className={wrapperClassNames}
                   style={ { width: width, maxHeight: maxHeight } }
                   ref={(elm) => {
                       this._wrapperDOMNode = findDOMNode(elm);
                   }}>
                {options.map((data, index) =>
                    <Option key={`autocomplete-option-${index}`}
                            index={index}
                            isSelected={selectedIndex === index}
                            optionData={data}
                            ref={(elm) => {
                                if (selectedIndex === index) {
                                    this._selectedOptionDOMNode = findDOMNode(elm);
                                }
                            }}
                            { ...optionProps } />)}
            </div>;
    }
}

OptionsList.propTypes = {
    notFoundText: PropTypes.string,
    options: PropTypes.array,
    selectedIndex: PropTypes.number,
    maxHeight: PropTypes.number,
    width: PropTypes.number
};

export default OptionsList;
