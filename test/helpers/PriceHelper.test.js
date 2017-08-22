import { expect } from "chai";
import { priceFormatHelper } from "../../helpers/PriceHelper.js";

describe("priceFormatHelper", () => {
    it("rounding the fractional part", () => {
        expect(priceFormatHelper(6924.2)).to.equal("6 924.20");
        expect(priceFormatHelper(6924.20)).to.equal("6 924.20");
        expect(priceFormatHelper(6924.25)).to.equal("6 924.25");
        expect(priceFormatHelper(6924.2152)).to.equal("6 924.21");
        expect(priceFormatHelper(18983.60)).to.equal("18 983.60");
        expect(priceFormatHelper(10800983.608888888888)).to.equal("10 800 983.60");

        expect(priceFormatHelper(-6924.2152)).to.equal("-6 924.21");
        expect(priceFormatHelper(-0.35)).to.equal("-0.35");

        expect(priceFormatHelper(6924.2)).not.to.equal("6 924.19");
        expect(priceFormatHelper(18983.60)).not.to.equal("18 983.59");
        expect(priceFormatHelper(10800983.608888888888)).not.to.equal("10 800 983.59");
    });

    it("cuts the fractional part", () => {
        expect(priceFormatHelper(6924.2, false)).to.equal("6 924");
    });
});
