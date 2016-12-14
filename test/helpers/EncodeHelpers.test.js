import { expect } from "chai";
import { safeDecodeURI, safeEncodeURI } from "../../helpers/EncodeHelpers";

describe("EncodeHelpers", () => {
    const decodedText = "<script>alert(1)</script>";
    const encodedText = "%3Cscript%3Ealert(1)%3C%2Fscript%3E";

    describe("safeEncodeURI", () => {
        it("should return encoded text", () => {
            expect(safeEncodeURI(decodedText)).to.equal(encodedText);
        });

        it("should return null", () => {
            expect(safeEncodeURI(null)).to.be.null;
        });
    });

    describe("safeDecodeURI", () => {
        it("should return decoded text", () => {
            expect(safeDecodeURI(encodedText)).to.equal(decodedText);
        });

        it("should return null", () => {
            expect(safeDecodeURI(null)).to.be.null;
        });
    });
});
