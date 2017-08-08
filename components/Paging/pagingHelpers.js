
import range from "lodash/range";
import union from "lodash/union";

export const ellipsis = "...";

export const getPages = (pagesCount, currentPage, middleGroupCount = 5, sideGroupCount = 1) => {
    if (pagesCount <= middleGroupCount + sideGroupCount) {
        return range(1, pagesCount + 1).map(page => page.toString());
    }

    const halfGroup = Math.floor(middleGroupCount / 2);

    const firstGroupStart = 1;
    const firstGroupEnd = sideGroupCount;

    const lastGroupStart = pagesCount - sideGroupCount + 1
    const lastGroupEnd = pagesCount;

    const middleGroupStart = Math.max(firstGroupEnd + 1, currentPage - halfGroup);
    const middleGroupEnd = Math.min(lastGroupStart - 1, currentPage + halfGroup);

    const firstGroup = range(firstGroupStart, firstGroupEnd + 1);
    const middlePages = range(middleGroupStart, middleGroupEnd + 1, 1);
    const lastGroup = range(lastGroupStart, lastGroupEnd + 1);


    return union(firstGroup, middlePages, lastGroup)
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
