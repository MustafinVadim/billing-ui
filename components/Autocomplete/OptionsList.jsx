import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import Scrollbar from "../Scrollbar";
import Option from "./Option";

import styles from "./OptionsList.scss";

class OptionsList extends PureComponent {
    _selectedOptionDOMNode = null;

    componentDidUpdate(prevProps) {
        const { selectedIndex, maxHeight } = this.props;

        if (selectedIndex !== prevProps.selectedIndex && !!maxHeight) {
            this._changeScrollPosition();
        }
    }

    _changeScrollPosition() {
        const selectedOption = this._selectedOptionDOMNode;

        if (!selectedOption) {
            return;
        }

        const wrapper = selectedOption.parentElement;

        if (!wrapper) {
            return;
        }

        const viewportTop = wrapper.scrollTop;
        const viewportBottom = viewportTop + wrapper.clientHeight;

        const optionTop = selectedOption.offsetTop;
        const optionBottom = optionTop + selectedOption.clientHeight;

        if (optionBottom > viewportBottom) {
            wrapper.scrollTop = optionBottom - wrapper.clientHeight;
        } else if (optionTop < viewportTop) {
            wrapper.scrollTop = optionTop;
        }
    }

    render() {
        const { options, notFoundText, selectedIndex, width, maxHeight, ...optionProps } = this.props;

        const isEmpty = options.length === 0;

        if (isEmpty) {
            return <div className={styles.empty} data-ft-id="autocomplete-empty-result">{notFoundText}</div>
        }

        const optionsList = options.map((data, index) => (
            <Option key={`autocomplete-option-${index}`}
                    index={index}
                    isSelected={selectedIndex === index}
                    optionData={data}
                    ref={elm => {
                        if (selectedIndex === index) {
                            this._selectedOptionDOMNode = findDOMNode(elm);
                        }
                    }}
                    { ...optionProps } />
        ));

        if (!maxHeight) {
            return (
                <div style={ { width: width } }>
                    {optionsList}
                </div>
            )
        }

        return (
            <Scrollbar autoHeight={true}
                       autoHeightMax={maxHeight}
                       hideTracksWhenNotNeeded={true}
                       style={ { width: width } }>
                {optionsList}
            </Scrollbar>
        )
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
