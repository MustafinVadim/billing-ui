import { PureComponent } from "react";
import PropTypes from "prop-types";
import Link from "../Link";
import styles from "./TryAgain.scss";

class TryAgain extends PureComponent {
    render() {
        const { onRefresh } = this.props;

        return (
            <div className={styles.wrapper} data-ft-id="autocomplete-request-error">
                Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз
                <div className={styles["link-wrapper"]}>
                    <Link onMouseDown={onRefresh}>Обновить</Link>
                </div>
            </div>
        );
    }
}

TryAgain.propTypes = {
    onRefresh: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default TryAgain;
