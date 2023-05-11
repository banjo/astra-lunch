import { includes } from "@banjoanton/utils";

export const swedishMonths = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
] as const;
export type SwedishWeekday = (typeof swedishMonths)[number];

export const englishMonths = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "septemer",
    "october",
    "november",
    "december",
] as const;
export type EnglishWeekday = (typeof englishMonths)[number];

const fromSwedish = (day: string): SwedishWeekday => {
    if (!includes(swedishMonths, day)) {
        throw new Error(`Invalid weekday: ${day}`);
    }

    return day;
};

const fromEnglish = (day: string): EnglishWeekday => {
    if (!includes(englishMonths, day)) {
        throw new Error(`Invalid weekday: ${day}`);
    }

    return day;
};

const swedishToEnglish = (month: string): EnglishWeekday => {
    if (!includes(swedishMonths, month)) {
        throw new Error(`Invalid month: ${month}`);
    }

    const index = swedishMonths.indexOf(month);

    if (index === -1) {
        throw new Error(`Invalid weekday: ${month}`);
    }

    return englishMonths[index];
};

export const Month = {
    fromSwedish,
    fromEnglish,
    swedishToEnglish,
};
