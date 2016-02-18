import { Component, PropTypes } from "react";
import styles from "./ContentFrame.scss";

class ContentFrame extends Component {
    render() {

        const { closeUrl } = this.props;

        return (
            <div className={styles.frame}>
                <a href={closeUrl} className={styles.close} />
                {this.props.children}
            </div>
        );
    }
}

ContentFrame.propTypes = {
    closeUrl: PropTypes.string.isRequired
};

export default ContentFrame;