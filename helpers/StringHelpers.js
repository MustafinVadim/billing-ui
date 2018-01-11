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

const layoutRuDictionary = {
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

const layoutEnDictionary = {
    "й": "q",
    "Й": "Q",
    "ц": "w",
    "Ц": "W",
    "у": "e",
    "У": "E",
    "к": "r",
    "К": "R",
    "е": "t",
    "Е": "T",
    "н": "y",
    "Н": "Y",
    "г": "u",
    "Г": "U",
    "ш": "i",
    "Ш": "I",
    "щ": "o",
    "Щ": "O",
    "з": "p",
    "З": "P",
    "х": "[",
    "Х": "{",
    "ъ": "]",
    "Ъ": "}",
    "ф": "a",
    "Ф": "A",
    "ы": "s",
    "Ы": "S",
    "в": "d",
    "В": "D",
    "а": "f",
    "А": "F",
    "п": "g",
    "П": "G",
    "р": "h",
    "Р": "H",
    "о": "j",
    "О": "J",
    "л": "k",
    "Л": "K",
    "д": "l",
    "Д": "L",
    "ж": ";",
    "Ж": ":",
    "э": "'",
    // eslint-disable-next-line quotes
    "Э": '"',
    "я": "z",
    "Я": "Z",
    "ч": "x",
    "Ч": "X",
    "с": "c",
    "С": "C",
    "м": "v",
    "М": "V",
    "и": "b",
    "И": "B",
    "т": "n",
    "Т": "N",
    "ь": "m",
    "Ь": "M",
    "б": ",",
    "Б": "<",
    "ю": ".",
    "Ю": ">",
    ".": "/",
    ",": "?",
    // eslint-disable-next-line quotes
    '"': "@"
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
    const replacer = symbol => (layoutRuDictionary[symbol] || symbol);

    return string.replace(/[\S]/g, replacer);
};

export const switchToEngLanguage = string => {
    const replacer = symbol => (layoutEnDictionary[symbol] || symbol);

    return string.replace(/[\S]/g, replacer);
};

export const getPreparedNumber = (number, prefix) => {
    const pattern = /^(([\S\s]*\+7)|([\S\s]*\+))/g;
    const replacedNumber = number.replace(pattern, "");
    const digits = replacedNumber.replace(/\D/g, "");

    if (digits.length >= 11 && replacedNumber[0] === "8") {
        return prefix + replacedNumber.slice(1);
    }

    return prefix + replacedNumber;
};

export const normalizeSearchString = (string) => (string || "")
    .replace(/[^\wА-ЯЁа-яё]+/g, "")
    .toLowerCase();
