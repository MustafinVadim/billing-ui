import { PureComponent } from "react";
import PropTypes from "prop-types";

import styles from "./Legenda.scss";

class Legenda extends PureComponent {
    render() {
        return (
            <div className={styles.root}>
                <span className={styles.marker} /> {this.props.text}
            </div>
        );
    }
}

Legenda.propTypes = {
    text: PropTypes.string
};

export default Legenda;
