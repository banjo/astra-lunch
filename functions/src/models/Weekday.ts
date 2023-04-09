import { includes } from "@banjoanton/utils";

export const swedishWeekdays = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"] as const;
export type SwedishWeekday = (typeof swedishWeekdays)[number];

export const englishWeekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export type EnglishWeekday = (typeof englishWeekdays)[number];

const fromSwedish = (day: string): SwedishWeekday => {
    if (!includes(swedishWeekdays, day)) {
        throw new Error(`Invalid weekday: ${day}`);
    }

    return day;
};

const fromEnglish = (day: string): EnglishWeekday => {
    if (!includes(englishWeekdays, day)) {
        throw new Error(`Invalid weekday: ${day}`);
    }

    return day;
};

export const Weekday = {
    fromSwedish,
    fromEnglish,
};
