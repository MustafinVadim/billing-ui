import { expect } from "chai";
import moment, { formatDate, inRange, convertString } from "../../libs/moment";

describe("moment formatDate helper", () => {
    it("should format with rule L", () => {
        const actual = formatDate("2013-02-01T00:00:00.000");
        expect(actual).to.equal("01.02.2013");
    });

    it("should format with rule LT", () => {
        const actual = formatDate("2013-02-01T11:13:00.000", "LT");
        expect(actual).to.equal("11:13");
    });
});

describe.only("moment inRange helper", () => {
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

    it("should handle null in minDate and maxDate parameters as open range", () => {
        expect(inRange(monday, null, tuesday)).to.be.true;
        expect(inRange(wednesday, null, tuesday)).to.be.false;
        expect(inRange(wednesday, tuesday, null)).to.be.true;
        expect(inRange(monday, tuesday, null)).to.be.false;
    });

    it("should handle invalid date in minDate and maxDate parameters as open range", () => {
        expect(inRange(monday, moment(null), tuesday)).to.be.true;
        expect(inRange(wednesday, moment(null), tuesday)).to.be.false;
        expect(inRange(wednesday, tuesday, moment(null))).to.be.true;
        expect(inRange(monday, tuesday, moment(null))).to.be.false;
    });
});
