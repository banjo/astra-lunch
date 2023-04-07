import { englishWeekdays, swedishWeekdays, Weekday } from "../models/Weekday";

const translateDayToEnglish = (day: string): string => {
    const dayAsLowerCase = day.toLowerCase();
    const weekdayInSwedish = Weekday.fromSwedish(dayAsLowerCase);
    const index = swedishWeekdays.indexOf(weekdayInSwedish);

    if (index === -1) {
        throw new Error(`Invalid Swedish weekday: ${day}`);
    }

    return englishWeekdays[index].toLowerCase();
};

export const LanguageUtil = {
    translateDayToEnglish,
    swedishWeekdays,
    englishWeekdays,
};
