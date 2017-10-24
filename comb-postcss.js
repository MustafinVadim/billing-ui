const csscombOptions = require("./.csscomb.json");
const sortOrder = csscombOptions["sort-order"];

module.exports = {
    parser: "postcss-scss",
    plugins: [
        require("autoprefixer")({ add: false, browsers: [] }),
        require("perfectionist")({
            cascade: true,
            colorCase: "lower",
            colorShorthand: true,
            format: "expanded",
            indentSize: 4,
            trimLeadingZero: true,
            trimTrailingZeros: true,
            maxAtRuleLength: 80,
            maxSelectorLength: 4,
            maxValueLength: 80,
            sourcemap: false,
            syntax: "scss",
            zeroLengthNoUnit: true
        }),
        require("postcss-sorting")({
            "sort-order": sortOrder,
            "empty-lines-between-children-rules": 1
        }),
        require("postcss-eol")
    ]
};
