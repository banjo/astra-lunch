import { LanguageUtil } from "../../utils/LanguageUtil";

const dec = /(\d{1,2}\.\d{1,2})/g;
const double = /(\d{2})/g;
const words = /ascom|acom|agte/gi;
const dot = /(\d{1,2}\.)/g;
const something = /(\d{1,2}:\d{1,2})/g;

const patternsToRemove = [dec, double, words, dot, something];

const removePatterns = text => {
    let newText = text;
    for (const pattern of patternsToRemove) {
        newText = newText.replace(pattern, "");
    }

    return newText;
};

const getIncludedDays = (text: string) => {
    const swedishDays = LanguageUtil.swedishWeekdays;

    const days: string[] = [];

    for (const day of swedishDays) {
        for (const line of text.split("\n")) {
            const regex = new RegExp(`^(${day.trim()})\\s*$`, "i");

            if (regex.test(line)) {
                days.push(day);
            }
        }
    }

    return days;
};

export const parser = (text: string) => {
    const includedDays = getIncludedDays(text);

    if (includedDays.length === 0) {
        throw new Error("No days found");
    }

    const lines = text.split("\n");

    let continueParsing = false;
    const allFood: string[][] = [];
    let foodForDay: string[] = [];
    for (const line of lines) {
        if (line.startsWith("Vecka")) {
            continueParsing = true;
            continue;
        }

        if (!continueParsing) {
            continue;
        }

        if (line.includes("Tillverka din egen")) {
            allFood.push(foodForDay);
            foodForDay = [];
            continue;
        }

        if (line.includes("I lunchpriset")) {
            break;
        }

        const newText = removePatterns(line);

        if (newText.trim().length < 15) {
            continue;
        }

        foodForDay.push(newText.trim());
    }

    const final = {};
    let lunchEntry = 0;
    for (const day of LanguageUtil.swedishWeekdays) {
        const englishDay = LanguageUtil.translateDayToEnglish(day);

        if (!includedDays.includes(day)) {
            final[englishDay] = null;
            continue;
        }

        final[englishDay] = allFood[lunchEntry];
        lunchEntry++;
    }

    return final;
};
