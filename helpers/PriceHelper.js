﻿export const priceFormatHelper = (amount, needFractionalPart = true) => {
    let isNegative = amount < 0;
    const _amount = Math.abs(amount);

    const integralPart = Math.floor(_amount);
    let fractionalPart = Math.floor(Math.round(_amount * 1000) / 10 - (integralPart * 100));

    let integralNumberString = integralPart.toString();
    const integralFormat = [];
    const integralLength = integralNumberString.length / 3;
    for (let counter = 0; counter < integralLength; counter++) {
        const sliceEdge = integralNumberString.length - Math.min(integralNumberString.length, 3);
        integralFormat.unshift(integralNumberString.slice(sliceEdge));
        integralNumberString = integralNumberString.slice(0, sliceEdge);
    }

    const fractionalFormat = needFractionalPart && fractionalPart !== 0
        ? `.${fractionalPart < 10 ? `0${fractionalPart}` : fractionalPart}`
        : "";

    return (isNegative ? "-" : "") + integralFormat.join(" ") + fractionalFormat;
};

export default {
    priceFormatHelper
};
