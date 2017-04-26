import { PureComponent } from "react";
import PropTypes from "prop-types";
import Option from "./Option";
import styles from "./OptionsList.scss";

class OptionsList extends PureComponent {
    render() {
        const { options, notFoundText, ...optionProps } = this.props;

        return options.length === 0
            ? <div className={styles.empty} data-ft-id="autocomplete-empty-result">{notFoundText}</div>
            : <div>{options.map((data, index) => <Option key={`autocomplete-option-${index}`} index={index} optionData={data} { ...optionProps } />)}</div>;
    }
}

OptionsList.propTypes = {
    notFoundText: PropTypes.string,
    options: PropTypes.array
};

export default OptionsList;
