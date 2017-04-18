import PropTypes from "prop-types";
import { PureComponent } from "react";
import ReactHighlightWords from "react-highlight-words";

import styles from "./Highlighter.scss";

class Highlighter extends PureComponent {
    render() {
        const { searchWords } = this.props;
        let searchWordsUpdated = [];

        let highlightProps = {
            ...this.props
        };
        delete highlightProps.searchWords;

        if (typeof searchWords === "string") {
            searchWordsUpdated.push(searchWords);
        } else {
            searchWordsUpdated = searchWords;
        }

        return <ReactHighlightWords { ...highlightProps } searchWords={searchWordsUpdated} />;
    }
}

Highlighter.propTypes = {
    textToHighlight: PropTypes.string.isRequired,
    searchWords: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
    highlightClassName: PropTypes.string,

    activeClassName: PropTypes.string,
    autoEscape: PropTypes.bool
};

Highlighter.defaultProps = {
    autoEscape: true,
    highlightClassName: styles.highlight
};

export default Highlighter;
