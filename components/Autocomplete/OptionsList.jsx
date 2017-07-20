import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import Scrollbar from "../Scrollbar";
import Option from "./Option";

import styles from "./OptionsList.scss";

class OptionsList extends PureComponent {
    _selectedOptionDOMNode = null;
    _scrollbarElement = null;

    componentDidUpdate(prevProps) {
        const { selectedIndex } = this.props;

        if (selectedIndex !== prevProps.selectedIndex && this._scrollbarElement) {
            this._changeScrollPosition();
        }
    }

    _changeScrollPosition() {
        const selectedOption = this._selectedOptionDOMNode;
        const scrollbar = this._scrollbarElement;

        if (!selectedOption) {
            return;
        }

        const viewportTop = scrollbar.getScrollTop();
        const viewportBottom = viewportTop + scrollbar.getClientHeight();

        const optionTop = selectedOption.offsetTop;
        const optionBottom = optionTop + selectedOption.clientHeight;

        if (optionBottom > viewportBottom) {
            scrollbar.scrollTop(optionBottom - scrollbar.getClientHeight());
        } else if (optionTop < viewportTop) {
            scrollbar.scrollTop(optionTop);
        }
    }

    _setScrollbarElement = (elm) => {
        this._scrollbarElement = elm ? elm.getReactScrollbar() : null;
    };

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
                       style={ { width: width } }
                       ref={this._setScrollbarElement}
            >
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
