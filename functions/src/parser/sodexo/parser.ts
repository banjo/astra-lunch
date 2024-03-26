import { RawParsingData } from "../../models/RawParsingData";
import { LanguageUtil } from "../../utils/LanguageUtil";

const patternsToRemove = [
    /.*C([0Oo])₂e/g, // Remove everything before and including CO2e
];

const removePatterns = (text: string) => {
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

export const parser = (text: string): RawParsingData => {
    const includedDays = getIncludedDays(text);

    if (includedDays.length === 0) {
        throw new Error("No days found");
    }

    const lines = text.split("\n");

    let continueParsing = false;
    const allFood: string[][] = [];
    let foodForDay: string[] = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.toLowerCase().includes("vecka")) {
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

        let newText = removePatterns(line);

        /**
         * If the line preceding this one ends with the CO2 value,
         * we assume it's due to the text being split over multiple lines.
         * Grab the next line and append it to the current one.
         */
        if (/₂[eе]$/.test(lines[i - 1])) {
            newText = `${line} ${lines[i + 1]}`;
            i++;
        }

        if (newText.trim().length < 15) {
            continue;
        }

        foodForDay.push(newText.trim());
    }

    const final = RawParsingData.empty();
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
