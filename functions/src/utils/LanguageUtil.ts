const translateDayToEnglish = (day: string): string => {
    const swedishWeekdays = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];
    const englishWeekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const index = swedishWeekdays.indexOf(day.toLowerCase());

    if (index === -1) {
        throw new Error("Invalid Swedish weekday");
    }

    return englishWeekdays[index].toLowerCase();
};

export const LanguageUtil = {
    translateDayToEnglish,
};
