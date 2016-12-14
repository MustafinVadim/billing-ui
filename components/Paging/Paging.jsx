import { Component, PropTypes } from "react";
import classnames from "classnames";
import { range } from "underscore";

import PageSizeSwitcher from "./PageSizeSwitcher";
import Themes from "./Themes";
import resolveTheme from "./themeResolver";

class Paging extends Component {
    getPage(pageCount, counter, styles) {
        const { CurrentPage, onChange, edgeCount } = this.props;

        const leftEdge = CurrentPage - edgeCount;
        const rightEdge = CurrentPage + edgeCount;

        if (counter !== 1 && counter !== pageCount && (leftEdge >= counter || rightEdge <= counter)) {
            return leftEdge === counter || rightEdge === counter ? <span key={`ellipsis_${counter}`} className={styles.ellipsis}>...</span> : null;
        }

        if (CurrentPage === counter) {
            return <span key={`pageNumber_${counter}`} className={styles.active}>{counter}</span>;
        }

        return (
            <span key={`pageNumber_${counter}`} className={styles.link}
                  onClick={onChange.bind(this, counter)}>
                {counter}
            </span>
        );
    }

    getPages(styles) {
        const { PageSize, Total } = this.props;
        const pageCount = Math.floor(Total / PageSize) + (Total % PageSize !== 0 ? 1 : 0);
        return range(1, pageCount + 1).map(counter => this.getPage(pageCount, counter, styles));
    }

    render() {
        const { PageSize, Total, wrapperClass, type, pageSizeSwitcherItems, onSwitchPageSize, activePageSize } = this.props;

        const styles = resolveTheme(type);

        if (Total <= PageSize) {
            return null;
        }

        const paginationClassNames = classnames(
            styles.pagination,
            wrapperClass
        );

        return (
            <div className={paginationClassNames}>
                <div className={styles.row}>
                    {this.getPages(styles)}
                    {pageSizeSwitcherItems && <PageSizeSwitcher onClick={onSwitchPageSize} items={pageSizeSwitcherItems} active={activePageSize} type={type} />}
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

    onChange: PropTypes.func.isRequired,
    onSwitchPageSize: PropTypes.func,

    pageSizeSwitcherItems: PropTypes.arrayOf(PropTypes.string),
    activePageSize: PropTypes.string,
    wrapperClass: PropTypes.string,
    type: PropTypes.oneOf(Object.keys(Themes))
};

Paging.defaultProps = {
    edgeCount: 5,
    type: Themes.DefaultTheme
};

export default Paging;
