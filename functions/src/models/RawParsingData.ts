import { EnglishWeekday } from "./Weekday";

export type Food = string;
export type RawParsingData = Record<EnglishWeekday, Food[] | null>;

export const RawParsingData = {
    empty: (): RawParsingData => ({
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
    }),
};
