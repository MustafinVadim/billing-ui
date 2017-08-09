import PropTypes from "prop-types";
import { PureComponent } from "react";
import classnames from "classnames";

import { getPages, ellipsis } from "./pagingHelpers";
import PageSizeSwitcher from "./PageSizeSwitcher";
import Themes from "./Themes";
import resolveTheme from "./themeResolver";

class Paging extends PureComponent {
    constructor(props) {
        super(props);

        const { type, styles } = this.props;

        this.styles = styles || resolveTheme(type);
    }

    getPagingItem(pageCount, page, index) {
        const { CurrentPage, onChange } = this.props;
        if (page === ellipsis) {
            return <span key={`ellipsis_${index}`} className={this.styles.ellipsis}>{page}</span>;
        }

        if (CurrentPage.toString() === page) {
            return <span key={`pageNumber_${page}`} className={this.styles.active}>{page}</span>;
        }

        return (
            <span
                key={`pageNumber_${page}`}
                className={this.styles.link}
                onClick={onChange.bind(this, page)}>
                {page}
            </span>
        );
    }

    getPaging() {
        const { PageSize, Total, CurrentPage, middleGroupCount, sideGroupCount } = this.props;
        const pageCount = Math.floor(Total / PageSize) + (Total % PageSize !== 0 ? 1 : 0);
        return getPages(pageCount, CurrentPage, middleGroupCount, sideGroupCount).map((page, index) => this.getPagingItem(pageCount, page, index));
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
                    {showPages && this.getPaging(this.styles)}
                    {pageSizeSwitcherItems && (
                        <PageSizeSwitcher onClick={onSwitchPageSize} items={pageSizeSwitcherItems} active={activePageSize} type={type} styles={styles} />
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
    middleGroupCount: PropTypes.number,
    sideGroupCount: PropTypes.number,
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
    middleGroupCount: 5,
    sideGroupCount: 1,
    type: Themes.GeneralTheme,
    showPages: true
};

export default Paging;
