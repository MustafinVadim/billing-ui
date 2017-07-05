import { PureComponent } from "react";
import PropTypes from "prop-types";

import Autocomplete from "../Autocomplete";
import Label from "./Label";

import styles from "./MultiSelect.scss";

class MultiSelect extends PureComponent {
    render() {
        return (
            <div>
                <Label>test@skbkontur.ru</Label>
                <Autocomplete />
            </div>
        );
    }
}

MultiSelect.propTypes = {};

export default MultiSelect;
