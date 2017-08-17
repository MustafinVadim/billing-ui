import { expect } from "chai";
import {
    isUpperCase,
    innKppResolver,
    datesRangeResolver,
    toLowerFirstLetter,
    toShortProductName,
    translite,
    switchToRusLanguage,
    switchToEngLanguage,
    getPreparedNumber
} from "../../helpers/StringHelpers";

describe("String helper", () => {
    describe("isUpperCase helper", () => {
        it("should return true for string with uppercase letters", () => {
            const actual = isUpperCase("HELLO");
            expect(actual).to.be.true;
        });

        it("should return false for regular string", () => {
            const actual = isUpperCase("HeLLO");
            expect(actual).to.be.false;
        });
    });

    describe("inn kpp resolver", () => {
        it("should return both if both passed", () => {
            const actual = innKppResolver("inn", "kpp");
            expect(actual).to.equal("inn — kpp");
        });

        it("should return only inn if no kpp passed", () => {
            const actual = innKppResolver("inn");
            expect(actual).to.equal("inn");
        });
    });

    describe("dates range resolver", () => {
        it("should return only end date if begin date is null", () => {
            const actual = datesRangeResolver(null, "17.05.2016");
            expect(actual).to.equal("до 17.05.2016");
        });

        it("should return only end date if begin date is undefined", () => {
            const actual = datesRangeResolver(undefined, "17.05.2016");
            expect(actual).to.equal("до 17.05.2016");
        });

        it("should return only end date if begin date is empty string", () => {
            const actual = datesRangeResolver("", "17.05.2016");
            expect(actual).to.equal("до 17.05.2016");
        });

        it("should return only begin date if end date is not passed", () => {
            const actual = datesRangeResolver("17.05.2016");
            expect(actual).to.equal("17.05.2016");
        });

        it("should return only begin date if end date is null", () => {
            const actual = datesRangeResolver("17.05.2016", null);
            expect(actual).to.equal("17.05.2016");
        });

        it("should return only begin date if end date is undefined", () => {
            const actual = datesRangeResolver("17.05.2016", undefined);
            expect(actual).to.equal("17.05.2016");
        });

        it("should return only begin date if end date is empty string", () => {
            const actual = datesRangeResolver("17.05.2016", "");
            expect(actual).to.equal("17.05.2016");
        });

        it("should return null if both dates are empty", () => {
            const actual = datesRangeResolver();
            expect(actual).to.be.null;
        });

        it("should return both dates if two dates passed", () => {
            const actual = datesRangeResolver("15.05.2016", "17.05.2016");
            expect(actual).to.equal("15.05.2016 — 17.05.2016");
        });
    });

    describe("to lower first letter helper", () => {
        it("should lower first letter if passed string length === 1", () => {
            const actual = toLowerFirstLetter("H");
            expect(actual).to.equal("h");
        });

        it("should lower first letter if passed string length >= 2", () => {
            const actual = toLowerFirstLetter("Hi");
            expect(actual).to.equal("hi");
        });

        it("should not die on first non-letter symbol", () => {
            const actual = toLowerFirstLetter("#");
            expect(actual).to.equal("#");
        });

        it("should return empty string if passed string is empty", () => {
            const actual = toLowerFirstLetter("");
            expect(actual).to.equal("");
        });
    });

    describe("to short product name helper", () => {
        it("should trim full name with dot", () => {
            const actual = toShortProductName("Контур.Биллинг");
            expect(actual).to.equal("Биллинг");
        });

        it("should trim full name with hyphen", () => {
            const actual = toShortProductName("Контур-Биллинг");
            expect(actual).to.equal("Биллинг");
        });
    });

    describe("transliteration", () => {
        it("should transliterate russian string", () => {
            expect(translite("Привет")).to.equal("Privet");
        });
    });

    describe("switch to russian language", () => {
        it("should switch to russian language simple string", () => {
            expect(switchToRusLanguage("ghbdtn")).to.equal("привет");
        });

        it("should switch to russian language string with symbols", () => {
            expect(switchToRusLanguage("{}[],.<>:;'`~")).to.equal("ХЪхъбюБЮЖжэёЁ");
            // eslint-disable-next-line quotes
            expect(switchToRusLanguage('"')).to.equal("Э");
        });
    });

    describe("switch to english language", () => {
        it("should switch to english language simple string", () => {
            expect(switchToEngLanguage("руддщ")).to.equal("hello");
        });

        it("should switch to english language string with symbols", () => {
            expect(switchToEngLanguage("ХЪхъбюБЮЖжэ")).to.equal("{}[],.<>:;'");
            // eslint-disable-next-line quotes
            expect(switchToEngLanguage("Э")).to.equal('"');
            // eslint-disable-next-line quotes
            expect(switchToEngLanguage('"')).to.equal("@");
        });
    });

    describe("Префиксы для телефонов getPreparedNumber", () => {
        const prefix = "+7";
        it("Меняет 8 на +7", () => {
            expect(getPreparedNumber("89251234578", prefix)).to.equal("+79251234578");
        });
        it("Сохраняет православное форматирование телефончика", () => {
            expect(getPreparedNumber("8 (922)-125-26-32", prefix)).to.equal("+7 (922)-125-26-32");
        });
    });
});
