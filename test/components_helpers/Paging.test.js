import { expect } from "chai";
import { getPages } from "../../components/Paging/pagingHelpers";


const itFactory = (pagesCount, currentPage, middleGroupCount, sideGroupCount) => (expectation) => {
    it(`
        Количество станиц: ${pagesCount},
        Текущая страница: ${currentPage},
        Группировка в середине по: ${middleGroupCount} страниц,
        Группировка по краям по ${sideGroupCount} страниц
    `, () => {
            expect(getPages(pagesCount, currentPage, middleGroupCount, sideGroupCount)).to.deep.equal(expectation)
        })
};

describe.only("Paging", () => {
    describe("симметричный", () => {
        itFactory(0, 0, 3, 3)([]);
        itFactory(1, 1, 3, 3)(["1"]);
        itFactory(4, 2, 3, 3)(["1", "2", "3", "4"]);
        itFactory(6, 3, 3, 3)(["1", "2", "3", "4", "5", "6"]);
        itFactory(7, 3, 3, 3)(["1", "2", "3", "4", "5", "6", "7"]);
        itFactory(7, 4, 3, 3)(["1", "2", "3", "4", "5", "6", "7"]);
        itFactory(7, 5, 3, 3)(["1", "2", "3", "4", "5", "6", "7"]);
        itFactory(7, 2, 3, 3)(["1", "2", "3", "...", "5", "6", "7"]);
        itFactory(7, 1, 3, 3)(["1", "2", "3", "...", "5", "6", "7"]);
        itFactory(7, 6, 3, 3)(["1", "2", "3", "...", "5", "6", "7"]);
        itFactory(7, 7, 3, 3)(["1", "2", "3", "...", "5", "6", "7"]);
        itFactory(50, 49, 3, 3)(["1", "2", "3", "...", "48", "49", "50"]);
        itFactory(100, 1, 3, 3)(["1", "2", "3", "...", "98", "99", "100"]);
        itFactory(100, 100, 3, 3)(["1", "2", "3", "...", "98", "99", "100"]);
        itFactory(9, 5, 3, 3)(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
        itFactory(11, 4, 3, 3)(["1", "2", "3", "4", "5", "...", "9", "10", "11"]);
        itFactory(11, 5, 3, 3)(["1", "2", "3", "4", "5", "6", "...", "9", "10", "11"]);
        itFactory(100, 50, 3, 3)(["1", "2", "3", "...", "49", "50", "51", "...", "98", "99", "100"]);
        itFactory(100, 2, 7, 7)(["1", "2", "3", "4", "5", "6", "7", "...", "94", "95", "96", "97", "98", "99", "100"]);
        itFactory(100, 98, 7, 7)(["1", "2", "3", "4", "5", "6", "7", "...", "94", "95", "96", "97", "98", "99", "100"]);
        itFactory(100, 6, 7, 7)(["1", "2", "3", "4", "5", "6", "7", "8", "9", "...", "94", "95", "96", "97", "98", "99", "100"]);
        itFactory(100, 7, 7, 7)(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "...", "94", "95", "96", "97", "98", "99", "100"]);
        itFactory(100, 94, 7, 7)(["1", "2", "3", "4", "5", "6", "7", "...", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"]);
        itFactory(100, 93, 7, 7)(["1", "2", "3", "4", "5", "6", "7", "...", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"]);
        itFactory(100, 50, 7, 7)(
            ["1", "2", "3", "4", "5", "6", "7", "...", "47", "48", "49", "50", "51", "52", "53", "...", "94", "95", "96", "97", "98", "99", "100"]
        );
    });

    describe("асимметричный", () => {
        itFactory(0, 0, 5, 1)([]);
        itFactory(1, 1, 5, 1)(["1"]);
        itFactory(7, 4, 5, 1)(["1", "2", "3", "4", "5", "6", "7"]);
        itFactory(10, 1, 5, 1)(["1", "2", "3", "...", "10"]);
        itFactory(10, 4, 5, 1)(["1", "2", "3", "4", "5", "6", "...", "10"]);
        itFactory(10, 5, 5, 1)(["1", "...", "3", "4", "5", "6", "7", "...", "10"]);
        itFactory(10, 7, 5, 1)(["1", "...", "5", "6", "7", "8", "9", "10"]);
        itFactory(10, 10, 5, 1)(["1", "...", "8", "9", "10"]);
        itFactory(10, 1, 3, 1)(["1", "2", "...", "10"]);
        itFactory(30, 2, 3, 1)(["1", "2", "3", "...", "30"]);
    });
});
