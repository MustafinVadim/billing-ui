const transliteDictionary = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ж": "g",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "ы": "i",
    "э": "e",
    "А": "A",
    "Б": "B",
    "В": "V",
    "Г": "G",
    "Д": "D",
    "Е": "E",
    "Ж": "G",
    "З": "Z",
    "И": "I",
    "Й": "Y",
    "К": "K",
    "Л": "L",
    "М": "M",
    "Н": "N",
    "О": "O",
    "П": "P",
    "Р": "R",
    "С": "S",
    "Т": "T",
    "У": "U",
    "Ф": "F",
    "Ы": "I",
    "Э": "E",
    "ё": "yo",
    "х": "h",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ъ": "",
    "ь": "",
    "ю": "yu",
    "я": "ya",
    "Ё": "YO",
    "Х": "H",
    "Ц": "TS",
    "Ч": "CH",
    "Ш": "SH",
    "Щ": "SHCH",
    "Ъ": "",
    "Ь": "",
    "Ю": "YU",
    "Я": "YA"
};

const layoutDictionary = {
    "q": "й",
    "Q": "Й",
    "w": "ц",
    "W": "Ц",
    "e": "у",
    "E": "У",
    "r": "к",
    "R": "К",
    "t": "е",
    "T": "Е",
    "y": "н",
    "Y": "Н",
    "u": "г",
    "U": "Г",
    "i": "ш",
    "I": "Ш",
    "o": "щ",
    "O": "Щ",
    "p": "з",
    "P": "З",
    "[": "х",
    "{": "Х",
    "]": "ъ",
    "}": "Ъ",
    "a": "ф",
    "A": "Ф",
    "s": "ы",
    "S": "Ы",
    "d": "в",
    "D": "В",
    "f": "а",
    "F": "А",
    "g": "п",
    "G": "П",
    "h": "р",
    "H": "Р",
    "j": "о",
    "J": "О",
    "k": "л",
    "K": "Л",
    "l": "д",
    "L": "Д",
    ";": "ж",
    ":": "Ж",
    "'": "э",
    // eslint-disable-next-line quotes
    '"': "Э",
    "z": "я",
    "Z": "Я",
    "x": "ч",
    "X": "Ч",
    "c": "с",
    "C": "С",
    "v": "м",
    "V": "М",
    "b": "и",
    "B": "И",
    "n": "т",
    "N": "Т",
    "m": "ь",
    "M": "Ь",
    ",": "б",
    "<": "Б",
    ".": "ю",
    ">": "Ю",
    "`": "ё",
    "~": "Ё"
};

export const isUpperCase = str => str === str.toUpperCase();

export const innKppResolver = (inn, kpp) => {
    let resolvedString = inn;
    resolvedString += kpp ? ` — ${kpp}` : "";

    return resolvedString;
};

export const datesRangeResolver = (beginDate, endDate) => {
    if (!beginDate && !endDate) {
        return null;
    }

    if (!beginDate) {
        return `до ${endDate}`;
    }

    if (!endDate) {
        return beginDate;
    }

    return `${beginDate} — ${endDate}`;
};

export const toLowerFirstLetter = str => {
    if (!str) {
        return "";
    }

    if (str.length === 1) {
        return str.toLowerCase();
    }

    return str.substr(0, 1).toLowerCase() + str.substr(1);
};

export const toShortProductName = string => {
    return string.replace("Контур.", "").replace("Контур-", "");
};

export const translite = string => {
    const replacer = symbol => (transliteDictionary[symbol] || symbol);

    return string.replace(/[А-яёЁ]/g, replacer);
};

export const switchToRusLanguage = string => {
    const replacer = symbol => (layoutDictionary[symbol] || symbol);

    return string.replace(/[\S]/g, replacer);
};
