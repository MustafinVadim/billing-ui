import { PureComponent } from "react";
import PropTypes from "prop-types";

import styles from "./Legend.scss";

class Legenda extends PureComponent {
    render() {
        const { text, color } = this.props;

        const style = {
            backgroundColor: color
        };

        return (
            <div className={styles.root}>
                <span className={styles.marker} style={style} /> {text}
            </div>
        );
    }
}

Legenda.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string
};

export default Legenda;
