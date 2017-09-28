import moment from "moment";
import "moment/locale/ru";

moment.locale("ru");

export const formatDate = (date, format = "L") => moment(date).format(format);
export const formatDateWithTime = date => moment(date).format("DD.MM.YYYY HH:mm");
export const convertISOString = (date) => convertString(date, moment.ISO_8601);
export const convertString = (date, format = "DD.MM.YYYY") => moment(date, format, true);
export const convertToISO = (date) => {
    const momentDate = moment(date, moment.ISO_8601);
    return momentDate.isValid() ? momentDate.toISOString() : convertString(date).toISOString();
};

export const inRange = (date, minDate, maxDate) => !!date && moment(date).isValid() && moment(date).isBetween(minDate || null, maxDate || null, "day", "[]");

export default moment;
