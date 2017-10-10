import { convertToISO, convertISOString } from "../libs/moment";
export const getTimeFromDate = (date = "0000-00-00T00:00:00+00:00", canShowTime = true) => {
    const isoDate = convertISOString(convertToISO(date)).format();
    const timeFromDate = isoDate.split("T")[1].split(":").slice(0, 2).join(":");
    return canShowTime && timeFromDate;
};