import PropTypes from "prop-types";
import { PureComponent } from "react";
import classnames from "classnames";
import { range } from "underscore";

import PageSizeSwitcher from "./PageSizeSwitcher";
import Themes from "./Themes";
import resolveTheme from "./themeResolver";

class Paging extends PureComponent {
    constructor(props) {
        super(props);

        const { type, styles } = this.props;

        this.styles = styles || resolveTheme(type);
    }

    getPage(pageCount, counter) {
        const { CurrentPage, onChange, edgeCount } = this.props;

        const leftEdge = CurrentPage - edgeCount;
        const rightEdge = CurrentPage + edgeCount;

        if (counter !== 1 && counter !== pageCount && (leftEdge >= counter || rightEdge <= counter)) {
            return leftEdge === counter || rightEdge === counter ? <span key={`ellipsis_${counter}`} className={this.styles.ellipsis}>...</span> : null;
        }

        if (CurrentPage === counter) {
            return <span key={`pageNumber_${counter}`} className={this.styles.active}>{counter}</span>;
        }

        return (
            <span key={`pageNumber_${counter}`} className={this.styles.link}
                  onClick={onChange.bind(this, counter)}>
                {counter}
            </span>
        );
    }

    getPages() {
        const { PageSize, Total } = this.props;
        const pageCount = Math.floor(Total / PageSize) + (Total % PageSize !== 0 ? 1 : 0);
        return range(1, pageCount + 1).map(counter => this.getPage(pageCount, counter));
    }

    render() {
        const { PageSize, Total, wrapperClass, type, pageSizeSwitcherItems, onSwitchPageSize, activePageSize, styles, showPages } = this.props;

        if (Total <= PageSize) {
            return null;
        }

        const paginationClassNames = classnames(
            this.styles.pagination,
            wrapperClass
        );

        return (
            <div className={paginationClassNames}>
                <div className={this.styles.row}>
                    {showPages && this.getPages(this.styles)}
                    {pageSizeSwitcherItems && (
                        <PageSizeSwitcher onClick={onSwitchPageSize} items={pageSizeSwitcherItems} active={activePageSize} type={type} styles={styles}/>
                    )}
                </div>
            </div>
        );
    }
}

Paging.propTypes = {
    Total: PropTypes.number.isRequired,
    CurrentPage: PropTypes.number.isRequired,
    PageSize: PropTypes.number.isRequired,
    edgeCount: PropTypes.number,
    showPages: PropTypes.bool,

    onChange: PropTypes.func.isRequired,
    onSwitchPageSize: PropTypes.func,

    pageSizeSwitcherItems: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    activePageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOf(Object.keys(Themes)),

    wrapperClass: PropTypes.string,
    styles: PropTypes.shape({
        pagination: PropTypes.string,
        row: PropTypes.string,
        link: PropTypes.string,
        active: PropTypes.string,
        ellipsis: PropTypes.string
    })
};

Paging.defaultProps = {
    edgeCount: 5,
    type: Themes.GeneralTheme,
    showPages: true
};

export default Paging;
