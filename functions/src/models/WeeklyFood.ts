import { generateId } from "../utils";
import { DateUtil } from "../utils/DateUtil";
import { type Restaurant } from "./Restaurant";
import { EnglishWeekday } from "./Weekday";

type Food = Record<EnglishWeekday, string[] | null>;

export type PartialFood = Partial<Food>;

export type WeeklyFood = {
    food: Food;
    dateMonday: string;
    weekNumber: number;
    name: Restaurant;
    successfullyFetched: boolean;
    id: string;
};

const from = (fetched: PartialFood, name: Restaurant): WeeklyFood => {
    const food: Food = {
        monday: fetched.monday ?? null,
        tuesday: fetched.tuesday ?? null,
        wednesday: fetched.wednesday ?? null,
        thursday: fetched.thursday ?? null,
        friday: fetched.friday ?? null,
    };

    const dateMonday = DateUtil.getPreviousMondayDate();
    const weekNumber = DateUtil.getWeekNumber(dateMonday);
    const haveFailed = Object.values(food).every(v => v === null);

    return {
        food,
        dateMonday: DateUtil.format(dateMonday),
        weekNumber,
        name,
        successfullyFetched: !haveFailed,
        id: generateId(),
    };
};

const fail = (name: Restaurant): WeeklyFood => {
    const dateMonday = DateUtil.getPreviousMondayDate();
    const weekNumber = DateUtil.getWeekNumber(dateMonday);

    return {
        food: {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
        },
        dateMonday: DateUtil.format(dateMonday),
        weekNumber,
        name,
        successfullyFetched: false,
        id: generateId(),
    };
};

export const weeklyFood = {
    from,
    fail,
};
