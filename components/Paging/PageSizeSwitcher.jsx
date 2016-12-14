import { PureComponent, PropTypes } from "react";
import Themes from "./Themes";

import resolveTheme from "./themeResolver";

class PageSizeSwitcher extends PureComponent {
    render() {
        const { items, type, onClick, active } = this.props;

        const styles = resolveTheme(type);

        return (
            <span className={styles.wrapper}>
                <span className={styles.label}>Показывать по:</span>
                {(items || []).map(item => {
                    if (active === item) {
                        return (
                            <span className={styles.active}>
                                {item}
                            </span>
                        );
                    }

                    return (
                        <span onClick={() => { onClick({ value: item }) }} className={styles.link}>
                            {item}
                        </span>
                    );
                })}
            </span>
        );
    }
}

PageSizeSwitcher.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    active: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.keys(Themes)).isRequired,
    onClick: PropTypes.func.isRequired
};

export default PageSizeSwitcher;
