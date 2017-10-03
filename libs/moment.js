import moment from "moment";
import "moment/locale/ru";

moment.locale("ru");

export const formatDate = (date, format = "L") => {
    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate.format(format) : null;
};
export const formatDateWithTime = (date) => formatDate(date, "DD.MM.YYYY HH:mm");
export const convertString = (date, format = "DD.MM.YYYY") => {
    const momentDate = moment(date, format, true);
    return momentDate.isValid() ? momentDate : null;
};
export const convertISOString = (date) => convertString(date, moment.ISO_8601);
export const convertToISO = (date) => {
    const momentDate = moment(date, moment.ISO_8601);

    if (momentDate.isValid()) {
        return momentDate.toISOString();
    }

    if (convertString(date)) {
        return convertString(date).toISOString();
    }

    return null;
};

export const inRange = (date, minDate, maxDate) => !!date && moment(date).isValid() && moment(date).isBetween(minDate || null, maxDate || null, "day", "[]");

export default moment;
