export const generateAjaxErrorMessage = ({url, requestMethod, data, errorMessage}) => [
    `REQUEST URL: ${url}`,
    `HTTP METHOD: ${requestMethod}`,
    `REQUEST DATA: ${data}`,
    `ERROR MESSAGE: ${errorMessage}`
];
