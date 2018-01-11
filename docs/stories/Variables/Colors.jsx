import { PureComponent } from "react";
import PropTypes from "prop-types";

import colorSettings from "!!sass-variable-loader!../../../styles/variables/_color-settings.scss";
import styles from "./Colors.scss";

class Colors extends PureComponent {
    render() {
        return (
            <div className={styles.wrapper}>
                {
                    (Object.keys(colorSettings)).map((color) => (
                        <div className={styles["color-wrapper"]} key={color}>
                            <div className={styles.color} style={{ background: colorSettings[color] }}></div>
                            <div className={styles.code}>{colorSettings[color]}</div>
                            <div className={styles.label}>{color}</div>
                        </div>
                    ))
                }
            </div>
        );
    }
}

Colors.propTypes = {};

export default Colors;
