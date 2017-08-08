
import range from "lodash/range";
import union from "lodash/union";

export const getPages = (pagesCount, currentPage, groupCount = 3) => {
    if (pagesCount <= groupCount * 2) {
        return range(1, pagesCount + 1).map(page => page.toString());
    }

    const halfGroup = Math.floor(groupCount / 2);
    const hasMiddle = currentPage > halfGroup + 1 && currentPage < pagesCount - halfGroup;

    const firstPages = range(1, groupCount + 1);
    const middlePages = hasMiddle ? range(currentPage - halfGroup, currentPage + halfGroup + 1) : [];
    const lastPages = range(pagesCount - groupCount + 1, pagesCount + 1);

    return union(firstPages, middlePages, lastPages)
        .reduce((result, current, index, array) => {
            const prev = array[index - 1];
            if (current > prev + 1) {
                result.push(ellipsis);
            }
            result.push(current);
            return result;
        }, [])
        .map(i => i.toString());
};

export const ellipsis = "...";