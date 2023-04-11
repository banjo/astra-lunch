import { formatDate, getFirstDayOfWeek } from "@banjoanton/utils";
import currentWeekNumber from "current-week-number";
import { EnglishWeekday, SwedishWeekday, Weekday } from "../models/Weekday";

const format = (date: Date): string => {
    return formatDate(date);
};

const getPreviousMondayDate = () => {
    return getFirstDayOfWeek(new Date());
};

const getWeekNumber = (date = new Date()): number => {
    return currentWeekNumber(date);
};

const getWeekdaySwedish = (date = new Date()): SwedishWeekday => {
    const weekday = date
        .toLocaleString("sv-SE", {
            weekday: "long",
        })
        .toLowerCase();

    return Weekday.fromSwedish(weekday);
};

const getWeekdayEnglish = (date = new Date()): EnglishWeekday => {
    const weekday = date
        .toLocaleString("en-US", {
            weekday: "long",
        })
        .toLowerCase();

    return Weekday.fromEnglish(weekday);
};

export const isWeekend = (date = new Date()): boolean => {
    const weekday = getWeekdayEnglish(date);
    return weekday === "saturday" || weekday === "sunday";
};
export const DateUtil = {
    format,
    getPreviousMondayDate,
    getWeekNumber,
    getWeekdaySwedish,
    getWeekdayEnglish,
};
