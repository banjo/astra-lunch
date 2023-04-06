const swedishWeekdays = ["måndag", "tisdag", "onsdag", "torsdag", "fredag"];
const englishWeekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const translateDayToEnglish = (day: string): string => {
    const index = swedishWeekdays.indexOf(day.toLowerCase());

    if (index === -1) {
        throw new Error("Invalid Swedish weekday");
    }

    return englishWeekdays[index].toLowerCase();
};

export const LanguageUtil = {
    translateDayToEnglish,
    swedishWeekdays,
    englishWeekdays,
};
