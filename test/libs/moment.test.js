import { expect } from "chai";
import moment, { formatDate, inRange, formatDateWithTime, convertString, convertISOString, convertToISO } from "../../libs/moment";

describe("moment adapter", () => {
    describe("formatDate", () => {
        it("should format with rule L", () => {
            expect(formatDate("2013-02-01T00:00:00.000")).to.equal("01.02.2013");
        });

        it("should format with rule LT", () => {
            expect(formatDate("2013-02-01T11:13:00.000", "LT")).to.equal("11:13");
        });

        it("should return null for null date", () => {
            expect(formatDate(null)).to.be.null;
        });
    });

    describe("formatDateWithTime", () => {
        it("should format date correctly", () => {
            expect(formatDateWithTime("2013-02-01T11:13:00.000")).to.equal("01.02.2013 11:13");
        });

        it("should return null for invalud date", () => {
            expect(formatDateWithTime(null)).to.be.null;
        });
    });

    describe("convertString", () => {
        it("should return null for invalid date", () => {
            expect(convertString(null)).to.be.null;
        });
    });

    describe("convertISOString", () => {
        it("should return null for invalid date", () => {
            expect(convertISOString(null)).to.be.null;
        });
    });

    describe("convertToISO", () => {
        it("should convert string date to ISO format", () => {
            expect(convertToISO("2013-02-01T11:13:00.000")).to.equal(moment("2013-02-01T11:13:00.000", moment.ISO_8601).toISOString());
        });

        it("should convert moment date to ISO format", () => {
            const now = moment();
            expect(convertToISO(now)).to.equal(now.toISOString());
        });

        it("should return null for invalid date", () => {
            expect(convertToISO(null)).to.be.null;
        });
    });

    describe("inRange", () => {
        const monday = moment([2017, 8, 28]);
        const tuesday = moment([2017, 8, 29]);
        const wednesday = moment([2017, 8, 30]);

        it("should handle range as inclusive", () => {
            expect(inRange(monday, monday, wednesday)).to.be.true;
            expect(inRange(wednesday, monday, wednesday)).to.be.true;
        });

        it("should work with ISO string", () => {
            const between = tuesday.toISOString();
            const from = monday.toISOString();
            const to = wednesday.toISOString();

            expect(inRange(between, from, to)).to.be.true;
            expect(inRange(from, between, to)).to.be.false;
        });

        it("should work with Date", () => {
            const between = tuesday.toDate();
            const from = monday.toDate();
            const to = wednesday.toDate();

            expect(inRange(between, from, to)).to.be.true;
            expect(inRange(from, between, to)).to.be.false;
        });

        it("should be false if first argument is null or undefined", () => {
            expect(inRange(null, monday, wednesday)).to.be.false;
            expect(inRange(undefined, monday, wednesday)).to.be.false;
        });

        it("should handle null or undefined in minDate and maxDate parameters as open range", () => {
            expect(inRange(monday, null, tuesday)).to.be.true;
            expect(inRange(wednesday, null, tuesday)).to.be.false;
            expect(inRange(wednesday, tuesday, undefined)).to.be.true;
            expect(inRange(monday, tuesday, undefined)).to.be.false;
        });

        it("should handle invalid date in minDate and maxDate parameters as open range", () => {
            expect(inRange(monday, moment(null), tuesday)).to.be.true;
            expect(inRange(wednesday, moment(null), tuesday)).to.be.false;
            expect(inRange(wednesday, tuesday, moment(null))).to.be.true;
            expect(inRange(monday, tuesday, moment(null))).to.be.false;
        });
    });
});
