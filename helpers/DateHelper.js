export const getTimeFromDate = (isoDate, time) => {
    const timeFromDate = isoDate.split("T")[1].split(":").slice(0, 2).join(":");
    return time || (timeFromDate === "00:00" ? "" : timeFromDate);
};