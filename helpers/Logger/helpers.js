export const generateAjaxErrorMessage = ({url, requestMethod, data, errorMessage}) => [
    `REQUEST URL: ${url}`,
    `HTTP METHOD: ${requestMethod}`,
    `REQUEST DATA: ${JSON.stringify(data)}`,
    `ERROR MESSAGE: ${errorMessage}`
];
