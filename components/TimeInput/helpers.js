export const toArr = string => {
    if (!string) {
        return [0, 0];
    }
    return string.split("").map(el => parseInt(el)).filter(el => !isNaN(el));
};

export const hours = (h, input) => {
    const hoursArr = toArr(h);
    if (hoursArr[0] > 2) {
        setCursorTo(input, 3);
        return [0, hoursArr[0]].join("");
    }

    if (hoursArr[0] === 2 && hoursArr[1] > 3) {
        return "23";
    }
    return h;
};

export const minutes = (m, input) => {
    const minutesArr = toArr(m);
    if (minutesArr[0] > 5) {
        setCursorTo(input, 5);
        return [0, minutesArr[0]].join("");
    }
    return m;
};

export const changeValue = value => (quantity, section) => {
    const [rawHours, rawMinutes] = value.split(":");
    switch (section) {
        case "hours":
            const hours = (rawHours === "__" || rawHours === "23")
                ? "00"
                : Number(rawHours) < 9
                    ? [0, (Number(rawHours) || 0) + quantity].join("")
                    // todo: выпилить эту костылину
                    : rawHours === "0-1"
                        ? "23"
                        : (Number(rawHours) || 0) + quantity;
            return `${hours}:${rawMinutes}`;
        case "minutes":
            const minutes = (rawMinutes === "__" || rawMinutes === "59")
                ? "00"
                : Number(rawMinutes) < 9
                    ? [0, (Number(rawMinutes) || 0) + quantity].join("")
                    // todo: выпилить эту костылину 2
                    : rawMinutes === "0-1"
                        ? "59"
                        : (Number(rawMinutes) || 0) + quantity;
            return `${rawHours}:${minutes}`;
        default:
            return value;
    }
};

export const setCursorTo = (input, end) => {
    setTimeout(() => {
        input.selectionStart = input.selectionEnd = end;
    }, 30);
};