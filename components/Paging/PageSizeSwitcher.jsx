import PropTypes from "prop-types";
import { PureComponent } from "react";
import Themes from "./Themes";

import resolveTheme from "./themeResolver";

class PageSizeSwitcher extends PureComponent {
    constructor(props) {
        super(props);

        const { type, styles } = this.props;

        this.styles = styles || resolveTheme(type);
    }

    renderItems() {
        const { items, active, onClick } = this.props;

        return (items || []).map(item => {
            if (active === item) {
                return <span key={item} className={this.styles.active}>{item}</span>
            }

            return <span key={item} onClick={ () => { onClick(item) } } className={this.styles.link}>{item}</span>
        })
    }

    render() {
        return (
            <span className={this.styles.switcher}>
                <span className={this.styles.label}>Показывать по:</span>
                {this.renderItems()}
            </span>
        );
    }
}

PageSizeSwitcher.propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    active: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(Object.keys(Themes)).isRequired,
    onClick: PropTypes.func.isRequired,
    styles: PropTypes.shape({
        switcher: PropTypes.string,
        label: PropTypes.string
    })
};

export default PageSizeSwitcher;
