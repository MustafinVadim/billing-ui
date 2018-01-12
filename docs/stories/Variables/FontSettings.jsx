import { PureComponent } from "react";
import PropTypes from "prop-types";

import fontSettings from "!!sass-variable-loader!../../../styles/variables/_font-settings.scss";
import styles from "./FontSettings.scss";

class FontSettings extends PureComponent {
    render() {
        return (
            <div className={styles.wrapper}>
                {
                    (Object.keys(fontSettings)).map((font) => {
                        const isFontSize = font.indexOf("fontSize") !== -1;

                        if (isFontSize) {
                            return (
                                <div className={styles["block"]} key={font} style={{ "font-size": fontSettings[font] }}>
                                    <div className={styles.value}>{fontSettings[font]}</div>
                                    <div className={styles.label}>{font}</div>
                                </div>
                            )
                        }

                        return (
                            <div className={styles["block"]} key={font}>
                                <div className={styles.value}>{fontSettings[font]}</div>
                                <div className={styles.label}>{font}</div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

FontSettings.propTypes = {};

export default FontSettings;
