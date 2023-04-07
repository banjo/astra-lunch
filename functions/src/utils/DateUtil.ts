import currentWeekNumber from "current-week-number";
import { EnglishWeekday, SwedishWeekday, Weekday } from "../models/Weekday";

const format = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
};

const getPreviousMondayDate = () => {
    const dateMonday = new Date();
    const day = dateMonday.getDay();
    const diff = dateMonday.getDate() - day + (day === 0 ? -6 : 1);
    dateMonday.setDate(diff);

    return dateMonday;
};

const getWeekNumber = (date: Date): number => {
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

export const DateUtil = { format, getPreviousMondayDate, getWeekNumber, getWeekdaySwedish, getWeekdayEnglish };
